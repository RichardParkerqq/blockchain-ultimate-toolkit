import { ethers } from 'ethers';

export class BlockValidatorUtils {
  static validateBlockHash(blockHash: string): boolean {
    return /^0x[0-9a-fA-F]{64}$/.test(blockHash);
  }

  static validateTransactionHash(txHash: string): boolean {
    return /^0x[0-9a-fA-F]{64}$/.test(txHash);
  }

  static validateAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  static async verifyBlockIntegrity(provider: ethers.JsonRpcProvider, blockNumber: number): Promise<boolean> {
    const block = await provider.getBlock(blockNumber);
    const previousBlock = await provider.getBlock(blockNumber - 1);
    
    if (!block || !previousBlock) return false;
    return block.parentHash === previousBlock.hash;
  }

  static calculateBlockTime(currentBlockTime: number, previousBlockTime: number): number {
    return currentBlockTime - previousBlockTime;
  }
}
