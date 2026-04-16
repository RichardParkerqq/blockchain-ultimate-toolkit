import { CryptoHashUtils } from './crypto-hash-utils';

export class ZkProofUtils {
  static generateSecretCommitment(secret: string): string {
    const randomness = Math.random().toString(36);
    return CryptoHashUtils.keccak256(secret + randomness);
  }

  static verifyProof(
    commitment: string,
    secret: string,
    randomness: string
  ): boolean {
    const computed = CryptoHashUtils.keccak256(secret + randomness);
    return computed === commitment;
  }

  static generateZkChallenge(): string {
    return CryptoHashUtils.sha256(Math.random().toString() + Date.now().toString());
  }
}
