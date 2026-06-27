import { useEffect, useState } from "react";

export default function TradesPage() {

    const [trades, setTrades] = useState<any[]>([]);

    useEffect(() => {

        fetch("http://localhost:4000/trades")
            .then(res => res.json())
            .then(setTrades);

    }, []);

    return (
        <div style={{ padding: 20 }}>

            <h1>Trade History</h1>

            {trades.map((trade, index) => (

                <div key={index}>

                    {trade.type}
                    {" "}
                    {trade.symbol}
                    {" "}
                    @
                    {" "}
                    {trade.price}

                </div>
            ))}

        </div>
    );
}