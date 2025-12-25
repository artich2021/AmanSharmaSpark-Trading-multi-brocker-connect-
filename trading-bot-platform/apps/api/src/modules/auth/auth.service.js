import { User } from '../users/users.model.js';
import bcrypt from 'bcryptjs';

export const authService = {
  async verifyCredentials(email, password) {
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash || '');
    return ok ? user : null;
  }
};
