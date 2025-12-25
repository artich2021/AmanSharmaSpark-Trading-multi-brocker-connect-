// Minimal audit service: append structured audit events to console or DB
import { Audit } from './audit.model.js';

export const auditService = {
  async log(event, meta = {}) {
    try {
      // Best-effort: persist audit record if model exists; otherwise console
      if (Audit && Audit.create) {
        await Audit.create({ event, meta, ts: new Date() });
      }
    } catch (e) {
      console.log('[AUDIT]', event, meta);
    }
  }
};
