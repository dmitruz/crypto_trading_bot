export type Range = [number, number, number];

export interface MakeMoneyOptions {
    balance?: number;
    profit?: number;
    intervalSec?: number;
    rounds?: number;
    buyRange?: Range;
    sellRange?: Range;
    onLog?: (msg: string) => void;
    isRunning?: () => boolean;
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
    rounds = 999999,
    buyRange = [2, 20, 2],
    sellRange = [2, 20, 2],
    onLog,
    isRunning
}: MakeMoneyOptions = {}) {

    for (let r = 1; r <= rounds; r++) {
        if (isRunning && !isRunning()) break;

        onLog?.(`=== CYCLE ${r} START ===`);

        await sleep(intervalSec * 1000);
        if (isRunning && !isRunning()) break;

        const buy = randRange(buyRange);
        balance -= buy;
        onLog?.(`[${now()}] BUY  @ ${buy} | Balance: ${balance}`);

        await sleep(intervalSec * 1000);
        if (isRunning && !isRunning()) break;

        const sell = randRange(sellRange);
        balance += sell;
        profit += sell - buy;

        onLog?.(`[${now()}] SELL @ ${sell} | Balance: ${balance}`);
    }

    onLog?.("Bot stopped.");
    return { balance, profit };
}
