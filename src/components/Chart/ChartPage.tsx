
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

interface PricePoint {
    date: string;
    price: number;
}



export default function ChartPage() {
    const { symbol } = useParams();
    const [data, setData] = useState<PricePoint[]>([]);

    useEffect(() => {
        if (!symbol) return;

        const fetchHistory = async () => {
            const res = await fetch(`http://localhost:4000/prices/${symbol}`);
            const history = await res.json();

            const formatted = history.map((point: any) => ({
                ...point,
                date: new Date(point.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })
            }));

            setData(formatted);
        };

        fetchHistory();

        const interval = setInterval(fetchHistory, 10_000);

        return () => clearInterval(interval);
    }, [symbol]);

    if (!data.length) {
        return <div>Loading chart...</div>;
    }


    return (
        <div style={{ width: "100%", height: "100vh", padding: 40 }}>
            <h2>{symbol} Chart</h2>
            <ResponsiveContainer width="100%" height={400}>

                <LineChart data={data}>

                    <XAxis dataKey="time" />

                    <YAxis domain={["auto", "auto"]} />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#00ff88"
                        strokeWidth={2}
                        dot={false}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>
    );
}