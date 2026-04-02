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


interface PricesBoardProps {
    prices: AssetPrice[];
    setPrices: React.Dispatch<React.SetStateAction<AssetPrice[]>>;
}

export default function PricesBoard({ prices, setPrices }: PricesBoardProps) {
    useEffect(() => {
        fetch("http://localhost:4000/prices")
            .then(res => res.json())
            .then(data => {
                const mapped = Object.keys(data).map((symbol, index) => {
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
            });
    }, [setPrices]);

    useEffect(() => {
        const interval = setInterval(() => {
            setPrices(prev =>
                prev.map(asset => {

                    const delta =
                        (Math.random() * (asset.maxChange - asset.minChange) +
                            asset.minChange) *
                        (Math.random() > 0.5 ? 1 : -1);

                    const newPrice = Math.max(
                        0.0001,
                        Number((asset.price + delta).toFixed(asset.decimals))
                    );

                    return { ...asset, price: newPrice };
                })
            );
        }, 10_000);

        useEffect(() => {
            const interval = setInterval(() => {
                setPrices(prev =>
                    prev.map(asset => {

                        const delta =
                            (Math.random() * (asset.maxChange - asset.minChange) +
                                asset.minChange) *
                            (Math.random() > 0.5 ? 1 : -1);

                        const newPrice = Math.max(
                            0.0001,
                            Number((asset.price + delta).toFixed(asset.decimals))
                        );

                        return { ...asset, price: newPrice };
                    })
                );
            }, 10_000);

            return (
                <section className="prices-board">
                    {prices.map(asset => (
                        <PriceTile key={asset.id} asset={asset} />
                    ))}
                </section>
            );
        }
