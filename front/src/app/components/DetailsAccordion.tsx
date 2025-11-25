"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MetricItem from "./MetricItem";

export default function DetailsAccordion({ data }: { data: any }) {
    const [open, setOpen] = useState(false);

    const d = data.details || {};

    return (
        <div className="rounded-2xl bg-white dark:bg-[#111821] shadow-soft p-6">
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between"
            >
                <h3 className="text-lg font-semibold">Ver más detalles</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {open ? "Ocultar" : "Mostrar"}
                </span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-3 overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <MetricItem
                                label="F1 macro"
                                value={d.f1_macro}
                                simple="Balance entre precisión y recall en promedio."
                                tech="Promedio no ponderado del F1 por clase."
                            />
                            <MetricItem
                                label="Precision macro"
                                value={d.precision_macro}
                                simple="Cuántas predicciones fueron correctas en promedio."
                                tech="Promedio no ponderado de precisión por clase."
                            />
                            <MetricItem
                                label="Recall macro"
                                value={d.recall_macro}
                                simple="Cuántos casos reales detectó el modelo en promedio."
                                tech="Promedio no ponderado de recall por clase."
                            />
                            <MetricItem
                                label="Kappa"
                                value={d.kappa}
                                simple="Mejora frente a clasificación aleatoria."
                                tech="Coeficiente Cohen’s Kappa: acuerdo observado vs esperado."
                            />
                            <MetricItem
                                label="AUC macro"
                                value={d.auc_macro}
                                simple="Capacidad de separar correctamente las clases."
                                tech="Promedio del área bajo curva ROC por clase."
                            />
                            <MetricItem
                                label="Tiempo inferencia (s)"
                                value={d.inference_time}
                                simple="Tiempo que tardó en predecir."
                                tech="Latencia de forward pass en CPU."
                                isTime
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
