import express from 'express';
import { security } from './config/security.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { signalsRoutes } from './modules/signals/signals.routes.js';

export function makeApp() {
  const app = express();
  security(app);
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (req, res) => res.json({ ok: true }));

  // Mount feature routes (vertical slices)
  app.use('/auth', authRoutes);
  app.use('/api', signalsRoutes);

  app.use(errorHandler);
  return app;
}
