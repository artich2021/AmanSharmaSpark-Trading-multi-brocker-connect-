import { verifyRefreshToken, rotateRefreshToken } from '../modules/auth/auth.tokens.js';
import { signAccessToken } from '../modules/auth/auth.tokens.js';

// Middleware example for refresh endpoint (not automatic). Use inside route.
export async function handleRefresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });
  const info = verifyRefreshToken(refreshToken);
  if (!info) return res.status(401).json({ error: 'invalid refresh token' });
  const newRefresh = rotateRefreshToken(info.userId, info.tokenId);
  const access = signAccessToken({ sub: info.userId });
  res.json({ accessToken: access, refreshToken: newRefresh });
}
