import { useRef, useState } from "react";
import { makeMoney, Asset } from "./TradingEngine";

export function useTradingBot(
    balance: number,
    profit: number,
    assets: Asset[],
    onUpdate: (balance: number, profit: number) => void,
    onBuyAsset: (asset: string) => void,
    onSellAsset: () => void
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
            assets,
            onUpdate,
            onBuyAsset,
            onSellAsset,
            isRunning: () => runningRef.current,
            onLog: console.log
        });

        runningRef.current = false;
        setRunning(false);
        onUpdate(result.balance, result.profit);
    };

    const stop = () => {
        runningRef.current = false;
        setRunning(false);
        onSellAsset();
    };

    return { start, stop, running };
}

