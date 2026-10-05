
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { GoogleUser } from "../../App";
import GoogleImg from "../../images/google-icon.png";
import "./Navbar.scss";

interface Props {
    user: GoogleUser | null;
    setUser: React.Dispatch<React.SetStateAction<GoogleUser | null>>;
}

export default function Navbar({ user, setUser }: Props) {
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await fetch(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${tokenResponse.access_token}`,
                        },
                    }
                );

                const userInfo = await response.json();

                setUser(userInfo);
            } catch (error) {
                console.error("Google login failed:", error);
            }
        },

        onError: () => {
            console.log("Login Failed");
        },
    });

    return (
        <nav className="navbar">

            <h2>Trading Bot</h2>

            <div className="nav-right">

                {!user ? (

                    <button
                        className="google-icon-button"
                        onClick={() => login()}
                        aria-label="Login with Google"
                    >
                        <img
                            src={GoogleImg}
                            alt="Google"
                            className="google-icon"
                        />
                    </button>

                ) : (

                    <div className="user">

                        <span>{user.name}</span>

                        <button
                            onClick={() => {
                                googleLogout();
                                setUser(null);
                            }}
                        >
                            Logout
                        </button>

                    </div>

                )}

            </div>

        </nav>
    );
}

