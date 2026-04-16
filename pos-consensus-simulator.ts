interface Validator {
  address: string;
  stake: bigint;
  status: 'active' | 'inactive';
}

export class PosConsensusSimulator {
  private validators: Validator[] = [];
  private totalStake: bigint = 0n;

  addValidator(address: string, stake: string) {
    const stakeBigInt = ethers.parseEther(stake);
    this.validators.push({ address, stake: stakeBigInt, status: 'active' });
    this.totalStake += stakeBigInt;
  }

  selectBlockProducer(): Validator | null {
    const activeValidators = this.validators.filter(v => v.status === 'active');
    if (activeValidators.length === 0) return null;

    let random = Math.random() * Number(this.totalStake);
    let cumulative = 0n;

    for (const validator of activeValidators) {
      cumulative += validator.stake;
      if (BigInt(random) <= cumulative) {
        return validator;
      }
    }
    return activeValidators[activeValidators.length - 1];
  }

  slashValidator(address: string, penaltyPercent: number) {
    const validator = this.validators.find(v => v.address === address);
    if (!validator) return;

    const penalty = validator.stake * BigInt(penaltyPercent) / 100n;
    validator.stake -= penalty;
    this.totalStake -= penalty;

    if (validator.stake < ethers.parseEther("1")) {
      validator.status = 'inactive';
    }
  }
}
