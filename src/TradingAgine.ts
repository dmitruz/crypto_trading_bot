type Range = [number, number, number];

export interface MakeMoneyOptions {
    balance?: number;
    profit?: number;
    intervalSec?: number;
    rounds?: number;
    buyRange?: Range;
    sellRange?: Range;
    onLog?: (msg: string) => void;
}

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

const randRange = ([start, stop, step]: Range): number => {
    const count = Math.floor((stop - start) / step);
    return start + step * Math.floor(Math.random() * count);
};

const now = () =>
    new Date().toLocaleTimeString("en-GB", { hour12: false });

export async function makeMoney({
    balance = 1000,
    profit = 0,
    intervalSec = 2,
    rounds = 2,
    buyRange = [2, 20, 2],
    sellRange = [2, 20, 2],
    onLog
}: MakeMoneyOptions = {}) {

    for (let r = 1; r <= rounds; r++) {
        onLog?.(`=== CYCLE ${r} START ===`);

        await sleep(intervalSec * 1000);
        const buy = randRange(buyRange);
        balance -= buy;
        onLog?.(`[${now()}] BUY  @ ${buy} | Balance: ${balance}`);

        await sleep(intervalSec * 1000);
        const sell = randRange(sellRange);
        balance += sell;

        const tradeProfit = sell - buy;
        profit += tradeProfit;
        onLog?.(
            `[${now()}] SELL @ ${sell} | Trade profit: ${tradeProfit} | Balance: ${balance}`
        );
    }

    onLog?.("All cycles completed ✅");
    return { balance, profit };
}

