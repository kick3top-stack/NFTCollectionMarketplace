import { ethers } from "ethers";

/**
 * Connect wallet and read ETH balance
 */
export async function connectWalletAndGetBalance() {

  // 1. Check MetaMask
  if (!window.ethereum) {
    alert("MetaMask not installed");
    return null;
  }

  // 2. Create provider (read-only access)
  const provider = new ethers.BrowserProvider(window.ethereum);

  // 3. Ask user to connect wallet
  await provider.send("eth_requestAccounts", []);

  // 4. Get signer (wallet)
  const signer = await provider.getSigner();

  // 5. Get wallet address
  const address = await signer.getAddress();

  // 6. Read ETH balance (BIG NUMBER in wei)
  const balanceWei = await provider.getBalance(address);

  // 7. Convert wei → ETH (human readable)
  const balanceEth = ethers.formatEther(balanceWei);

  // 8. Get network info (Mainnet / Sepolia / etc.)
  const network = await provider.getNetwork();

  return {
    address,                  // Wallet address
    balance: balanceEth,      // ETH or Sepolia ETH
    chainId: Number(network.chainId),
    networkName: network.name
  };
}


