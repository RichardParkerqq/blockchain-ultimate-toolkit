import { ethers } from 'ethers';

export class WalletBatchChecker {
  private provider: ethers.JsonRpcProvider;

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  async batchCheckNativeBalance(wallets: string[]): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    for (const wallet of wallets) {
      try {
        const balance = await this.provider.getBalance(wallet);
        result[wallet] = ethers.formatEther(balance);
      } catch (e) {
        result[wallet] = "0";
      }
    }
    return result;
  }

  async batchCheckTokenBalance(wallets: string[], tokenAddress: string, abi: any): Promise<Record<string, string>> {
    const contract = new ethers.Contract(tokenAddress, abi, this.provider);
    const decimals = await contract.decimals();
    const result: Record<string, string> = {};

    for (const wallet of wallets) {
      try {
        const balance = await contract.balanceOf(wallet);
        result[wallet] = ethers.formatUnits(balance, decimals);
      } catch (e) {
        result[wallet] = "0";
      }
    }
    return result;
  }
}
