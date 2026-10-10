import { useEffect, useState } from "react";

export default function TradesPage() {

    const [trades, setTrades] = useState<any[]>([]);

    useEffect(() => {

        fetch("http://localhost:4000/trades")
            .then(res => res.json())
            .then(setTrades);

    }, []);

    return (

        <div
            style={{
                padding: 20,
                background: "#1f2937",
                minHeight: "100vh",
                color: "white"
            }}
        >

            <h1
                style={{
                    marginBottom: 30
                }}
            >
                Trade History
            </h1>

            {trades.length === 0 && (
                <div>No trades yet</div>
            )}

            {trades.map((trade, index) => (

                <div
                    key={index}
                    style={{
                        background: "#111827",
                        padding: 20,
                        borderRadius: 12,
                        marginBottom: 20,
                        border:
                            trade.type === "BUY"
                                ? "1px solid #10b981"
                                : "1px solid #ef4444"
                    }}
                >

                    <div
                        style={{
                            fontSize: 22,
                            fontWeight: "bold",
                            color:
                                trade.type === "BUY"
                                    ? "#10b981"
                                    : "#ef4444"
                        }}
                    >
                        {trade.type}
                        {" "}
                        {trade.symbol}
                    </div>

                    <div style={{ marginTop: 10 }}>

                        <div>
                            Price:
                            {" "}
                            $
                            {trade.price.toFixed(2)}
                        </div>

                        <div>
                            Quantity:
                            {" "}
                            {trade.quantity.toFixed(6)}
                        </div>

                        {trade.investedUsd && (
                            <div>
                                Spent:
                                {" "}
                                $
                                {trade.investedUsd.toFixed(2)}
                            </div>
                        )}

                        {trade.returnedUsd && (
                            <div>
                                Returned:
                                {" "}
                                $
                                {trade.returnedUsd.toFixed(2)}
                            </div>
                        )}

                        {trade.profit !== undefined && (
                            <div
                                style={{
                                    color:
                                        trade.profit >= 0
                                            ? "#10b981"
                                            : "#ef4444",
                                    fontWeight: "bold"
                                }}
                            >
                                Profit:
                                {" "}
                                $
                                {trade.profit.toFixed(2)}
                            </div>
                        )}

                        <div
                            style={{
                                opacity: 0.7,
                                marginTop: 10,
                                fontSize: 14
                            }}
                        >
                            {new Date(
                                trade.time
                            ).toLocaleString()}
                        </div>

                    </div>

                </div>
            ))}

        </div>
    );
}