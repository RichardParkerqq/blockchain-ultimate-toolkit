import { ethers } from 'ethers';

export class BlockTimeAnalyzer {
  private provider: ethers.JsonRpcProvider;

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  async getAverageBlockTime(sampleSize: number = 100): Promise<number> {
    const latest = await this.provider.getBlockNumber();
    let totalTime = 0;
    let count = 0;

    for (let i = latest - sampleSize; i < latest; i++) {
      const current = await this.provider.getBlock(i);
      const next = await this.provider.getBlock(i + 1);
      if (current && next) {
        totalTime += next.timestamp - current.timestamp;
        count++;
      }
    }

    return count > 0 ? totalTime / count : 0;
  }

  async getBlockTimesRange(startBlock: number, endBlock: number): Promise<number[]> {
    const times: number[] = [];
    for (let i = startBlock; i < endBlock; i++) {
      const current = await this.provider.getBlock(i);
      const next = await this.provider.getBlock(i + 1);
      if (current && next) times.push(next.timestamp - current.timestamp);
    }
    return times;
  }
}
