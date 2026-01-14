import { useEffect, useState } from "react";
// import useWallet from "../../hooks/useWallet";
import "../../styles/navbar.css";

import { Link } from "react-router-dom";
import { connectWalletAndGetBalance } from "../../services/wallet";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [networkName, setNetwork] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const connectWallet = async () => {
    try {
      const data = await connectWalletAndGetBalance();

      if (!data) return;

      setAccount(data.address);
      setBalance(data.balance);
      setNetwork(data.networkName);
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner">
        {/* Left */}
        <div className="navbar-left">
          <div className="logo">
            <span className="logo-icon">◆</span>
            <span className="logo-text">MyNFT</span>
          </div>
        </div>

        {/* Center */}
        <nav className="navbar-center">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/collections">Collections</Link>
          </li>
          <li>
            <Link to="/create">Create</Link>
          </li>
          <li>
            <Link to="/mynfts">MyNFTs</Link>
          </li>
        </nav>

        {/* Right */}
        <div className="navbar-right">
          <button className="wallet-btn" onClick={connectWallet}>
            <>
              {account
                ? `${account.slice(0, 6)}...${account.slice(-4)}` +
                  "->" +
                  `${Number(balance).toFixed(3)}` +
                  "ETH in " +
                  `${networkName}`
                : "Connect Wallet"}
            </>
          </button>
        </div>
      </div>
    </header>
  );
}
