"use client";

import { useEffect, useState } from "react";
import { API_URL } from "../../constants/api";

export default function HealthStatus() {
    const [status, setStatus] = useState<"loading" | "ok" | "down">("loading");

    const checkHealth = async () => {
        try {
            const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
            if (!res.ok) {
                setStatus("down");
                return;
            }
            const json = await res.json();
            if (json.status === "ok") setStatus("ok");
            else setStatus("down");
        } catch (err) {
            setStatus("down");
        }
    };

    useEffect(() => {
        checkHealth();
        const interval = setInterval(checkHealth, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-2 text-sm font-medium">
            {status === "loading" && (
                <>
                    <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="text-yellow-600 dark:text-yellow-300">Conectando…</span>
                </>
            )}

            {status === "ok" && (
                <>
                    <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-600 dark:text-green-300">API activa</span>
                </>
            )}

            {status === "down" && (
                <>
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-red-600 dark:text-red-300">API caída</span>
                </>
            )}
        </div>
    );
}
