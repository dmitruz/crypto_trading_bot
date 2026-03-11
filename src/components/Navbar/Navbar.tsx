import { GoogleUser } from "../../App";
import "./Navbar.scss";

interface Props {
    user: GoogleUser | null;
    setUser: React.Dispatch<React.SetStateAction<GoogleUser | null>>;
}


export default function Navbar({ user, setUser }: Props) {
    return (
        <nav className="navbar">
            <h2>Trading Bot</h2>

            {user && (
                <div className="user">
                    <img src={user.picture} width={32} />
                    <span>{user.name}</span>

                    <button onClick={() => setUser(null)}>
                        Logout
                    </button>
                </div>
            )}
        </nav>

    );
}