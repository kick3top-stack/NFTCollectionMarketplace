import { useState } from "react";
import Navbar from "./components/Navbar";
import Marketplace from "./pages/Marketplace";
import { connectWallet } from "./utils/web3";

function App() {
  const [account, setAccount] = useState(null);

  async function handleConnect() {
    const address = await connectWallet();
    setAccount(address);
  }

  return (
    <>
      <Navbar account={account} onConnect={handleConnect} />
      <Marketplace />
    </>
  );
}

export default App;