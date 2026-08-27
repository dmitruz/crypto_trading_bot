console.log("SERVER STARTING");

import express from "express";
import cors from "cors";
import fs from "fs";
import axios from "axios";

import { createServer } from "http";
import { Server } from "socket.io";
import WebSocket from "ws";


let usdBalance = 1000;

let realizedProfit = 0;


interface Position {
    symbol: string;

    buyPrice: number;

    quantity: number;

    investedUsd: number;

    openedAt: string;
}

const openPositions: Position[] = [];

interface Trade {
    symbol: string;
    type: "BUY" | "SELL";
    price: number;
    quantity: number;
    investedUsd?: number;
    returnedUsd?: number;
    profit?: number;
    time: string;
}

const tradeHistory: Trade[] = [];
let tradingEnabled = false;
let tradingSymbol: string | null = null;

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

const latestPrices: Record<string, number> = {
    BTC: 0,
    ETH: 0,
    SOL: 0,
    ADA: 0
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

    // =========================
    // CURRENT POSITION
    // =========================

    const existingPosition = openPositions.find(
        position => position.symbol === symbol
    );

    // =========================
    // UPDATE LATEST PRICE
    // =========================

    latestPrices[symbol] = price;


    // =========================
    // BUY LOGIC
    // =========================

    if (
        tradingEnabled &&
        tradingSymbol === symbol &&
        openPositions.length === 0
    ) {

        const tradeAmountUsd = 50;

        if (usdBalance >= tradeAmountUsd) {

            const quantity = tradeAmountUsd / price;

            usdBalance -= tradeAmountUsd;

            const position: Position = {
                symbol,
                buyPrice: price,
                quantity,
                investedUsd: tradeAmountUsd,
                openedAt: new Date().toISOString()
            };

            openPositions.push(position);

            const trade = {
                symbol,
                type: "BUY" as const,
                price,
                quantity,
                investedUsd: tradeAmountUsd,
                time: new Date().toISOString()
            };

            tradeHistory.push(trade);

            io.emit("trade", trade);

            console.log(
                "BUY",
                symbol,
                "Price:",
                price,
                "Spent:",
                tradeAmountUsd.toFixed(2),
                "Quantity:",
                quantity.toFixed(6)
            );

            // Send updated balance immediately
            io.emit("portfolio", {
                balance: Number(usdBalance.toFixed(2)),
                profit: Number(realizedProfit.toFixed(2))
            });
        }
    }



    // =========================
    // PRICE HISTORY
    // =========================

    liveHistory[symbol].push({
        date: new Date().toISOString(),
        price
    });

    if (liveHistory[symbol].length > 1000) {
        liveHistory[symbol].shift();
    }

    // =========================
    // LIVE PRICES
    // =========================

    const pricesForFrontend = Object.keys(liveHistory)
        .map(sym => {

            const history = liveHistory[sym];

            const last =
                history[history.length - 1];

            return {
                symbol: sym,
                price: last?.price || 0
            };
        });

    io.emit("prices", pricesForFrontend);

    // =========================
    // PORTFOLIO UPDATE
    // =========================


});

io.on("connection", (socket) => {

    console.log("Frontend connected:", socket.id);

    const pricesForFrontend = Object.keys(latestPrices).map(symbol => ({
        symbol,
        price: latestPrices[symbol]
    }));

    socket.emit("prices", pricesForFrontend);

    socket.emit("portfolio", {
        balance: Number(usdBalance.toFixed(2)),
        profit: Number(
            (realizedProfit)
                .toFixed(2)
        )
    });
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

app.get("/trades", (req, res) => {
    res.json(tradeHistory);
});

app.post("/start-trading", (req, res) => {

    if (tradingEnabled || openPositions.length > 0) {

        return res.json({
            success: false,
            message: "Trading is already active"
        });
    }

    const symbols = Object.keys(COIN_MAP);

    // Pick one random cryptocurrency
    tradingSymbol =
        symbols[Math.floor(Math.random() * symbols.length)];

    tradingEnabled = true;

    console.log(
        "Trading started. Selected:",
        tradingSymbol
    );

    res.json({
        success: true,
        symbol: tradingSymbol
    });
});

app.post("/stop-trading", (req, res) => {

    tradingEnabled = false;

    // No active position
    if (openPositions.length === 0) {

        tradingSymbol = null;

        console.log("Trading stopped. No open position.");

        io.emit("portfolio", {
            balance: Number(usdBalance.toFixed(2)),
            profit: Number(realizedProfit.toFixed(2))
        });

        return res.json({
            success: true,
            message: "Trading stopped. No open position."
        });
    }

    const position = openPositions[0];

    const currentPrice =
        latestPrices[position.symbol];

    if (!currentPrice) {

        return res.status(500).json({
            success: false,
            message: "Current price unavailable"
        });
    }

    // =========================
    // SELL POSITION
    // =========================

    const returnedUsd =
        currentPrice * position.quantity;

    const profit =
        returnedUsd - position.investedUsd;

    usdBalance += returnedUsd;

    realizedProfit += profit;

    const trade = {
        symbol: position.symbol,

        type: "SELL" as const,

        price: currentPrice,

        quantity: position.quantity,

        investedUsd: position.investedUsd,

        returnedUsd,

        profit,

        time: new Date().toISOString()
    };

    tradeHistory.push(trade);

    io.emit("trade", trade);

    console.log(
        "SELL",
        position.symbol,
        "Price:",
        currentPrice,
        "Returned:",
        returnedUsd.toFixed(2),
        "Profit:",
        profit.toFixed(2)
    );

    // Remove position
    openPositions.splice(0, 1);

    tradingSymbol = null;

    // =========================
    // FINAL PORTFOLIO
    // =========================

    io.emit("portfolio", {
        balance: Number(usdBalance.toFixed(2)),
        profit: Number(realizedProfit.toFixed(2))
    });

    res.json({
        success: true,
        symbol: position.symbol,
        sellPrice: currentPrice,
        returnedUsd,
        profit
    });
});

httpServer.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});