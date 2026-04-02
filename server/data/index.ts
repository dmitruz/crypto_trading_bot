
import express from "express";
import cors from "cors";
import rawData from "./prices.json";

interface PricePoint {
    date: string;
    price: number;
}

type PriceData = {
    [key: string]: PricePoint[];
};

const data = rawData as PriceData

const app = express();
app.use(cors());

app.get("/prices", (req, res) => {
    res.json(data);
});

app.get("/prices/:symbol", (req, res) => {
    const symbol = req.params.symbol;
    res.json(data[symbol] || []);
});

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});