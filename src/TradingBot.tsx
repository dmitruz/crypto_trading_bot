import { useState } from "react";
import { makeMoney } from "./TradingAgine";

export default function TradingBot() {
    const [balance, setBalance] = useState(1000);
    const [profit, setProfit] = useState(0);
    const [running, setRunning] = useState(false);

    const startBot = async () => {
        setRunning(true);
        console.clear();

        const result = await makeMoney({
            balance,
            profit,
            rounds: 5,
            intervalSec: 2,
            onLog: (msg) => console.log(msg)
        });

        setBalance(result.balance);
        setProfit(result.profit);
        setRunning(false);
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Trading Bot</h2>
            <p>Balance: {balance}</p>
            <p>Profit: {profit}</p>

            <button onClick={startBot} disabled={running}>
                {running ? "Running..." : "Start Trading"}
            </button>
        </div>
    );
}

