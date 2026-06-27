
import "./TradeHistory.scss";


export default function TradeHistory() {
    return (
        <button
            onClick={() =>
                window.open(
                    "/trades",
                    "_blank",
                    "width=900,height=700"
                )
            }
        >
            Open Trade History
        </button>
    );
};