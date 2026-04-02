
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import { generateChartData } from "./GenerateChartata";
import data from "../../../server/data/prices.json";

export default function ChartPage() {

    const { symbol } = useParams();
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:4000/prices/${symbol}`)
            .then(res => res.json())
            .then(setData);
    }, [symbol]);



    return (
        <div style={{ width: "100%", height: "100vh", padding: 40 }}>

            <h1>{symbol} Chart</h1>

            <ResponsiveContainer width="100%" height={400}>

                <LineChart data={data}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Line dataKey="price" />
                </LineChart>

            </ResponsiveContainer>

        </div>
    );
}