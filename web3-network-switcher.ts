import { ethers } from 'ethers';

interface ChainConfig {
  chainId: number;
  chainName: string;
  rpcUrls: string[];
  nativeCurrency: { name: string; symbol: string; decimals: number };
  blockExplorerUrls: string[];
}

export class Web3NetworkSwitcher {
  static async switchNetwork(chainId: number) {
    if (!window.ethereum) throw new Error("No wallet");
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ethers.toBeHex(chainId) }]
      });
    } catch (e: any) {
      if (e.code === 4902) throw new Error("Network not added");
      throw e;
    }
  }

  static async addNetwork(config: ChainConfig) {
    if (!window.ethereum) throw new Error("No wallet");
    
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [config]
    });
  }

  static getCurrentChainId(): Promise<number> {
    return window.ethereum.request({ method: 'eth_chainId' })
      .then((id: string) => parseInt(id, 16));
  }
}
