import { useState } from "react";
import { AssetPrice } from "./PriceBoard";
import { usePriceTicker } from "./usePriceTicker";
import { Link } from "react-router-dom";
import "./PricesBoard.scss";

interface Props {
    asset: AssetPrice;
}

export default function PriceTile({ asset }: Props) {
    const { label, price, minChange, maxChange, decimals } = asset;
    const [hover, setHover] = useState(false);


    return (
        // <div className={`price-tile ${direction}`}>
        <div className={`price-tile`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <span className="label">{asset.label}</span>
            <span className="price">${asset.price.toFixed(asset.decimals)}</span>
            {hover && (
                <Link
                    to={`/chart/${asset.label}`}
                    state={{ price: asset.price }}
                    target="_blank"
                >
                    View Chart
                </Link>
            )}
        </div>
    );
}
