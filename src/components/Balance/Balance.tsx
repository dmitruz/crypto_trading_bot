import "./Balance.scss";

interface Props {
    balance: number;
    profit: number;
}

export default function Balance({ balance, profit }: Props) {
    return (
        <div className="balance-container">
            <div className="balance-box">
                <p>Balance: <strong>${balance.toFixed(2)}</strong></p>
                <p>Profit: <strong>${profit.toFixed(2)}</strong></p>
            </div >
        </div>
    )
}