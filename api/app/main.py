from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.efficientnet import preprocess_input
from PIL import Image
import numpy as np
import uvicorn

MODEL_PATH = "model/best_model.keras"
IMG_SIZE = (224, 224)

CLASS_NAMES = [
    "als",
    "bean_rust",
    "healthy",
    "unknown"
]


app = FastAPI(
    title="API Clasificación Frijol",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("🔄 Cargando modelo…")
model = load_model(MODEL_PATH)
print("✅ Modelo cargado.")

def predict_image(image: Image.Image):
    image = image.resize(IMG_SIZE)
    image = np.array(image)
    image = preprocess_input(image)
    image = np.expand_dims(image, axis=0)

    preds = model.predict(image)[0]
    class_id = np.argmax(preds)

    return {
        "predicted_class": CLASS_NAMES[class_id],
        "probabilities": {CLASS_NAMES[i]: float(preds[i]) for i in range(len(preds))}
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    img = Image.open(file.file).convert("RGB")
    result = predict_image(img)

    return {
        "filename": file.filename,
        "result": result
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
