import express from 'express';
import { validate } from '../../middlewares/validate.js';
import { createSignalSchema } from './signals.validators.js';
import { signalsService } from './signals.service.js';
import { env } from '../../config/env.js';

const router = express.Router();

// Public API: create signal
router.post('/signals', validate(createSignalSchema), async (req, res) => {
  try {
    const result = await signalsService.createSignal(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: 'failed' });
  }
});

// Internal: fetch signal by id (executor)
router.get('/internal/signal/:id', async (req, res) => {
  const token = req.headers['x-internal-token'];
  if (env.internalToken && token !== env.internalToken) return res.status(401).json({ error: 'unauthorized' });
  const s = await signalsService.getSignalById(req.params.id);
  if (!s) return res.status(404).json({ error: 'not found' });
  res.json(s);
});

// Internal: mark executed
router.post('/internal/signal/:id/mark-executed', async (req, res) => {
  const token = req.headers['x-internal-token'];
  if (env.internalToken && token !== env.internalToken) return res.status(401).json({ error: 'unauthorized' });
  const updated = await signalsService.markExecuted(req.params.id);
  if (!updated) return res.status(404).json({ error: 'not found' });
  res.json({ ok: true });
});

export { router as signalsRoutes };
