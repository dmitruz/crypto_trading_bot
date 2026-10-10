
import "./TradeHistory.scss";

export default function TradeHistory() {
    return (
        <button
            className="history-button"
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