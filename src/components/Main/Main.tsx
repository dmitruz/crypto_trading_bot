import { useState, useEffect } from "react";
import BalanceView from "../Balance";
import PriceBoard from "../PriceBoard/PriceBoard";
import { AssetPrice } from "../PriceBoard/types";
import { googleLogout } from "@react-oauth/google";
import GoogleAuthButton from "../Auth/GoogleAuthButton";
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

const startTrading = async () => {

    await fetch(
        "http://localhost:4000/start-trading",
        {
            method: "POST"
        }
    );
};

const stopTrading = async () => {

    await fetch(
        "http://localhost:4000/stop-trading",
        {
            method: "POST"
        }
    );
};

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

            {!user ? (

                <GoogleAuthButton
                    onLogin={setUser}
                />

            ) : (

                <div className="user-container">

                    <div className="user-bar">

                        <img
                            src={user.picture}
                            width={32}
                        />

                        <span>
                            {user.name}
                        </span>

                        <button
                            onClick={() => {

                                googleLogout();

                                setUser(null);
                            }}
                        >
                            Logout
                        </button>

                    </div>

                </div>
            )}

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
                    onClick={startTrading}
                >
                    Start Trading
                </button>

                <button
                    onClick={stopTrading}
                >
                    Stop Trading
                </button>

            </div>

            <TradeHistory />

        </main>
    );
}