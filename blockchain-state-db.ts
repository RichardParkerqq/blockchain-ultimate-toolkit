import fs from 'fs/promises';
import path from 'path';

export class BlockchainStateDB {
  private dbPath: string;

  constructor(dbName: string = 'chain-state.json') {
    this.dbPath = path.resolve(process.cwd(), dbName);
  }

  async init() {
    try {
      await fs.access(this.dbPath);
    } catch {
      await fs.writeFile(this.dbPath, JSON.stringify({ blocks: {}, accounts: {}, transactions: {} }, null, 2));
    }
  }

  async setAccountState(address: string, data: any) {
    const db = JSON.parse(await fs.readFile(this.dbPath, 'utf8'));
    db.accounts[address.toLowerCase()] = data;
    await fs.writeFile(this.dbPath, JSON.stringify(db, null, 2));
  }

  async getAccountState(address: string): Promise<any | null> {
    const db = JSON.parse(await fs.readFile(this.dbPath, 'utf8'));
    return db.accounts[address.toLowerCase()] || null;
  }
}
