import { ethers } from 'ethers';

export class BlockListenerService {
  private provider: ethers.WebSocketProvider;
  private currentBlock: number = 0;

  constructor(wsRpcUrl: string) {
    this.provider = new ethers.WebSocketProvider(wsRpcUrl);
  }

  startBlockListener(onNewBlock: (blockNumber: number, blockData: any) => void) {
    this.provider.on('block', async (blockNumber) => {
      if (blockNumber === this.currentBlock) return;
      this.currentBlock = blockNumber;
      const block = await this.provider.getBlock(blockNumber);
      onNewBlock(blockNumber, block);
    });
  }

  stopListener() {
    this.provider.removeAllListeners('block');
    this.provider.destroy();
  }

  async getBlockByNumber(blockNumber: number) {
    return this.provider.getBlock(blockNumber);
  }
}
