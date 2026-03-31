# Premium QR Restaurant Ordering App

Next.js App Router project for a premium, rebrandable restaurant ordering experience:
- Public restaurant website (`/`)
- Customer QR menu and ordering (`/menu/[tableId]`)
- Admin dashboard (`/admin/*`)

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Prisma + PostgreSQL (Prisma Postgres compatible)
- NextAuth (Credentials)
- Pusher (optional realtime)
- QR generation with `qrcode`
- Zustand (cart persistence)

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Copy env template:

```bash
cp .env.example .env
```

3. Set your Prisma Postgres env values in `.env`:
   `DATABASE_URL` (pooled `prisma+postgres://...`) and `DIRECT_URL` (`postgres://...`).

4. Generate Prisma client and push schema:

```bash
npm run db:generate
npm run db:push
```

5. Seed demo data:

```bash
npm run db:seed
```

6. Start app:

```bash
npm run dev
```

## Default Admin Login

- Email: value of `ADMIN_EMAIL`
- Password: value of `ADMIN_PASSWORD`

## Key Routes

- Website: `/`
- Customer Menu: `/menu/[tableId]`
- Customer Cart: `/menu/[tableId]/cart`
- Admin Login: `/admin/login`
- Admin Dashboard: `/admin`
