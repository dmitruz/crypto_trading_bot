import "./Balance.scss";

interface Props {
    balance: number;
    profit: number;
}

export default function Balance({ balance, profit }: Props) {
    return (
        <div className="balance-container">
            <div className="balance-box">
                <p>Balance: <strong>{balance}</strong></p>
                <p>Profit: <strong>{profit}</strong></p>
            </div >
        </div>
    )
}