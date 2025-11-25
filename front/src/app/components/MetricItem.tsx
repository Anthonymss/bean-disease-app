"use client";

import { useState } from "react";

export default function MetricItem({
    label,
    value,
    simple,
    tech,
    isTime = false,
}: {
    label: string;
    value?: number;
    simple: string;
    tech: string;
    isTime?: boolean;
}) {
    const [show, setShow] = useState(false);

    const display =
        typeof value === "number"
            ? isTime
                ? value.toFixed(4)
                : value.toFixed(3)
            : "—";

    return (
        <div
            className="relative p-4 rounded-xl bg-gray-50 dark:bg-[#0c1219] border border-gray-100 dark:border-gray-800"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
            <div className="text-2xl font-semibold mt-1">{display}</div>

            {show && (
                <div className="absolute z-10 left-0 top-full mt-2 w-[290px] p-3 rounded-lg bg-white dark:bg-[#111821] shadow-lg border dark:border-gray-800 text-xs">
                    <div className="font-semibold mb-1">Explicación simple</div>
                    <div className="text-gray-600 dark:text-gray-300">{simple}</div>
                    <div className="font-semibold mt-2 mb-1">Explicación técnica</div>
                    <div className="text-gray-600 dark:text-gray-300">{tech}</div>
                </div>
            )}
        </div>
    );
}
