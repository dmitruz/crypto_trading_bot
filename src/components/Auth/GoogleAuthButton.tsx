
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { GoogleUser } from '../../App';


interface Props {
    onLogin: (user: GoogleUser) => void;
}

export default function GoogleAuthButton({ onLogin }: Props) {
    return (
        <GoogleLogin
            onSuccess={(credentialResponse) => {
                if (!credentialResponse.credential) return;

                const decoded = jwtDecode<GoogleUser>(
                    credentialResponse.credential
                );

                onLogin(decoded);
            }}
            onError={() => console.log("Login Failed")}
        />
    );
}
