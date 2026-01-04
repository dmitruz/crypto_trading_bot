import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Balance from "./components/Balance";

export default function App() {
  return (
    <>
      <Navbar />
      <Balance balance={1000} profit={0} />
      <Main />
    </>
  );
}

