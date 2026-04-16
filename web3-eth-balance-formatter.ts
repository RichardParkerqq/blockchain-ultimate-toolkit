import { ethers } from 'ethers';

export class EthBalanceFormatter {
  static formatEther(wei: bigint | string): string {
    const value = typeof wei === 'string' ? BigInt(wei) : wei;
    return ethers.formatEther(value);
  }

  static formatToFixed(wei: bigint | string, decimals: number = 4): string {
    const ether = this.formatEther(wei);
    return parseFloat(ether).toFixed(decimals);
  }

  static formatUSD(etherValue: string, price: number): string {
    const usd = parseFloat(etherValue) * price;
    return `$${usd.toFixed(2)}`;
  }

  static parseToWei(ether: string): bigint {
    return ethers.parseEther(ether);
  }

  static abbreviateBalance(wei: bigint): string {
    const ether = parseFloat(this.formatEther(wei));
    if (ether >= 1000) return (ether / 1000).toFixed(2) + 'k';
    if (ether >= 1_000_000) return (ether / 1_000_000).toFixed(2) + 'M';
    return ether.toFixed(2);
  }
}
