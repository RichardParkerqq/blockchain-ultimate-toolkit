import { ethers } from 'ethers';

export class EvmEventListener {
  private wsProvider: ethers.WebSocketProvider;
  private contracts: Map<string, ethers.Contract> = new Map();

  constructor(wsRpcUrl: string) {
    this.wsProvider = new ethers.WebSocketProvider(wsRpcUrl);
  }

  registerContract(contractName: string, address: string, abi: any) {
    const contract = new ethers.Contract(address, abi, this.wsProvider);
    this.contracts.set(contractName, contract);
  }

  listenToEvent(contractName: string, eventName: string, callback: (...args: any[]) => void) {
    const contract = this.contracts.get(contractName);
    if (!contract) throw new Error("Contract not registered");
    
    contract.on(eventName, callback);
  }

  removeAllListeners() {
    for (const contract of this.contracts.values()) {
      contract.removeAllListeners();
    }
    this.wsProvider.destroy();
  }
}
