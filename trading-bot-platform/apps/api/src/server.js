import { makeApp } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

async function main() {
  await connectDb();
  const app = makeApp();
  app.listen(env.nodePort, () => console.log('API listening on', env.nodePort));
}

main().catch((e) => {
  console.error('Failed to start API', e);
  process.exit(1);
});
