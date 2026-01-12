import { useState, useEffect } from "react";
import useWallet from "../../hooks/useWallet";
import "../../styles/navbar.css";

import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { account, balance, connectWallet } = useWallet();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <a href="#">Create</a>
          <a href="#">Stats</a>
        </nav>

        {/* Right */}
        <div className="navbar-right">
          <button className="wallet-btn" onClick={connectWallet}>
            <>
                { account ? `${account.slice(0, 6)}...${account.slice(-4) }` + "->" + `${Number(balance).toFixed(3)}` + "ETH"
                : "Connect Wallet"}
            </>
            </button>
        </div>

      </div>
    </header>
  );
}