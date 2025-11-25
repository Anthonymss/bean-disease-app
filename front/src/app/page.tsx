"use client";

import { useState } from "react";
import ImageUploader from "./components/ImageUploader";
import ResultCard from "./components/ResultCard";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const URL_API = "http://localhost:8000"
  const API_URL = `${URL_API}/predict`;
  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      setResult(json.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Clasificador de Enfermedades del Frijol 🌱
        </h1>

        <ImageUploader onFileSelected={setSelectedFile} />

        <button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className="w-full mt-5 bg-green-600 hover:bg-green-700 transition text-white font-semibold py-3 rounded-lg disabled:bg-gray-300"
        >
          {loading ? "Procesando..." : "Enviar imagen"}
        </button>

        {result && (
          <div className="mt-8">
            <ResultCard result={result} />
          </div>
        )}
      </div>
    </main>
  );
}
