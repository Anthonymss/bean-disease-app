"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MetricItem from "./MetricItem";

export default function DetailsAccordion({ data }: { data: any }) {
    const [open, setOpen] = useState(true);

    return (
        <div className="rounded-2xl bg-white dark:bg-[#111821] shadow-soft p-6">
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between"
            >
                <h3 className="text-lg font-semibold">Detalles</h3>
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
                                label="Tiempo de inferencia (s)"
                                value={data.inference_time}
                                simple="Tiempo que tardó el modelo en procesar la imagen."
                                tech="Latencia del forward pass sobre la imagen recibida."
                                isTime
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
