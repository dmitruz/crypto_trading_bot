import { useState, useEffect } from "react";
import PriceTile from "./PriceTile";
import "./PricesBoard.scss";

export interface AssetPrice {
    id: string;
    label: string;
    price: number;
    minChange: number;
    maxChange: number;
    decimals: number;
}

export const INITIAL_PRICES: AssetPrice[] = [

    { id: "wir", label: "WIR", price: 187, minChange: 5, maxChange: 9, decimals: 2 },
    { id: "dod", label: "DOD", price: 0.087, minChange: 0.02, maxChange: 0.025, decimals: 3 },
    { id: "zvh", label: "ZVH", price: 0.087, minChange: 0.02, maxChange: 0.025, decimals: 3 },
    { id: "tor", label: "TOR", price: 0.087, minChange: 0.02, maxChange: 0.025, decimals: 3 }
];

interface PricesBoardProps {
    prices: AssetPrice[];
    setPrices: React.Dispatch<React.SetStateAction<AssetPrice[]>>;
}

export default function PricesBoard({ prices, setPrices }: PricesBoardProps) {
    useEffect(() => {
        const interval = setInterval(() => {
            setPrices(prev =>
                prev.map(asset => {
                    const delta =
                        (Math.random() * (asset.maxChange - asset.minChange) +
                            asset.minChange) *
                        (Math.random() > 0.5 ? 1 : -1);

                    const newPrice = Number((asset.price + delta).toFixed(asset.decimals));

                    return { ...asset, price: newPrice };
                })
            );
        }, 10_000);

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
