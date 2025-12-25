import { Signal } from './signals.model.js';

export const signalsService = {
  async createSignal(payload) {
    const s = await Signal.create(payload);
    return s.toObject();
  },
  async getSignalById(id) {
    return await Signal.findById(id).lean();
  },
  async markExecuted(id) {
    return await Signal.findByIdAndUpdate(id, { status: 'EXECUTED' }, { new: true }).lean();
  }
};
