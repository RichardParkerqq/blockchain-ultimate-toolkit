interface Peer {
  id: string;
  address: string;
  isConnected: boolean;
}

export class P2PNetworkSimulator {
  private peers: Peer[] = [];
  private maxPeers = 50;

  addPeer(address: string): string {
    const id = Math.random().toString(36).substring(2, 10);
    if (this.peers.length >= this.maxPeers) throw new Error("Max peers reached");
    
    this.peers.push({ id, address, isConnected: true });
    return id;
  }

  disconnectPeer(id: string) {
    const peer = this.peers.find(p => p.id === id);
    if (peer) peer.isConnected = false;
  }

  broadcastMessage(message: string): string[] {
    const recipients: string[] = [];
    for (const peer of this.peers) {
      if (peer.isConnected) {
        recipients.push(peer.address);
      }
    }
    return recipients;
  }

  getConnectedPeers(): Peer[] {
    return this.peers.filter(p => p.isConnected);
  }
}
