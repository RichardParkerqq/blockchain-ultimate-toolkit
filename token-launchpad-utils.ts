import { ethers } from 'ethers';

export class TokenLaunchpadUtils {
  static calculateLiquidityRate(raisedAmount: bigint, tokenSupply: bigint, liquidityPercent: number): bigint {
    return tokenSupply * BigInt(liquidityPercent) / 100n;
  }

  static calculateTokenPrice(raiseTarget: string, totalTokensForSale: string, decimals: number): string {
    const raise = ethers.parseEther(raiseTarget);
    const tokens = ethers.parseUnits(totalTokensForSale, decimals);
    const price = raise / tokens;
    return ethers.formatEther(price);
  }

  static getVestingSchedule(totalAmount: string, cliffDays: number, durationDays: number): Array<{ unlock: string; time: number }> {
    const amount = parseFloat(totalAmount);
    const cliffSeconds = cliffDays * 86400;
    const durationSeconds = durationDays * 86400;
    
    return [
      { unlock: (amount * 0.2).toFixed(2), time: cliffSeconds },
      { unlock: (amount * 0.3).toFixed(2), time: cliffSeconds + durationSeconds / 2 },
      { unlock: (amount * 0.5).toFixed(2), time: cliffSeconds + durationSeconds }
    ];
  }
}
