import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());

const DATA_PATH = "./data/prices.json";

const readData = () =>
    JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

app.get("/prices", (req, res) => {
    res.json(readData());
});

app.get("/prices/:symbol", (req, res) => {
    const data = readData();
    const symbol = req.params.symbol;

    res.json(data[symbol] || []);
});

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});