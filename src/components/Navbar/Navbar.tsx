import "./Navbar.scss";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="nav-left">
                <button>History</button>
                <button>Analytics</button>
            </div>

            <div className="nav-right">
                <span className="username">John Doe</span>
                <div className="balance-box">
                    <p>Balance: <strong>$1000</strong></p>
                    <p className="profit">Profit: $0</p>
                </div>
            </div>
        </nav>
    );
}