import { ethers } from 'ethers';

export class SwapRouterHelper {
  static encodeSwapPath(tokenA: string, tokenB: string, fee: number = 3000): string {
    const path = ethers.solidityPacked(
      ['address', 'uint24', 'address'],
      [tokenA, fee, tokenB]
    );
    return path;
  }

  calculateMinimumOutput(amountIn: string, priceImpact: number = 0.01): string {
    const amount = parseFloat(amountIn);
    const minOut = amount * (1 - priceImpact);
    return minOut.toFixed(6);
  }

  formatSwapDeadline(minutes: number = 10): bigint {
    const deadline = Math.floor(Date.now() / 1000) + minutes * 60;
    return BigInt(deadline);
  }
}
