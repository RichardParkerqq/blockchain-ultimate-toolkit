interface RpcEndpoint {
  url: string;
  weight: number;
  latency: number;
  isHealthy: boolean;
}

export class RpcEndpointManager {
  private endpoints: RpcEndpoint[] = [];

  addEndpoint(url: string, weight: number = 1) {
    this.endpoints.push({ url, weight, latency: 9999, isHealthy: true });
  }

  async checkHealth() {
    for (const endpoint of this.endpoints) {
      try {
        const start = Date.now();
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 3000);
        
        await fetch(endpoint.url, {
          method: 'POST',
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber' }),
          signal: controller.signal
        });
        
        endpoint.latency = Date.now() - start;
        endpoint.isHealthy = true;
      } catch (e) {
        endpoint.isHealthy = false;
      }
    }
  }

  getBestEndpoint(): string | null {
    const healthy = this.endpoints.filter(e => e.isHealthy);
    if (healthy.length === 0) return null;
    return healthy.sort((a, b) => a.latency - b.latency)[0].url;
  }
}
