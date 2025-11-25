"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UploadCard from "./components/UploadCard";
import ProbabilityChart from "./components/ProbabilityChart"
import MetricsRadar from "./components/MetricsRadar";
import DetailsAccordion from "./components/DetailsAccordion";
import HealthStatus from "./components/HealthStatus";
import { API_URL } from "../constants/api";
import GradcamViewer from "./components/GradcamViewer";
type ApiResult = {
  filename: string;
  predicted_class: string;
  probabilities: Record<string, number>;
  details?: {
    inference_time?: number;
    f1_macro?: number;
    precision_macro?: number;
    recall_macro?: number;
    kappa?: number;
    auc_macro?: number;
    gradcam?: string;

  };
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [data, setData] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);

  const topClass = useMemo(() => {
    if (!data?.probabilities) return null;
    const entries = Object.entries(data.probabilities);
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0];
  }, [data]);

  const handlePredict = async () => {
    if (!file) return;
    setLoading(true);
    setData(null);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("API error");
      const json = (await res.json()) as ApiResult;
      setData(json);
    } catch (e) {
      console.error(e);
      alert("Ocurrió un error al predecir. Revisa consola y API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0b0f14] dark:to-[#0b0f14] text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Bean Disease Classifier
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Clasificación CNN (EfficientNet) de ALS, Bean Rust, Healthy y Unknown.
            </p>
          </div>

          <div className="flex items-center">
            <HealthStatus />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-1 space-y-6">
            <UploadCard
              onFile={(f, url) => {
                setFile(f);
                setPreviewUrl(url);
              }}
              onPredict={handlePredict}
              loading={loading}
              previewUrl={previewUrl}
              predictedClass={data?.predicted_class}
              topProb={topClass?.[1]}
            />

            <AnimatePresence>
              {data?.details && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl bg-white dark:bg-[#111821] shadow-soft p-5"
                >
                  <h3 className="font-semibold mb-3">Resumen de métricas</h3>
                  <MetricsRadar details={data.details} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white dark:bg-[#111821] shadow-soft p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Probabilidad por clase</h2>

                {data?.predicted_class && (
                  <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200">
                    Predicción: {data.predicted_class}
                  </span>
                )}
              </div>

              {data?.probabilities ? (
                <ProbabilityChart probs={data.probabilities} />
              ) : (
                <div className="h-[280px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                  Sube una imagen para ver resultados.
                </div>
              )}

            </motion.div>
            <div className="flex flex-col md:flex-row gap-6">
              {data?.details?.gradcam && (
                <div className="flex-1">
                  <GradcamViewer base64={data.details.gradcam} />
                </div>
              )}

              {data && (
                <div className="flex-1">
                  <DetailsAccordion data={data} />
                </div>
              )}
            </div>



          </div>
        </div>

        <footer className="text-xs text-gray-400 dark:text-gray-600 mt-10">
          Proyecto académico — CNN para enfermedades de frijol.
        </footer>
      </div>
    </main>
  );
}
