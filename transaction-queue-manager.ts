import { ethers, TransactionRequest } from 'ethers';

interface QueuedTransaction {
  id: string;
  tx: TransactionRequest;
  status: 'pending' | 'processing' | 'success' | 'failed';
}

export class TransactionQueueManager {
  private queue: QueuedTransaction[] = [];
  private wallet: ethers.Wallet;
  private processing = false;

  constructor(wallet: ethers.Wallet) {
    this.wallet = wallet;
  }

  addTransaction(tx: TransactionRequest): string {
    const id = ethers.id(JSON.stringify(tx) + Date.now());
    this.queue.push({ id, tx, status: 'pending' });
    this.processQueue();
    return id;
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (true) {
      const pendingTx = this.queue.find(t => t.status === 'pending');
      if (!pendingTx) break;

      pendingTx.status = 'processing';
      try {
        const response = await this.wallet.sendTransaction(pendingTx.tx);
        await response.wait();
        pendingTx.status = 'success';
      } catch (e) {
        pendingTx.status = 'failed';
      }
    }

    this.processing = false;
  }

  getTransactionStatus(id: string): QueuedTransaction | undefined {
    return this.queue.find(t => t.id === id);
  }
}
