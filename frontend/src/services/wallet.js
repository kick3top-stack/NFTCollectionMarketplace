import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function WalletConnect({ onWalletConnected }) {
  const [walletAddress, setWalletAddress] = useState("");

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0];
      setWalletAddress(account);
      if (onWalletConnected) onWalletConnected(account);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle account or network change
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0] || "");
        if (onWalletConnected) onWalletConnected(accounts[0] || "");
      });
      window.ethereum.on("chainChanged", () => {
        window.location.reload(); // reload page on network change
      });
    }
    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  return (
    <div>
      {walletAddress ? (
        <button className="wallet-btn">
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </button>
      ) : (
        <button className="wallet-btn" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}
