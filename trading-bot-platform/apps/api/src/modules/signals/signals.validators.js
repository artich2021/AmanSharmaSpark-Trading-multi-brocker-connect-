import { z } from 'zod';

export const createSignalSchema = z.object({
  userId: z.string().min(1),
  tenantId: z.string().nullable().optional(),
  symbol: z.string().min(1),
  side: z.enum(['buy', 'sell']),
  volume: z.number().positive(),
  executionType: z.enum(['market', 'pending']).optional(),
  triggerPrice: z.number().optional(),
  mt5AccountIds: z.array(z.string()).optional(),
  ctraderAccountIds: z.array(z.string()).optional()
});
