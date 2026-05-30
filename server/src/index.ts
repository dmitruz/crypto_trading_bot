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
    BTC: "bitcoin",
    ETH: "ethereum",
    SOL: "solana",
    ADA: "cardano"
};

async function updatePrices() {
    try {
        const ids = Object.values(COIN_MAP).join(",");

        const res = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        );

        const apiPrices = res.data;
        const data = readData();

        if (!Object.keys(apiPrices).length) {
            console.log("No API prices returned");
            return;
        }

        Object.entries(COIN_MAP).forEach(([symbol, realId]) => {
            const price = apiPrices[realId]?.usd;
            if (!price) return;

            if (!data[symbol]) {
                data[symbol] = [];
            }


            const randomMove = price * ((Math.random() - 0.5) * 0.01);

            data[symbol].push({
                date: new Date().toISOString(),
                price: Number((price + randomMove).toFixed(2))
            });

            if (data[symbol].length > 365) {
                data[symbol].shift();
            }
        });

        writeData(data);

        console.log("Prices updated");
    } catch (err) {
        console.error("Error fetching prices:", err);
    }
}
updatePrices();

setInterval(updatePrices, 10_000);

app.get("/prices", (req, res) => {
    res.json(readData());
});

app.get("/prices/:symbol", (req, res) => {
    const data = readData();
    const symbol = req.params.symbol;

    res.json(data[symbol] || []);
});

app.get("/history/:symbol", async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();

    const coinId = COIN_MAP[symbol];

    if (!coinId) {
        return res.status(404).json({ error: "Unknown coin" });
    }

    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
            {
                params: {
                    vs_currency: "usd",
                    days: 30
                }
            }
        );

        res.json(response.data.prices);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});