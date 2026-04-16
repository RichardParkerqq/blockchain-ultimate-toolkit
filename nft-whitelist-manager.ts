import { MerkleTree } from './merkle-tree-implement';
import { CryptoHashUtils } from './crypto-hash-utils';

export class NFTWhitelistManager {
  private merkleTree: MerkleTree | null = null;
  private whitelist: string[] = [];

  addToWhitelist(address: string) {
    this.whitelist.push(address.toLowerCase());
  }

  buildMerkleTree() {
    this.merkleTree = new MerkleTree(this.whitelist);
  }

  getRoot(): string {
    if (!this.merkleTree) throw new Error("Tree not built");
    return this.merkleTree.getRoot();
  }

  getProof(address: string): string[] {
    if (!this.merkleTree) throw new Error("Tree not built");
    const lower = address.toLowerCase();
    const index = this.whitelist.findIndex(a => a === lower);
    return this.merkleTree.getProof(index);
  }
}
