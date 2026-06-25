import { useEffect } from "react";
import PriceTile from "./PriceTile";
import { AssetPrice } from "./types";
import { socket } from "../../services/socket";
import "./PriceBoard.scss";


interface PricesBoardProps {
    prices: AssetPrice[];
    setPrices: React.Dispatch<React.SetStateAction<AssetPrice[]>>;
}

interface SocketPrice {
    symbol: string;
    price: number;
}

export default function PricesBoard({ prices, setPrices }: PricesBoardProps) {

    useEffect(() => {
        socket.on("prices", (prices: SocketPrice[]) => {

            const mapped: AssetPrice[] = prices.map((p) => ({
                id: p.symbol.toLowerCase(),
                label: p.symbol,
                price: p.price,
                minChange: p.price * 0.01,
                maxChange: p.price * 0.03,
                decimals: p.price < 1 ? 3 : 2
            }));

            setPrices(mapped);
        });

        return () => {
            socket.off("prices");
        };
    }, [setPrices]);
    return (
        <section className="prices-board">
            {prices.map(asset => (
                <PriceTile key={asset.id} asset={asset} />
            ))}
        </section>
    );
}
