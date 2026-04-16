import { ethers } from 'ethers';

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

export class TokenAllowanceManager {
  private contract: ethers.Contract;

  constructor(provider: ethers.BrowserProvider | ethers.JsonRpcProvider, tokenAddress: string) {
    this.contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  }

  async getAllowance(owner: string, spender: string): Promise<bigint> {
    return this.contract.allowance(owner, spender);
  }

  async approve(spender: string, amount: string): Promise<ethers.TransactionResponse> {
    return this.contract.approve(spender, ethers.parseEther(amount));
  }

  async approveMax(spender: string): Promise<ethers.TransactionResponse> {
    const maxAmount = ethers.MaxUint256;
    return this.contract.approve(spender, maxAmount);
  }

  async isApproved(owner: string, spender: string, amount: string): Promise<boolean> {
    const allowance = await this.getAllowance(owner, spender);
    return allowance >= ethers.parseEther(amount);
  }
}
