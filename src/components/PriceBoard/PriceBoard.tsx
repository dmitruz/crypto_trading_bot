import { useEffect } from "react";
import PriceTile from "./PriceTile";
import { AssetPrice } from "./types";
import "./PriceBoard.scss";


interface PricesBoardProps {
    prices: AssetPrice[];
    setPrices: React.Dispatch<React.SetStateAction<AssetPrice[]>>;
}

export default function PricesBoard({ prices, setPrices }: PricesBoardProps) {

    useEffect(() => {

        const fetchPrices = async () => {

            try {

                const res = await fetch(
                    "http://localhost:4000/prices"
                );

                const data = await res.json();

                const mapped: AssetPrice[] = Object.entries(data).map(
                    ([symbol, price]) => ({

                        id: symbol.toLowerCase(),

                        label: symbol,

                        price: Number(price),

                        minChange: Number(price) * 0.002,

                        maxChange: Number(price) * 0.01,

                        decimals: Number(price) < 1 ? 3 : 2
                    })
                );

                setPrices(mapped);

            } catch (err) {
                console.error(err);
            }
        };

        fetchPrices();

        const interval = setInterval(fetchPrices, 2000);

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
