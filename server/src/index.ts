
console.log("SERVER STARTING");
import { Server } from "socket.io";
import { createServer } from "http";
import WebSocket from "ws";
import axios from "axios";
import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    }
});

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

const streams = Object.values(COIN_MAP)
    .map(pair => `${pair.toLowerCase()}@trade`)
    .join("/");

const ws = new WebSocket(
    `wss://stream.binance.com:9443/stream?streams=${streams}`
);

ws.on("open", () => {
    console.log("Connected to Binance WebSocket");
});

ws.on("message", (message) => {

    const parsed = JSON.parse(message.toString());

    const streamData = parsed.data;

    const pair = streamData.s;

    const price = Number(streamData.p);

    const symbol = Object.keys(COIN_MAP).find(
        key => COIN_MAP[key] === pair
    );

    if (!symbol) return;

    const data = readData();

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

    writeData(data);

    io.emit("prices", [
        {
            symbol,
            price
        }
    ]);

    console.log(symbol, price);
});

ws.on("error", (err) => {
    console.error("Binance WS Error:", err);
});

io.on("connection", (socket) => {

    console.log("Frontend connected:", socket.id);

    const data = readData();

    const latestPrices = Object.keys(data).map(symbol => {

        const history = data[symbol];

        const last = history[history.length - 1];

        return {
            symbol,
            price: last?.price || 0
        };
    });

    socket.emit("prices", latestPrices);
});

app.get("/prices", (req, res) => {
    res.json(readData());
});

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
                    interval: "1m",
                    limit: 100
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

httpServer.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});