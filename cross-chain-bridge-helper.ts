import { ethers } from 'ethers';

export class CrossChainBridgeHelper {
  private sourceProvider: ethers.JsonRpcProvider;
  private targetProvider: ethers.JsonRpcProvider;

  constructor(sourceRpc: string, targetRpc: string) {
    this.sourceProvider = new ethers.JsonRpcProvider(sourceRpc);
    this.targetProvider = new ethers.JsonRpcProvider(targetRpc);
  }

  async getChainIds(): Promise<{ source: bigint; target: bigint }> {
    const sourceNetwork = await this.sourceProvider.getNetwork();
    const targetNetwork = await this.targetProvider.getNetwork();
    return {
      source: sourceNetwork.chainId,
      target: targetNetwork.chainId
    };
  }

  async checkTokenBalanceOnChain(provider: ethers.JsonRpcProvider, token: string, wallet: string): Promise<string> {
    const abi = ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"];
    const contract = new ethers.Contract(token, abi, provider);
    const [balance, decimals] = await Promise.all([contract.balanceOf(wallet), contract.decimals()]);
    return ethers.formatUnits(balance, decimals);
  }

  estimateBridgeFee(amount: string, chainRatio: number): string {
    const amountNum = parseFloat(amount);
    const fee = amountNum * 0.001 * chainRatio;
    return fee.toFixed(6);
  }
}
