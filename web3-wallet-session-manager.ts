export class WalletSessionManager {
  private readonly STORAGE_KEY = 'wallet_session';
  private readonly SESSION_TTL = 24 * 60 * 60 * 1000;

  saveSession(address: string) {
    const session = {
      address,
      timestamp: Date.now(),
      expires: Date.now() + this.SESSION_TTL
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
  }

  getSession(): { address: string | null; valid: boolean } {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return { address: null, valid: false };

    try {
      const session = JSON.parse(data);
      const valid = Date.now() < session.expires;
      return { address: session.address, valid };
    } catch (e) {
      return { address: null, valid: false };
    }
  }

  clearSession() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isSessionActive(): boolean {
    return this.getSession().valid;
  }
}
