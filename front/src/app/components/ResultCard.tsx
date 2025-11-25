export default function ResultCard({ result }: { result: any }) {
    const { predicted_class, probabilities } = result;

    return (
        <div className="w-full bg-gray-100 p-5 rounded-xl shadow-inner">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                Resultado: <span className="text-green-700">{predicted_class}</span>
            </h2>

            <div className="space-y-3">
                {Object.entries(probabilities).map(([label, prob]: any) => {
                    const pct = (prob * 100).toFixed(2);

                    return (
                        <div key={label}>
                            <div className="flex justify-between text-gray-700 mb-1">
                                <span>{label}</span>
                                <span>{pct}%</span>
                            </div>

                            <div className="w-full bg-white rounded-full h-3 shadow-inner">
                                <div
                                    className="bg-green-600 h-3 rounded-full transition-all"
                                    style={{ width: `${pct}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
