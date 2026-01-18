import { usePriceTicker } from "./usePriceTicker";

interface Props {
    label: string;
    initial: number;
    minChange: number;
    maxChange: number;
    decimals: number;
}

export default function PriceTile({
    label,
    initial,
    minChange,
    maxChange,
    decimals
}: Props) {
    const price = usePriceTicker({
        initial,
        minChange,
        maxChange,
        decimals
    });

    return (
        <div className="price-tile">
            <span className="label">{label}</span>
            <span className="price">${price}</span>
        </div>
    );
}
