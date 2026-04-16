import { createHash, createHmac } from 'crypto';
import { ethers } from 'ethers';

export class CryptoHashUtils {
  static sha256(data: string | Buffer): string {
    return createHash('sha256').update(data).digest('hex');
  }

  static keccak256(data: string): string {
    return ethers.keccak256(ethers.toUtf8Bytes(data));
  }

  static hmacSha256(key: string, data: string): string {
    return createHmac('sha256', key).update(data).digest('hex');
  }

  static ripemd160(data: string | Buffer): string {
    return createHash('ripemd160').update(data).digest('hex');
  }

  static doubleSha256(data: string | Buffer): string {
    const firstHash = createHash('sha256').update(data).digest();
    return createHash('sha256').update(firstHash).digest('hex');
  }
}
