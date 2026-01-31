export interface Asset {
    symbol: string;
    min: number;
    max: number;
    step: number;
}

export interface MakeMoneyOptions {
    balance?: number;
    profit?: number;
    intervalSec?: number;
    rounds?: number;

    assets: Asset[]; // REQUIRED

    onUpdate: (balance: number, profit: number) => void;
    onBuyAsset?: (symbol: string) => void;
    onSellAsset?: () => void;

    onLog?: (msg: string) => void;
    isRunning?: () => boolean;
}

const sleep = (ms: number) =>
    new Promise(res => setTimeout(res, ms));

const now = () =>
    new Date().toLocaleTimeString("en-GB", { hour12: false });

const randAsset = (assets: Asset[]): Asset =>
    assets[Math.floor(Math.random() * assets.length)];

const randPrice = (asset: Asset): number => {
    const count = Math.floor((asset.max - asset.min) / asset.step);
    return asset.min + asset.step * Math.floor(Math.random() * count);
};

export async function makeMoney({
    balance = 1000,
    profit = 0,
    intervalSec = 2,
    rounds = 999999,
    assets,
    onUpdate,
    onBuyAsset,
    onSellAsset,
    onLog,
    isRunning
}: MakeMoneyOptions) {

    for (let r = 1; r <= rounds; r++) {
        if (isRunning && !isRunning()) break;

        onLog?.(`=== CYCLE ${r} START ===`);

        await sleep(intervalSec * 1000);
        if (isRunning && !isRunning()) break;

        const asset = randAsset(assets);
        const buy = randPrice(asset);

        balance -= buy;
        onBuyAsset?.(asset.symbol);
        onUpdate(balance, profit);

        onLog?.(
            `[${now()}] BUY ${asset.symbol} @ ${buy} | Balance: ${balance}`
        );

        await sleep(intervalSec * 1000);
        if (isRunning && !isRunning()) break;

        // 🔴 SELL
        const sell = randPrice(asset);
        balance += sell;
        profit += sell - buy;

        onSellAsset?.();
        onUpdate(balance, profit);

        onLog?.(
            `[${now()}] SELL ${asset.symbol} @ ${sell} | Balance: ${balance}`
        );
    }

    onSellAsset?.();
    onLog?.("Bot stopped.");

    return { balance, profit };
}
