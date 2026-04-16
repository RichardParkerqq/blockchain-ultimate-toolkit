import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

interface Web3State {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
}

export function useWeb3Connection() {
  const [state, setState] = useState<Web3State>({
    provider: null,
    signer: null,
    address: null,
    chainId: null,
    isConnected: false
  });

  const connectWallet = async () => {
    if (!window.ethereum) throw new Error("MetaMask not installed");
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();

    setState({
      provider,
      signer,
      address: accounts[0],
      chainId: Number(network.chainId),
      isConnected: true
    });
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) connectWallet();
      }
    };
    checkConnection();
  }, []);

  return { ...state, connectWallet };
}
