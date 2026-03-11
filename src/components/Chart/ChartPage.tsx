
import { useParams } from "react-router-dom";
import { useState } from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import { generateChartData } from "./GenerateChartata";

export default function ChartPage() {

    const { symbol } = useParams();

    const [data] = useState(
        generateChartData(100 + Math.random() * 200)
    );

    return (
        <div style={{ width: "100%", height: "100vh", padding: 40 }}>

            <h1>{symbol} Chart</h1>

            <ResponsiveContainer width="100%" height={400}>

                <LineChart data={data}>

                    <XAxis dataKey="time" />

                    <YAxis />

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