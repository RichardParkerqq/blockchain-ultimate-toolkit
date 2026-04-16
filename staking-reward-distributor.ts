import { ethers } from 'ethers';

export class RewardDistributor {
  private totalStaked: bigint = 0n;
  private rewardPerToken: bigint = 0n;
  private userRewards: Map<string, bigint> = new Map();

  depositStake(user: string, amount: bigint) {
    this.totalStaked += amount;
    this.userRewards.set(user, (this.userRewards.get(user) || 0n) + amount);
  }

  withdrawStake(user: string, amount: bigint) {
    const current = this.userRewards.get(user) || 0n;
    if (current < amount) throw new Error("Insufficient stake");
    
    this.userRewards.set(user, current - amount);
    this.totalStaked -= amount;
  }

  distributeRewards(rewardAmount: bigint) {
    if (this.totalStaked === 0n) return;
    this.rewardPerToken += (rewardAmount * BigInt(1e18)) / this.totalStaked;
  }

  calculateUserReward(user: string): bigint {
    const stake = this.userRewards.get(user) || 0n;
    return (stake * this.rewardPerToken) / BigInt(1e18);
  }
}
