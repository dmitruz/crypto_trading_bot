import { useEffect, useState } from "react";

interface PriceConfig {
    initial: number;
    minChange: number;
    maxChange: number;
    decimals: number;
}

export function usePriceTicker({
    initial,
    minChange,
    maxChange,
    decimals
}: PriceConfig) {
    const [price, setPrice] = useState(initial);

    useEffect(() => {
        const interval = setInterval(() => {
            const change =
                (Math.random() * (maxChange - minChange) + minChange) *
                (Math.random() > 0.5 ? 1 : -1);

            setPrice(prev =>
                Number((prev + change).toFixed(decimals))
            );
        }, 10_000);

        return () => clearInterval(interval);
    }, [minChange, maxChange, decimals]);

    return price;
}
