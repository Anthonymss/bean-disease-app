"use client";
import ReactECharts from "echarts-for-react";

export default function MetricsRadar({
    details,
}: {
    details: {
        f1_macro?: number;
        precision_macro?: number;
        recall_macro?: number;
        kappa?: number;
        auc_macro?: number;
    };
}) {
    const indicators = [
        { name: "F1 macro", max: 1 },
        { name: "Precision macro", max: 1 },
        { name: "Recall macro", max: 1 },
        { name: "Kappa", max: 1 },
        { name: "AUC macro", max: 1 },
    ];

    const values = [
        details.f1_macro ?? 0,
        details.precision_macro ?? 0,
        details.recall_macro ?? 0,
        details.kappa ?? 0,
        details.auc_macro ?? 0,
    ];

    const option = {
        radar: {
            indicator: indicators,
            splitNumber: 4,
            radius: "70%",
        },
        tooltip: {
            formatter: (p: any) => {
                const v = p.value.map((x: number) => x.toFixed(3)).join(", ");
                return `Métricas: ${v}`;
            },
        },
        series: [
            {
                type: "radar",
                data: [{ value: values, name: "Modelo" }],
                areaStyle: { opacity: 0.15 },
                symbolSize: 4,
            },
        ],
        animationDuration: 800,
    };

    return (
        <div className="w-full h-[260px]">
            <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
        </div>
    );
}
