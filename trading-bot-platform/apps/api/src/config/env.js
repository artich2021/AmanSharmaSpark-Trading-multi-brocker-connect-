import dotenv from 'dotenv';
dotenv.config();

export const env = {
  nodePort: Number(process.env.NODE_PORT || 8000),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  internalToken: process.env.INTERNAL_TOKEN || 'change-me',
  pyExecutorUrl: process.env.PY_EXECUTOR_URL || 'http://127.0.0.1:9000'
};
