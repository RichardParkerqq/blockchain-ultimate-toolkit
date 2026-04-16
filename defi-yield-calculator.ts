export class DeFiYieldCalculator {
  static calculateAPY(apr: number, compoundTimes: number): number {
    return (Math.pow(1 + apr / compoundTimes, compoundTimes) - 1) * 100;
  }

  static calculateDailyInterest(principal: number, apy: number): number {
    return principal * (apy / 100) / 365;
  }

  static calculateImpermanentLoss(ratioA: number, ratioB: number): number {
    const priceRatio = ratioA / ratioB;
    const sqrt = Math.sqrt(priceRatio);
    const il = 2 * (sqrt / (1 + sqrt)) - 1;
    return Math.abs(il * 100);
  }

  static calculateStakingRewards(
    stake: number,
    rewardRate: number,
    days: number
  ): number {
    return stake * rewardRate * days / 365;
  }
}
