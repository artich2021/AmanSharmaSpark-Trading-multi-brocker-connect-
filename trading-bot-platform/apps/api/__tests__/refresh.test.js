import { genTokenId, storeRefreshToken, isRefreshRevoked, revokeRefreshToken, getCurrentTokenId, clearUserRefresh } from '../src/config/refreshStore.js';

describe('refreshStore (in-memory)', () => {
  const userId = 'user-test-1';

  afterEach(() => {
    clearUserRefresh(userId);
  });

  test('genTokenId generates id', () => {
    const id = genTokenId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(10);
  });

  test('store and get current token', () => {
    const tokenId = genTokenId();
    storeRefreshToken(userId, tokenId, { note: 't1' });
    const cur = getCurrentTokenId(userId);
    expect(cur).toBe(tokenId);
  });

  test('revoke token marks revoked and clears current', () => {
    const t1 = genTokenId();
    storeRefreshToken(userId, t1);
    expect(isRefreshRevoked(userId, t1)).toBe(false);
    revokeRefreshToken(userId, t1);
    expect(isRefreshRevoked(userId, t1)).toBe(true);
    const cur = getCurrentTokenId(userId);
    expect(cur === null || cur === undefined).toBeTruthy();
  });
});
