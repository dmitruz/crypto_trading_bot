import { AssetPrice } from "./PriceBoard";
import { usePriceTicker } from "./usePriceTicker";
import "./PricesBoard.scss";

interface Props {
    asset: AssetPrice;
}

export default function PriceTile({ asset }: Props) {
    const { label, price, minChange, maxChange, decimals } = asset;


    return (
        // <div className={`price-tile ${direction}`}>
        <div className={`price-tile`}>
            <span className="label">{asset.label}</span>
            <span className="price">${asset.price}</span>
        </div>
    );
}
