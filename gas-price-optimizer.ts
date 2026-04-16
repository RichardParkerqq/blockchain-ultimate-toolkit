import { ethers } from 'ethers';

export class GasPriceOptimizer {
  private provider: ethers.JsonRpcProvider;

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  async getOptimalGasSettings() {
    const feeData = await this.provider.getFeeData();
    const block = await this.provider.getBlock("latest");
    const baseFee = block?.baseFeePerGas || ethers.parseUnits("0", "gwei");

    const priorityFee = feeData.maxPriorityFeePerGas || ethers.parseUnits("1", "gwei");
    const maxFee = baseFee * 2n + priorityFee;

    return {
      gasPrice: feeData.gasPrice,
      maxFeePerGas: maxFee,
      maxPriorityFeePerGas: priorityFee,
      baseFee: baseFee
    };
  }

  calculateTransactionCost(gasLimit: bigint, gasPrice: bigint): string {
    const cost = gasLimit * gasPrice;
    return ethers.formatEther(cost);
  }
}
