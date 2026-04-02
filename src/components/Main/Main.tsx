import { useState } from "react";
import { useTradingBot } from "../../tradingEngine/TradingBot";
import BalanceView from "../Balance";
import PricesBoard, {
    AssetPrice,
} from "../PriceBoard/PriceBoard";
import { Asset } from "../../tradingEngine/TradingEngine";
import { googleLogout } from "@react-oauth/google";
import GoogleAuthButton from "../Auth/GoogleAuthButton";
import { GoogleUser } from "../../App";

import "./Main.scss";

interface Props {
    user: GoogleUser | null;
    setUser: React.Dispatch<React.SetStateAction<GoogleUser | null>>;
}

export default function Main({ user, setUser }: Props) {
    const [balance, setBalance] = useState(1000);
    const [profit, setProfit] = useState(0);
    const [prices, setPrices] = useState<AssetPrice[]>([]);
    const [currentAsset, setCurrentAsset] = useState<string | null>(null);

    const assets: Asset[] = prices.map(p => ({
        symbol: p.label,

        min: p.price - p.maxChange * 5,
        max: p.price + p.maxChange * 5,

        step: Number((p.maxChange - p.minChange).toFixed(p.decimals))
    }));
    const bot = useTradingBot(
        balance,
        profit,
        assets,
        (b, p) => {
            setBalance(b);
            setProfit(p);
        },
        (asset) => setCurrentAsset(asset),
        () => setCurrentAsset(null)
    );

    return (
        <main className="main">
            {!user ? (
                <GoogleAuthButton onLogin={setUser} />
            ) : (
                <div className="user-container">
                    <div className="user-bar">
                        <img src={user.picture} width={32} />
                        <span>{user.name}</span>

                        <button onClick={() => {
                            googleLogout();
                            setUser(null)
                        }}>Logout
                        </button>
                    </div>
                </div>
            )
            }
            <PricesBoard prices={prices} setPrices={setPrices} />

            {
                currentAsset && (
                    <div className="current-asset">
                        You’ve purchased: <strong>{currentAsset}</strong>
                    </div>
                )
            }

            <BalanceView balance={balance} profit={profit} />
            <h1>Trading Bot FINA</h1>

            <div className="controls">
                <button
                    onClick={bot.start}
                    disabled={bot.running}
                    className="start"
                >
                    Start Trading
                </button>

                <button
                    onClick={bot.stop}
                    disabled={!bot.running}
                    className="stop"
                >
                    Stop Trading
                </button>
            </div>
        </main >
    );
}
