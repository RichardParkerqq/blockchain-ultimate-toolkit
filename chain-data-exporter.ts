import { ethers } from 'ethers';
import fs from 'fs/promises';

export class ChainDataExporter {
  private provider: ethers.JsonRpcProvider;

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  async exportBlockRangeToJson(startBlock: number, endBlock: number, outputPath: string) {
    const blocks = [];
    for (let i = startBlock; i <= endBlock; i++) {
      const block = await this.provider.getBlock(i, true);
      if (block) blocks.push(block);
    }
    await fs.writeFile(outputPath, JSON.stringify(blocks, null, 2));
  }

  async exportTransactionsByAddress(address: string, limit: number, outputPath: string) {
    const txs = [];
    let currentBlock = await this.provider.getBlockNumber();

    while (txs.length < limit && currentBlock > 0) {
      const block = await this.provider.getBlock(currentBlock, true);
      if (block?.transactions) {
        for (const tx of block.transactions) {
          if (tx.from?.toLowerCase() === address.toLowerCase() || tx.to?.toLowerCase() === address.toLowerCase()) {
            txs.push(tx);
            if (txs.length >= limit) break;
          }
        }
      }
      currentBlock--;
    }

    await fs.writeFile(outputPath, JSON.stringify(txs, null, 2));
  }
}
