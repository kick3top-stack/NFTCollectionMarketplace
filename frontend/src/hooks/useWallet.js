import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CHAIN_INFO } from "../config/chains";
import { connectWalletAndGetBalance } from "../config/wallet";

export default function useWallet() {
   const [address, setAddress] = useState(null);

  // ETH balance
  const [balance, setBalance] = useState(null);

  // Network name
  const [network, setNetwork] = useState(null);

  const connectWallet = async () => {
    try {
      const data = await connectWalletAndGetBalance();

      if (!data) return;

      setAddress(data.address);
      setBalance(data.balance);
      setNetwork(data.networkName);

    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  return ( {
    address, 
    balance, 
    network}
);
}
