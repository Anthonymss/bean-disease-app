"use client";
import ReactECharts from "echarts-for-react";

export default function MetricsRadar({
    details,
    accuracy
}: {
    details: {
        f1_macro?: number;
        precision_macro?: number;
        recall_macro?: number;
        kappa?: number;
        auc_macro?: number;
    };
    accuracy: number;
}) {

    const metrics = [
        details.f1_macro ?? 0,
        details.precision_macro ?? 0,
        details.recall_macro ?? 0,
        details.kappa ?? 0,
        details.auc_macro ?? 0,
    ];

    const option = {

        radar: {
            indicator: [
                { name: "F1 macro", max: 1 },
                { name: "Kappa", max: 1 },
                { name: "Precisión macro", max: 1 },
                { name: "Recall macro", max: 1 },
                { name: "AUC macro", max: 1 },
            ],
            splitNumber: 4,
            radius: "70%",
        },

        tooltip: {
            formatter: () => {
                return `
                <div style="padding:4px 2px">
                    <b>Métricas globales</b><br/>
                    F1 macro: ${metrics[0].toFixed(4)}<br/>
                    Kappa: ${metrics[1].toFixed(4)}<br/>
                    Precisión macro: ${metrics[2].toFixed(4)}<br/>
                    Recall macro: ${metrics[3].toFixed(4)}<br/>
                    AUC macro: ${metrics[4].toFixed(4)}
                </div>`;
            }
        },

        series: [
            {
                type: "radar",
                data: [
                    {
                        value: metrics,
                        name: "Modelo",
                    },
                ],
                areaStyle: { opacity: 0.18 },
                lineStyle: { width: 2 },
                symbolSize: 5,
            },
        ],

        animationDuration: 900,
    };

    return (
        <div>
            <div className="w-full h-[220px]">
                <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
            </div>

            <div className="mt-4 p-3 rounded-xl bg-green-600/10 border border-green-600 text-green-400 text-sm font-semibold shadow-sm">
                Accuracy del modelo:
                <span className="ml-2 text-lg font-bold text-green-300">
                    {(accuracy * 100).toFixed(2)}%
                </span>
            </div>
        </div>
    );
}
