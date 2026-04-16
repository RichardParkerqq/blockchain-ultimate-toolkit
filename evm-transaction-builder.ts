import { ethers, TransactionRequest } from 'ethers';

export class EvmTransactionBuilder {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor(rpcUrl: string, privateKey: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  async buildTransferTransaction(to: string, amount: string): Promise<TransactionRequest> {
    const nonce = await this.wallet.getNonce();
    const gasPrice = await this.provider.getGasPrice();
    const balance = await this.wallet.getBalance();

    return {
      to,
      value: ethers.parseEther(amount),
      nonce,
      gasLimit: 21000,
      gasPrice,
      chainId: (await this.provider.getNetwork()).chainId
    };
  }

  async sendTransaction(tx: TransactionRequest): Promise<ethers.TransactionResponse> {
    return this.wallet.sendTransaction(tx);
  }

  async getTransactionReceipt(hash: string) {
    return this.provider.getTransactionReceipt(hash);
  }
}
