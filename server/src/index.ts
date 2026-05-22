import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import WebSocket from "ws";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const latestPrices: Record<string, number> = {
    WIR: 0,
    DOD: 0,
    ZVH: 0,
    TOR: 0
};

const history: Record<string, { date: string; price: number }[]> = {
    WIR: [],
    DOD: [],
    ZVH: [],
    TOR: []
};

const BINANCE_STREAM =
    "wss://stream.binance.com:9443/ws/" +
    "btcusdt@trade/" +
    "ethusdt@trade/" +
    "solusdt@trade/" +
    "adausdt@trade";

const ws = new WebSocket(BINANCE_STREAM);

ws.on("message", (msg) => {

    const data = JSON.parse(msg.toString());

    const symbolMap: Record<string, string> = {
        BTCUSDT: "BTC",
        ETHUSDT: "ETH",
        SOLUSDT: "SOL",
        ADAUSDT: "ADA"
    };

    const appSymbol = symbolMap[data.s];

    if (!appSymbol) return;

    const price = Number(data.p);

    latestPrices[appSymbol] = price;

    history[appSymbol].push({
        date: new Date().toISOString(),
        price
    });

    if (history[appSymbol].length > 300) {
        history[appSymbol].shift();
    }

    io.emit("price-update", {
        symbol: appSymbol,
        price
    });
});

app.get("/prices", (_, res) => {
    res.json(latestPrices);
});

app.get("/history/:symbol", (req, res) => {
    res.json(history[req.params.symbol] || []);
});

server.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});