import crypto from 'crypto';

const REDIS_URL = process.env.REDIS_URL || '';
let redisImpl = null;

function inMemoryImpl() {
  // Simple in-memory refresh token store for development.
  const store = new Map(); // userId -> { current: tokenId, revoked: Set }
  return {
    genTokenId: () => crypto.randomBytes(16).toString('hex'),
    storeRefreshToken: (userId, tokenId, meta = {}) => {
      const entry = store.get(userId) || { current: null, revoked: new Set(), meta: {} };
      entry.current = tokenId;
      entry.meta = meta;
      store.set(userId, entry);
    },
    revokeRefreshToken: (userId, tokenId) => {
      const entry = store.get(userId);
      if (!entry) return;
      entry.revoked.add(tokenId);
      if (entry.current === tokenId) entry.current = null;
    },
    isRefreshRevoked: (userId, tokenId) => {
      const entry = store.get(userId);
      if (!entry) return true;
      return entry.revoked.has(tokenId);
    },
    getCurrentTokenId: (userId) => {
      const entry = store.get(userId);
      return entry ? entry.current : null;
    },
    clearUserRefresh: (userId) => store.delete(userId)
  };
}

// Default to in-memory implementation immediately so exports are usable synchronously.
redisImpl = inMemoryImpl();

if (REDIS_URL) {
  // Try to dynamically import Redis-backed implementation and swap in when ready.
  import('./refreshStore.redis.js')
    .then((redisModule) => {
      try {
        const client = redisModule.init(REDIS_URL);
        redisImpl = {
          genTokenId: () => crypto.randomBytes(16).toString('hex'),
          storeRefreshToken: async (u, t, m) => redisModule.storeRefreshTokenRedis(u, t, m),
          revokeRefreshToken: async (u, t) => redisModule.revokeRefreshTokenRedis(u, t),
          isRefreshRevoked: async (u, t) => redisModule.isRefreshRevokedRedis(u, t),
          getCurrentTokenId: async (u) => redisModule.getCurrentTokenIdRedis(u),
          clearUserRefresh: async (u) => redisModule.clearUserRefreshRedis(u)
        };
        console.log('Using Redis refresh store');
      } catch (e) {
        console.warn('Failed to initialize Redis refresh store after import, keeping in-memory', e.message || e);
      }
    })
    .catch((e) => {
      console.warn('Failed to import Redis refresh store, keeping in-memory', e.message || e);
    });
}

export const genTokenId = () => redisImpl.genTokenId();
export const storeRefreshToken = (userId, tokenId, meta = {}) => redisImpl.storeRefreshToken(userId, tokenId, meta);
export const revokeRefreshToken = (userId, tokenId) => redisImpl.revokeRefreshToken(userId, tokenId);
export const isRefreshRevoked = (userId, tokenId) => redisImpl.isRefreshRevoked(userId, tokenId);
export const getCurrentTokenId = (userId) => redisImpl.getCurrentTokenId(userId);
export const clearUserRefresh = (userId) => redisImpl.clearUserRefresh(userId);
