import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChartPage from "./components/Chart/ChartPage";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import { GoogleOAuthProvider } from "@react-oauth/google";

export interface GoogleUser {
  name: string;
  email: string;
  picture: string;
  sub: string;
}

export default function App() {

  const [user, setUser] = useState<GoogleUser | null>(null);
  return (
    <GoogleOAuthProvider clientId="253041364233-g31ke35orda60ojt333fr9no2e7feuh6.apps.googleusercontent.com">
      <BrowserRouter>

        <Navbar user={user} setUser={setUser} />

        <Routes>

          <Route
            path="/"
            element={<Main user={user} setUser={setUser} />}
          />

          <Route
            path="/chart/:symbol"
            element={<ChartPage />}
          />

        </Routes>

      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

