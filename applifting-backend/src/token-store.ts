interface TokenStore {
  accessToken: string | null;
  expiresAt: number | null;
}

const tokenStore: TokenStore = {
  accessToken: null,
  expiresAt: null,
};

export function setToken(token: string, expiresIn: number): void {
  tokenStore.accessToken = token;
  tokenStore.expiresAt = Date.now() + expiresIn * 1000;
}

export function isTokenValid(token: string): boolean {
  return token === tokenStore.accessToken && Date.now() < (tokenStore.expiresAt ?? 0);
}

export function clearToken(): void {
  tokenStore.accessToken = null;
  tokenStore.expiresAt = null;
}
