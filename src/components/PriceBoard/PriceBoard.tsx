import { useEffect } from "react";
import PriceTile from "./PriceTile";
import "./PriceBoard.scss";

export interface AssetPrice {
    id: string;
    label: string;
    price: number;
    minChange: number;
    maxChange: number;
    decimals: number;
}


interface PricesBoardProps {
    prices: AssetPrice[];
    setPrices: React.Dispatch<React.SetStateAction<AssetPrice[]>>;
}

export default function PricesBoard({ prices, setPrices }: PricesBoardProps) {
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await fetch("http://localhost:4000/prices");
                const data = await res.json();

                const mapped = Object.keys(data)
                    .filter(symbol => data[symbol]?.length > 0)
                    .map(symbol => {
                        const history = data[symbol];
                        const last = history[history.length - 1];

                        return {
                            id: symbol.toLowerCase(),
                            label: symbol,
                            price: last.price,
                            minChange: last.price * 0.01,
                            maxChange: last.price * 0.03,
                            decimals: last.price < 1 ? 3 : 2
                        };
                    });

                setPrices(mapped);

            } catch (err) {
                console.error("Failed to fetch prices", err);
            }
        };

        fetchPrices();

        const interval = setInterval(fetchPrices, 60_000);

        return () => clearInterval(interval);
    }, [setPrices]);
    return (
        <section className="prices-board">
            {prices.map(asset => (
                <PriceTile key={asset.id} asset={asset} />
            ))}
        </section>
    );
}
