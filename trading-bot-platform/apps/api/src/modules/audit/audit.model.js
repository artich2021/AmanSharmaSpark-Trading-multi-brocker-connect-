import mongoose from 'mongoose';

const AuditSchema = new mongoose.Schema({
  event: String,
  meta: Object,
  ts: Date
});

export const Audit = mongoose.model('Audit', AuditSchema);
