import { signRefreshToken, verifyRefreshToken, rotateRefreshToken, revokeAllRefreshTokens } from '../src/modules/auth/auth.tokens.js';

describe('auth.tokens rotation and revocation', () => {
  const userId = 'u-rotate-1';

  test('sign and verify refresh token', () => {
    const token = signRefreshToken(userId);
    const info = verifyRefreshToken(token);
    expect(info).not.toBeNull();
    expect(info.userId).toBe(userId);
    expect(info.tokenId).toBeTruthy();
  });

  test('rotate refresh token revokes previous token', () => {
    const oldToken = signRefreshToken(userId);
    const oldInfo = verifyRefreshToken(oldToken);
    expect(oldInfo).not.toBeNull();

    const newToken = rotateRefreshToken(userId, oldInfo.tokenId);
    const oldAfter = verifyRefreshToken(oldToken);
    expect(oldAfter).toBeNull();

    const newInfo = verifyRefreshToken(newToken);
    expect(newInfo).not.toBeNull();
    expect(newInfo.userId).toBe(userId);
  });

  test('revokeAllRefreshTokens invalidates current token', () => {
    const token = signRefreshToken(userId);
    const info = verifyRefreshToken(token);
    expect(info).not.toBeNull();
    revokeAllRefreshTokens(userId);
    const after = verifyRefreshToken(token);
    expect(after).toBeNull();
  });
});
