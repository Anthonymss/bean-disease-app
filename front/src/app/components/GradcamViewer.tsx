"use client";

export default function GradcamViewer({ base64 }: { base64: string }) {
    if (!base64) return null;

    return (
        <div className="rounded-2xl bg-white dark:bg-[#111821] shadow-soft p-5">
            <h3 className="font-semibold mb-3">Mapa de calor (Grad-CAM)</h3>

            <div className="w-full overflow-hidden rounded-xl border dark:border-gray-700">
                <img
                    src={`data:image/png;base64,${base64}`}
                    className="w-full object-contain"
                    alt="Grad-CAM visualization"
                />
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Áreas en rojo = zonas que más influyeron en la predicción del modelo.
            </p>
        </div>
    );
}
