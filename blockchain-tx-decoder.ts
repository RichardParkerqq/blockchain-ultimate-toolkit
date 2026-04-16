import { ethers } from 'ethers';

export class TransactionDecoder {
  static decodeInputData(data: string): { methodId: string; params: any[] } {
    if (!data || data === '0x') return { methodId: '', params: [] };
    
    const methodId = data.slice(0, 10);
    const params = [];
    for (let i = 10; i < data.length; i += 64) {
      params.push('0x' + data.slice(i, i + 64));
    }
    return { methodId, params };
  }

  static decodeERC20Transfer(data: string): { to: string; value: bigint } | null {
    const decoded = this.decodeInputData(data);
    if (decoded.methodId !== '0xa9059cbb') return null;
    
    return {
      to: ethers.getAddress(decoded.params[0]),
      value: BigInt(decoded.params[1])
    };
  }

  static getTransactionType(data: string): string {
    const methodId = data.slice(0, 10);
    const types: Record<string, string> = {
      '0xa9059cbb': 'ERC20 Transfer',
      '0x095ea7b3': 'ERC20 Approve',
      '0x23b872dd': 'ERC20 TransferFrom'
    };
    return types[methodId] || 'Unknown';
  }
}
