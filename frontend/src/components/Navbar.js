import "./Navbar.css";

export default function Navbar({ account, onConnect }) {
  return (
    <div className="navbar">
      <div className="logo">NFT Marketplace</div>

      <button onClick={onConnect}>
        {account
          ? account.slice(0, 6) + "..." + account.slice(-4)
          : "Connect Wallet"}
      </button>
    </div>
  );
}