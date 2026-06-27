console.log("SERVER STARTING");

import express from "express";
import cors from "cors";
import fs from "fs";
import axios from "axios";

import { createServer } from "http";
import { Server } from "socket.io";
import WebSocket from "ws";


interface Position {
    symbol: string;
    buyPrice: number;
    quantity: number;
    openedAt: string;
}

const openPositions: Position[] = [];

interface Trade {
    symbol: string;
    type: "BUY" | "SELL";
    price: number;
    quantity: number;
    profit?: number;
    time: string;
}

const tradeHistory: Trade[] = [];
let tradingEnabled = false;

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    }
});

app.use(cors());

const liveHistory: Record<string, any[]> = {
    BTC: [],
    ETH: [],
    SOL: [],
    ADA: []
};

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

    const existingPosition = openPositions.find(
        p => p.symbol === symbol
    );
    // Buy logic
    if (tradingEnabled && !existingPosition) {

        const shouldBuy = Math.random() > 0.995;

        if (shouldBuy) {

            const position = {
                symbol,
                buyPrice: price,
                quantity: 1,
                openedAt: new Date().toISOString()
            };

            openPositions.push(position);

            const trade = {
                symbol,
                type: "BUY" as const,
                price,
                quantity: 1,
                time: new Date().toISOString()
            };

            tradeHistory.push(trade);

            io.emit("trade", trade);

            console.log("BUY", symbol, price);
        }
    }
    // sell logic
    if (tradingEnabled && existingPosition) {

        const profitPercent =
            ((price - existingPosition.buyPrice)
                / existingPosition.buyPrice) * 100;

        const shouldSell =
            profitPercent >= 1 || profitPercent <= -1;

        if (shouldSell) {

            const profit =
                (price - existingPosition.buyPrice)
                * existingPosition.quantity;

            const trade = {
                symbol,
                type: "SELL" as const,
                price,
                quantity: existingPosition.quantity,
                profit,
                time: new Date().toISOString()
            };

            tradeHistory.push(trade);

            io.emit("trade", trade);

            const index = openPositions.findIndex(
                p => p.symbol === symbol
            );

            if (index >= 0) {
                openPositions.splice(index, 1);
            }

            console.log(
                "SELL",
                symbol,
                price,
                "Profit:",
                profit.toFixed(2)
            );
        }
    }

    liveHistory[symbol].push({
        date: new Date().toISOString(),
        price
    });

    if (liveHistory[symbol].length > 1000) {
        liveHistory[symbol].shift();
    }

    const latestPrices = Object.keys(liveHistory).map(sym => {

        const history = liveHistory[sym];

        const last = history[history.length - 1];

        return {
            symbol: sym,
            price: last?.price || 0
        };
    });

    io.emit("prices", latestPrices);
});

ws.on("error", (err) => {
    console.error("Binance WS Error:", err);
});

io.on("connection", (socket) => {

    console.log("Frontend connected:", socket.id);

    const latestPrices = Object.keys(liveHistory).map(symbol => {

        const history = liveHistory[symbol];

        const last = history[history.length - 1];

        return {
            symbol,
            price: last?.price || 0
        };
    });

    socket.emit("prices", latestPrices);
});

app.get("/prices", (req, res) => {
    res.json(liveHistory);
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

app.post("/start-trading", (req, res) => {

    tradingEnabled = true;

    console.log("Trading started");

    res.json({
        success: true
    });
});

app.post("/stop-trading", (req, res) => {

    tradingEnabled = false;

    console.log("Trading stopped");

    res.json({
        success: true
    });
});

httpServer.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});