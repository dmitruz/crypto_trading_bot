import { useRef, useState } from "react";
import { makeMoney } from "./TradingAgine";

export function useTradingBot(
    balance: number,
    profit: number,
    onUpdate: (balance: number, profit: number) => void
) {
    const runningRef = useRef(false);
    const [running, setRunning] = useState(false);

    const start = async () => {
        if (runningRef.current) return;

        runningRef.current = true;
        setRunning(true);
        console.clear();

        const result = await makeMoney({
            balance,
            profit,
            intervalSec: 2,
            isRunning: () => runningRef.current,
            onLog: msg => console.log(msg)
        });

        runningRef.current = false;
        setRunning(false);
        onUpdate(result.balance, result.profit);
    };

    const stop = () => {
        runningRef.current = false;
        setRunning(false);
    };

    return { start, stop, running };
}

