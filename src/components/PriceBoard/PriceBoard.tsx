<<<<<<< HEAD

=======
import { socket } from "../../services/socket";
>>>>>>> 2dd4ce805b7aad3bc55bbf21d9d39ac546ff058b
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
<<<<<<< HEAD

        socket.on("prices", (incomingPrices) => {

            setPrices(prev => {

                const updated = [...prev];

                incomingPrices.forEach((p: any) => {

                    const asset = {
                        id: p.symbol.toLowerCase(),
                        label: p.symbol,
                        price: p.price,
                        minChange: p.price * 0.01,
                        maxChange: p.price * 0.03,
                        decimals: p.price < 1 ? 3 : 2
                    };

                    const existingIndex = updated.findIndex(
                        item => item.label === p.symbol
                    );

                    if (existingIndex >= 0) {
                        updated[existingIndex] = asset;
                    } else {
                        updated.push(asset);
                    }
                });

                return [...updated];
            });
=======
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
>>>>>>> 2dd4ce805b7aad3bc55bbf21d9d39ac546ff058b
        });

        return () => {
            socket.off("prices");
        };
<<<<<<< HEAD

=======
>>>>>>> 2dd4ce805b7aad3bc55bbf21d9d39ac546ff058b
    }, [setPrices]);
    return (
        <section className="prices-board">
            {prices.map(asset => (
                <PriceTile key={asset.id} asset={asset} />
            ))}
        </section>
    );
}
