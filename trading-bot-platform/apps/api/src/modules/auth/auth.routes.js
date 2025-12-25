import express from 'express';
import { validate } from '../../middlewares/validate.js';
import { loginSchema } from './auth.validators.js';
import { authService } from './auth.service.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken, rotateRefreshToken } from './auth.tokens.js';
import { auditService } from '../audit/audit.service.js';

const router = express.Router();

router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.verifyCredentials(email, password);
  if (!user) {
    await auditService.log('auth.login.failure', { email });
    return res.status(401).json({ error: 'invalid credentials' });
  }
  const access = signAccessToken({ sub: String(user._id), role: user.role, tenantId: user.tenantId });
  const refresh = signRefreshToken(String(user._id));
  await auditService.log('auth.login.success', { userId: String(user._id), email });
  res.json({ accessToken: access, refreshToken: refresh });
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  const info = verifyRefreshToken(refreshToken);
  if (!info) return res.status(401).json({ error: 'invalid refresh token' });
  const newRefresh = rotateRefreshToken(info.userId, info.tokenId);
  const access = signAccessToken({ sub: info.userId });
  await auditService.log('auth.refresh', { userId: info.userId });
  res.json({ accessToken: access, refreshToken: newRefresh });
});

router.post('/logout', async (req, res) => {
  const { userId } = req.body;
  try {
    const { clearUserRefresh } = await import('../../config/refreshStore.js');
    clearUserRefresh(userId);
    await auditService.log('auth.logout', { userId });
  } catch (e) {
    console.warn('Failed to clear refresh store on logout', e.message || e);
  }
  res.json({ ok: true });
});

export { router as authRoutes };
