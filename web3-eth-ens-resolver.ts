import { ethers } from 'ethers';

export class EnsResolver {
  private provider: ethers.JsonRpcProvider | ethers.BrowserProvider;

  constructor(provider: ethers.JsonRpcProvider | ethers.BrowserProvider) {
    this.provider = provider;
  }

  async resolveName(name: string): Promise<string | null> {
    try {
      return await this.provider.resolveName(name);
    } catch (e) {
      return null;
    }
  }

  async lookupAddress(address: string): Promise<string | null> {
    try {
      return await this.provider.lookupAddress(address);
    } catch (e) {
      return null;
    }
  }

  async getAvatar(name: string): Promise<string | null> {
    try {
      const resolver = await this.provider.getResolver(name);
      return resolver ? resolver.getAvatar() : null;
    } catch (e) {
      return null;
    }
  }
}
