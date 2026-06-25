import { useEffect, useState } from "react";
import { socket } from "../services/socket";
import "./TradeHistory.scss";

interface Trade {
    symbol: string;
    type: "BUY" | "SELL";
    price: number;
    quantity: number;
    profit?: number;
    time: string;
}

export default function TradeHistory() {

    const [trades, setTrades] = useState<Trade[]>([]);

    useEffect(() => {

        socket.on("trade", (trade: Trade) => {

            setTrades(prev => [trade, ...prev]);
        });

        return () => {
            socket.off("trade");
        };

    }, []);

    return (
        <div className="trade-history">

            <h2>Trade History</h2>

            {trades.length === 0 && (
                <p>No trades yet...</p>
            )}

            {trades.map((trade, index) => (

                <div
                    key={index}
                    className={`trade-item ${trade.type.toLowerCase()}`}
                >

                    <strong>{trade.type}</strong>

                    {" "}

                    {trade.symbol}

                    {" @ "}

                    ${trade.price.toFixed(2)}

                    {" | Qty: "}

                    {trade.quantity}

                    {trade.profit !== undefined && (
                        <>
                            {" | Profit: "}
                            <span>
                                ${trade.profit.toFixed(2)}
                            </span>
                        </>
                    )}

                    <div className="trade-time">
                        {new Date(trade.time).toLocaleTimeString()}
                    </div>

                </div>
            ))}

        </div>
    );
}