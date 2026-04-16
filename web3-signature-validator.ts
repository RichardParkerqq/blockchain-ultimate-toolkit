import { ethers } from 'ethers';

export class Web3SignatureValidator {
  static createSignMessage(nonce: string, timestamp: number): string {
    return `Sign to authenticate: ${nonce}\nTimestamp: ${timestamp}`;
  }

  static async verifySignature(
    address: string,
    message: string,
    signature: string
  ): Promise<boolean> {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (e) {
      return false;
    }
  }

  static generateNonce(): string {
    return ethers.randomBytes(16).toString('hex');
  }

  static isSignatureExpired(timestamp: number, expireMinutes: number = 5): boolean {
    const now = Math.floor(Date.now() / 1000);
    return now - timestamp > expireMinutes * 60;
  }
}
