import { useState } from "react";
import { useTradingBot } from "../../tradingEngine/TradingBot";
import BalanceView from "../Balance";
import "./Main.scss";


export default function Main() {
    const [balance, setBalance] = useState(1000);
    const [profit, setProfit] = useState(0);

    const bot = useTradingBot(balance, profit, (b, p) => {
        setBalance(b);
        setProfit(p);
    });

    return (
        <main className="main">
            <BalanceView balance={balance} profit={profit} />
            <h1>Trading Bot FINA</h1>

            <div className="controls">
                <button onClick={bot.start} disabled={bot.running} className="start">Start Trading</button>
                <button onClick={bot.stop} disabled={!bot.running} className="stop">Stop Trading</button>
            </div>
        </main >
    );
}
