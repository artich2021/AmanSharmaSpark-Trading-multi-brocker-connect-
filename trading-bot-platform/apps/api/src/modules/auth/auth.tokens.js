import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { genTokenId, storeRefreshToken, isRefreshRevoked, revokeRefreshToken, getCurrentTokenId } from '../../config/refreshStore.js';

const ACCESS_TTL = '15m';
const REFRESH_TTL = '30d';

export function signAccessToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: ACCESS_TTL });
}

export function signRefreshToken(userId) {
  const tokenId = genTokenId();
  const token = jwt.sign({ sub: userId, tid: tokenId }, env.jwtSecret, { expiresIn: REFRESH_TTL });
  storeRefreshToken(userId, tokenId, { issuedAt: Date.now() });
  return token;
}

export function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const { sub: userId, tid } = decoded;
    if (isRefreshRevoked(userId, tid)) return null;
    return { userId, tokenId: tid };
  } catch (e) {
    return null;
  }
}

export function rotateRefreshToken(userId, oldTokenId) {
  // revoke old and issue new
  revokeRefreshToken(userId, oldTokenId);
  return signRefreshToken(userId);
}

export function revokeAllRefreshTokens(userId) {
  const cur = getCurrentTokenId(userId);
  if (cur) revokeRefreshToken(userId, cur);
}
