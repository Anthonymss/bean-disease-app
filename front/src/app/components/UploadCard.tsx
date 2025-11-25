"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function UploadCard({
    onFile,
    onPredict,
    loading,
    previewUrl,
    predictedClass,
    topProb,
}: {
    onFile: (file: File | null, url: string | null) => void;
    onPredict: () => void;
    loading: boolean;
    previewUrl: string | null;
    predictedClass?: string;
    topProb?: number;
}) {
    const handleSelect = (e: any) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        onFile(f, url);
    };

    return (
        <div className="rounded-2xl bg-white dark:bg-[#111821] shadow-soft p-6">
            <h2 className="text-lg font-semibold mb-4">Subir imagen</h2>

            {!previewUrl ? (
                <label className="h-52 w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-green-500 transition">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Arrastra o haz clic para subir
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        JPG / PNG — recomendado 224×224+
                    </p>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleSelect}
                    />
                </label>
            ) : (
                <div className="relative w-full h-52 rounded-xl overflow-hidden border dark:border-gray-700">
                    <Image src={previewUrl} alt="preview" fill className="object-cover" />
                </div>
            )}

            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onPredict}
                disabled={!previewUrl || loading}
                className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl disabled:bg-gray-300 disabled:text-gray-600 dark:disabled:bg-gray-800 dark:disabled:text-gray-500 transition"
            >
                {loading ? "Procesando…" : "Predecir"}
            </motion.button>

            {predictedClass && (
                <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-[#0c1219] border dark:border-gray-800">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Clase predicha
                    </div>
                    <div className="text-xl font-semibold mt-1">
                        {predictedClass}
                    </div>
                    {typeof topProb === "number" && (
                        <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                            Confianza: {(topProb * 100).toFixed(2)}%
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
