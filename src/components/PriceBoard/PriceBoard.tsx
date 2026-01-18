
import PriceTile from "./PriceTile";
import "./PricesBoard.scss";

export default function PricesBoard() {
    return (
        <section className="prices-board">
            <PriceTile
                label="BMB"
                initial={345}
                minChange={12}
                maxChange={18}
                decimals={2}
            />

            <PriceTile
                label="Wiru"
                initial={187}
                minChange={5}
                maxChange={9}
                decimals={2}
            />

            <PriceTile
                label="DOD"
                initial={0.087}
                minChange={0.02}
                maxChange={0.025}
                decimals={3}
            />

            <PriceTile
                label="ZVH"
                initial={0.63}
                minChange={0.01}
                maxChange={0.03}
                decimals={2}
            />

            <PriceTile
                label="TOR"
                initial={0.63}
                minChange={0.01}
                maxChange={0.03}
                decimals={2}
            />

        </section>
    );
}
