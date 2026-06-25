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

interface HistoryPoint {
    date: string;
    price: number;
}

export default function ChartPage() {

    const { symbol } = useParams();

    const [data, setData] = useState<HistoryPoint[]>([]);

    useEffect(() => {

        if (!symbol) return;

        const fetchHistory = async () => {

            try {

                const res = await fetch(
                    `http://localhost:4000/history/${symbol}`
                );

                const history = await res.json();

                const formatted = history.map((item: any) => ({
                    date: new Date(item.date).toLocaleTimeString(),
                    price: item.price
                }));

                setData(formatted);

            } catch (err) {
                console.error(err);
            }
        };

        fetchHistory();

    }, [symbol]);

    if (!data.length) {
        return <div>Loading chart...</div>;
    }

    return (
        <div style={{
            width: "100%",
            height: "100vh",
            padding: 40
        }}>

            <h2>{symbol} Chart</h2>

            <ResponsiveContainer width="100%" height={400}>

                <LineChart data={data}>

                    <XAxis dataKey="date" />

                    <YAxis domain={["dataMin", "dataMax"]} />

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