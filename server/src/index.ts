import express from "express";
import cors from "cors";
import fs from "fs";
import axios from "axios";

const app = express();
app.use(cors());

const DATA_PATH = "./data/prices.json";

const readData = () =>
    JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

const writeData = (data: any) =>
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

const COIN_MAP: Record<string, string> = {
    BTC: "BTCUSDT",
    ETH: "ETHUSDT",
    SOL: "SOLUSDT",
    ADA: "ADAUSDT"
};

async function updatePrices() {
    try {
        const data = readData();

        for (const [symbol, pair] of Object.entries(COIN_MAP)) {

            const res = await axios.get(
                "https://api.binance.com/api/v3/ticker/price",
                {
                    params: {
                        symbol: pair
                    }
                }
            );

            const price = Number(res.data.price);

            if (!data[symbol]) {
                data[symbol] = [];
            }

            data[symbol].push({
                date: new Date().toISOString(),
                price
            });

            if (data[symbol].length > 365) {
                data[symbol].shift();
            }
        }

        writeData(data);

        console.log("Prices updated");

    } catch (err) {
        console.error("Error fetching prices:", err);
    }
}

app.get("/history/:symbol", async (req, res) => {

    const symbol = req.params.symbol.toUpperCase();

    const pair = COIN_MAP[symbol];

    if (!pair) {
        return res.status(404).json({
            error: "Unknown symbol"
        });
    }

    try {

        const response = await axios.get(
            "https://api.binance.com/api/v3/klines",
            {
                params: {
                    symbol: pair,
                    interval: "1d",
                    limit: 365
                }
            }
        );

        const history = response.data.map((candle: any[]) => ({
            date: candle[0],
            price: Number(candle[4])
        }));

        res.json(history);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to fetch Binance history"
        });
    }
});

app.get("/prices", (req, res) => {
    res.json(readData());
});

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});