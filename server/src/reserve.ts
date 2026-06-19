// async function updatePrices() {
//     try {
//         const data = readData();

//         for (const [symbol, pair] of Object.entries(COIN_MAP)) {

//             const response = await axios.get(
//                 "https://api.binance.com/api/v3/ticker/price",
//                 {
//                     params: {
//                         symbol: pair
//                     }
//                 }
//             );

//             const price = Number(response.data.price);

//             if (!data[symbol]) {
//                 data[symbol] = [];
//             }

//             data[symbol].push({
//                 date: new Date().toISOString(),
//                 price
//             });

//             if (data[symbol].length > 365) {
//                 data[symbol].shift();
//             }
//         }

//         writeData(data);

//         console.log("Prices updated");

//     } catch (err) {
//         console.error("Binance error:", err);
//     }
// }

// app.get("/prices", (req, res) => {
//     res.json(readData());
// });

// app.get("/prices/:symbol", (req, res) => {
//     const data = readData();
//     const symbol = req.params.symbol;

//     res.json(data[symbol] || []);
// });

// app.get("/history/:symbol", async (req, res) => {

//     const symbol = req.params.symbol.toUpperCase();

//     const pair = COIN_MAP[symbol];

//     if (!pair) {
//         return res.status(404).json({
//             error: "Unknown symbol"
//         });
//     }

//     try {

//         const response = await axios.get(
//             "https://api.binance.com/api/v3/klines",
//             {
//                 params: {
//                     symbol: pair,
//                     interval: "1d",
//                     limit: 365
//                 }
//             }
//         );

//         const history = response.data.map((candle: any[]) => ({
//             date: candle[0],
//             price: Number(candle[4])
//         }));

//         res.json(history);

//     } catch (err) {

//         console.error(err);

//         res.status(500).json({
//             error: "Failed to fetch Binance history"
//         });
//     }
// });


// updatePrices();

// setInterval(updatePrices, 10000);