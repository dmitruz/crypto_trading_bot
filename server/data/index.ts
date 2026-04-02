
import express from "express";
import cors from "cors";
import data from "./prices.json";

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