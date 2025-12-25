import IORedis from 'ioredis';

// Redis-backed refresh store implementation.
// Keys per user: `refresh:{userId}:current` -> tokenId
// Set of revoked tokens: `refresh:{userId}:revoked` (Redis set)

let client;
export function init(redisUrl) {
  if (client) return client;
  client = new IORedis(redisUrl);
  return client;
}

export async function storeRefreshTokenRedis(userId, tokenId, meta = {}) {
  await client.set(`refresh:${userId}:current`, tokenId);
  // optionally store meta as json
  if (meta) await client.set(`refresh:${userId}:meta`, JSON.stringify(meta));
}

export async function revokeRefreshTokenRedis(userId, tokenId) {
  await client.sadd(`refresh:${userId}:revoked`, tokenId);
  const cur = await client.get(`refresh:${userId}:current`);
  if (cur === tokenId) await client.del(`refresh:${userId}:current`);
}

export async function isRefreshRevokedRedis(userId, tokenId) {
  const isMember = await client.sismember(`refresh:${userId}:revoked`, tokenId);
  return isMember === 1;
}

export async function getCurrentTokenIdRedis(userId) {
  return await client.get(`refresh:${userId}:current`);
}

export async function clearUserRefreshRedis(userId) {
  await client.del(`refresh:${userId}:current`);
  await client.del(`refresh:${userId}:meta`);
  // keep revoked set for audit history; optional to remove
}
