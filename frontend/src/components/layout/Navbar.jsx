import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connectWalletAndGetBalance } from "../../services/wallet";
import "../../styles/navbar.css";
import { nftContract, provider } from "../../utils/contractSetup";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [networkName, setNetwork] = useState("");

  const [isOwner, setIsOwner] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [contractBalance, setContractBalance] = useState("0");
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 🔹 Check owner + contract balance
  const checkOwnerAndBalance = async (address) => {
    const owner = await nftContract.owner();
    setIsOwner(owner.toLowerCase() === address.toLowerCase());

    const balance = await provider.getBalance(nftContract.target);
    setContractBalance(ethers.formatEther(balance));
  };

  const connectWallet = async () => {
    try {
      const data = await connectWalletAndGetBalance();
      if (!data) return;

      setAccount(data.address);
      setBalance(data.balance);
      setNetwork(data.networkName);

      await checkOwnerAndBalance(data.address);
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  // 🔹 Withdraw function
  const withdrawETH = async () => {
    try {
      setLoadingWithdraw(true);
      const signer = await provider.getSigner();
      const contract = nftContract.connect(signer);

      const tx = await contract.withdraw(account);
      await tx.wait();

      setShowWithdrawModal(false);
      await checkOwnerAndBalance(account);
      alert("Withdraw successful!");
    } catch (err) {
      console.error(err);
      alert(err.reason || "Withdraw failed");
    } finally {
      setLoadingWithdraw(false);
    }
  };

  return (
    <>
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
              <Link to="/collections">Marketplace</Link>
            </li>
            <li>
              <Link to="/create">Create</Link>
            </li>
            <li>
              <Link to="/mintNFT">Mint NFT</Link>
            </li>
            <li>
              <Link to="/mynfts">MyNFTs</Link>
            </li>
          </nav>

          {/* Right */}
          <div className="navbar-right">
            {isOwner && (
              <button
                className="withdraw-btn"
                onClick={() => setShowWithdrawModal(true)}
              >
                Withdraw
              </button>
            )}

            <button className="wallet-btn" onClick={connectWallet}>
              {account
                ? `${account.slice(0, 6)}...${account.slice(-4)} → ${Number(
                    balance
                  ).toFixed(3)} ETH (${networkName})`
                : "Connect Wallet"}
            </button>
          </div>
        </div>
      </header>

      {/* 🔔 Withdraw Modal */}
      {showWithdrawModal && (
        <div className="withdraw-modal">
          <div className="modal-content">
            <h3>Withdraw ETH</h3>
            <p>
              Available to withdraw:
              <strong> {contractBalance} ETH</strong>
            </p>

            <div className="modal-actions">
              <button
                onClick={withdrawETH}
                disabled={loadingWithdraw || contractBalance === "0.0"}
              >
                {loadingWithdraw ? "Withdrawing..." : "Yes, Withdraw"}
              </button>
              <button onClick={() => setShowWithdrawModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
