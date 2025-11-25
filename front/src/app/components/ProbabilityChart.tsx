"use client";
import ReactECharts from "echarts-for-react";

export default function ProbabilityChart({
    probs,
}: {
    probs: Record<string, number>;
}) {
    const labels = Object.keys(probs);
    const values = labels.map((k) => probs[k] * 100);

    const option = {
        grid: { left: 90, right: 20, top: 10, bottom: 20 },
        xAxis: {
            type: "value",
            max: 100,
            axisLabel: { formatter: "{value}%" },
        },
        yAxis: {
            type: "category",
            data: labels,
        },
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            formatter: (params: any) =>
                `${params[0].name}: ${params[0].value.toFixed(2)}%`,
        },
        series: [
            {
                type: "bar",
                data: values,
                barWidth: 18,
                itemStyle: { borderRadius: [6, 6, 6, 6] },
                emphasis: { focus: "series" },
            },
        ],
        animationDuration: 800,
    };

    return (
        <div className="w-full h-[280px]">
            <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
        </div>
    );
}
