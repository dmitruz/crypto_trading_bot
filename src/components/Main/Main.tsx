import { useState, useEffect } from "react";
import BalanceView from "../Balance";
import PriceBoard from "../PriceBoard/PriceBoard";
import { AssetPrice } from "../PriceBoard/types";

import { GoogleUser } from "../../App";
import TradeHistory from "../TradeHistory";
import { socket } from "../../services/socket";

import "./Main.scss";

interface Props {
    user: GoogleUser | null;

    setUser: React.Dispatch<
        React.SetStateAction<GoogleUser | null>
    >;
}


export default function Main({
    user,
    setUser
}: Props) {

    const [balance, setBalance] =
        useState(1000);

    const [profit, setProfit] =
        useState(0);

    const [prices, setPrices] =
        useState<AssetPrice[]>([]);

    const [isTrading, setIsTrading] = useState(false);

    const startTrading = async () => {
        await fetch("http://localhost:4000/start-trading", {
            method: "POST"
        });

        setIsTrading(true);
    };

    const stopTrading = async () => {
        await fetch("http://localhost:4000/stop-trading", {
            method: "POST"
        });

        setIsTrading(false);
    };

    useEffect(() => {

        socket.on("portfolio", (data) => {

            setBalance(data.balance);

            setProfit(data.profit);
        });

        return () => {
            socket.off("portfolio");
        };

    }, []);

    return (

        <main className="main">

            <PriceBoard
                prices={prices}
                setPrices={setPrices}
            />

            {!prices.length && (
                <div>Loading prices...</div>
            )}

            <BalanceView
                balance={balance}
                profit={profit}
            />

            <h1>
                Trading Bot FINA
            </h1>

            <div className="controls">

                <button
                    className="start-button"
                    onClick={startTrading}
                    disabled={isTrading}
                >
                    Start Trading
                </button>

                <button
                    className="stop-button"
                    onClick={stopTrading}
                    disabled={!isTrading}
                >
                    Stop Trading
                </button>

            </div>

            <TradeHistory />

        </main>
    );
}