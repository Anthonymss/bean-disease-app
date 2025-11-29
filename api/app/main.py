from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.efficientnet import preprocess_input
from PIL import Image
import numpy as np
import uvicorn
import time
from pathlib import Path
import json
import tensorflow as tf
import cv2
import base64
from io import BytesIO

# ================================
# CONFIGURACIÓN
# ================================

METRICS_PATH = Path("metrics/metrics.json")
MODEL_PATH = "model/best_model.keras"
IMG_SIZE = (224, 224)

CLASS_NAMES = ["als", "bean_rust", "healthy", "unknown"]

MODEL = None
MODEL_METRICS = {}

# ================================
# CARGAR MÉTRICAS UNA VEZ
# ================================

if METRICS_PATH.exists():
    print("📊 Cargando métricas del modelo…")
    with open(METRICS_PATH, "r") as f:
        MODEL_METRICS = json.load(f)
    print("✔ Métricas cargadas.")
else:
    print("⚠ No se encontró metrics.json.")

# ================================
# DEFINICIÓN DE LA APP
# ================================

app = FastAPI(title="API Clasificación Frijol", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================================
# CARGAR MODELO SOLO EN STARTUP
# ================================

@app.on_event("startup")
async def load_the_model():
    global MODEL
    print("🔄 Cargando modelo en memoria (startup)…")
    MODEL = load_model(MODEL_PATH)
    print("✅ Modelo cargado correctamente.")

# ================================
# FUNCIONES DEL MODELO
# ================================

def generate_gradcam(image: Image.Image, model, class_idx):
    img = image.resize(IMG_SIZE)
    img_arr = np.array(img).astype(np.float32)
    img_input = preprocess_input(img_arr)
    img_input = np.expand_dims(img_input, axis=0)

    effnet = model.get_layer("efficientnetb0")

    cam_model = tf.keras.models.Model(
        inputs=effnet.input,
        outputs=[effnet.get_layer("top_conv").output, effnet.output]
    )

    img_tensor = tf.convert_to_tensor(img_input, dtype=tf.float32)

    with tf.GradientTape() as tape:
        conv_outputs, features = cam_model(img_tensor)
        gap = tf.reduce_mean(features, axis=(1, 2))
        final_dense = model.get_layer("dense")
        weights = final_dense.weights[0]
        bias = final_dense.weights[1]
        logits = tf.matmul(gap, weights) + bias
        loss = logits[:, class_idx]

    grads = tape.gradient(loss, conv_outputs)
    weights = tf.reduce_mean(grads, axis=(0, 1, 2))

    cam = tf.reduce_sum(weights * conv_outputs[0], axis=-1).numpy()
    cam = cv2.resize(cam, IMG_SIZE)
    cam = np.maximum(cam, 0)
    cam = cam / (cam.max() + 1e-7)

    heatmap = np.uint8(255 * cam)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

    output = cv2.addWeighted(img_arr.astype(np.uint8), 0.5, heatmap, 0.5, 0)
    return output


def predict_image(image: Image.Image, model):
    image = image.resize(IMG_SIZE)
    image = np.array(image)
    image = preprocess_input(image)
    image = np.expand_dims(image, axis=0)

    preds = model.predict(image)[0]
    class_id = np.argmax(preds)

    return class_id, preds

# ================================
# ENDPOINTS API
# ================================

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    start = time.time()

    img = Image.open(file.file).convert("RGB")

    class_id, preds = predict_image(img, MODEL)

    gradcam_np = generate_gradcam(img, MODEL, class_id)

    gradcam_img = Image.fromarray(gradcam_np)
    buffer = BytesIO()
    gradcam_img.save(buffer, format="PNG")
    gradcam_b64 = base64.b64encode(buffer.getvalue()).decode()

    return {
        "filename": file.filename,
        "predicted_class": CLASS_NAMES[class_id],
        "probabilities": {CLASS_NAMES[i]: float(preds[i]) for i in range(len(preds))},
        "model_metrics": MODEL_METRICS,
        "image_metrics": {
            "inference_time": round(time.time() - start, 4),
            "gradcam": gradcam_b64
        }
    }

@app.get("/health")
async def health():
    return {"status": "ok"}

# ================================
# PRODUCCIÓN: SIN RELOAD
# ================================
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=10000)