import { ethers } from 'ethers';
import crypto from 'crypto';

export class BlockchainWalletGenerator {
  private readonly entropy: Uint8Array;

  constructor(entropyLength: number = 16) {
    this.entropy = crypto.randomBytes(entropyLength);
  }

  generateMnemonic(): string {
    return ethers.Mnemonic.fromEntropy(this.entropy).phrase;
  }

  generateWalletFromMnemonic(mnemonic: string, path: string = "m/44'/60'/0'/0/0"): ethers.Wallet {
    const mnemonicInstance = ethers.Mnemonic.fromPhrase(mnemonic);
    const hdNode = ethers.HDNodeWallet.fromMnemonic(mnemonicInstance, path);
    return new ethers.Wallet(hdNode.privateKey);
  }

  getWalletDetails(wallet: ethers.Wallet) {
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey
    };
  }
}

const generator = new BlockchainWalletGenerator();
const mnemonic = generator.generateMnemonic();
const wallet = generator.generateWalletFromMnemonic(mnemonic);
console.log(generator.getWalletDetails(wallet));
