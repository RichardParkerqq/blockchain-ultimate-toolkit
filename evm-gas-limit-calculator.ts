import { ethers } from 'ethers';

export class GasLimitCalculator {
  private provider: ethers.JsonRpcProvider;

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  async estimateTransferGasLimit(): Promise<bigint> {
    return 21000n;
  }

  async estimateContractCallGasLimit(
    to: string,
    data: string,
    from: string
  ): Promise<bigint> {
    try {
      return await this.provider.estimateGas({
        from,
        to,
        data
      });
    } catch (e) {
      return 500000n;
    }
  }

  addBuffer(gasLimit: bigint, bufferPercent: number = 20): bigint {
    return gasLimit + (gasLimit * BigInt(bufferPercent) / 100n);
  }
}
