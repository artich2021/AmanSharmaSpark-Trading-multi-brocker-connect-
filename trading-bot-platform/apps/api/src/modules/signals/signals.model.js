import mongoose from 'mongoose';

const SignalSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  tenantId: { type: String, default: null },
  symbol: { type: String, required: true },
  side: { type: String, enum: ['buy', 'sell'], required: true },
  volume: { type: Number, required: true },
  executionType: { type: String, enum: ['market', 'pending'], default: 'market' },
  triggerPrice: { type: Number },
  mt5AccountIds: { type: [String], default: [] },
  ctraderAccountIds: { type: [String], default: [] },
  status: { type: String, enum: ['QUEUED', 'EXECUTED', 'CANCELLED'], default: 'QUEUED' }
}, { timestamps: true });

export const Signal = mongoose.model('Signal', SignalSchema);
