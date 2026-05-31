# yt thumbnail generator app

## How to do local dev

```bash
# Full stack (Next.js + Postgres in Docker)
npm run dev:docker

# Postgres only (Next.js on host)
npm run db:docker
npm run dev

# First-time schema
npx prisma db push
```