![CI](https://github.com/artich2021/AmanSharmaSpark-Trading-multi-brocker-connect-/actions/workflows/ci-matrix-extended.yml/badge.svg)

# Trading Bot API (apps/api)

Local dev

1. Install dependencies

```bash
cd "trading-bot-platform/apps/api"
npm install
```

2. Start (dev)

```bash
npm run dev
# server will run on PORT from env or 8000
```

Notes
- Uses in-memory refresh store by default. To enable Redis-backed refresh store set `REDIS_URL`.
- Configure `MONGO_URL` in env for production; dev mode accepts in-memory DB (if implemented).

Replace `artich2021/AmanSharmaSpark-Trading-multi-brocker-connect-` in the CI badge URL with your GitHub owner and repository name to enable the badge.
