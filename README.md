## Getting Started (Frontend + Backend)

This repo contains:
- **Next.js frontend** (this folder)
- **Express backend** (`backend/`)

### 1) Configure env

Copy `.env.example` to your local env files:
- Next.js: `.env.local`
- Backend: `backend/.env`

At minimum for local dev, ensure:
- `API_BASE_URL` / `NEXT_PUBLIC_API_BASE_URL` point to the backend API (`http://localhost:8800/api`)
- Backend DB vars are set (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`)

### 2) Run backend (Express)

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:8800` by default.

### 3) Run frontend (Next.js)

```bash
npm run dev
```

Frontend runs on `http://localhost:3000` by default.

## Studio ↔ Artist Chat (Next.js + Prisma)

The chat feature is implemented as **Next.js Route Handlers** under `src/app/api/studio-chat/*` and persists messages via **Prisma** models `StudioChatThread` + `StudioChatMessage` (MySQL).

### Database setup

The chat tables live in the same MySQL database pointed to by `DATABASE_URL` (note: Prisma CLI loads env from `.env` by default).

- Fresh database (Prisma-managed): `npm run db:migrate`
- Existing non-empty database (already has other tables): `npm run db:chat:bootstrap`

If you change `DATABASE_URL`, re-run the command against the new database.

## Media Uploads

### Local filesystem mode (default)

Backend config:
- `STORAGE_DRIVER=local`
- `UPLOADS_DIR=./uploads` (relative to `backend/`)

Endpoints:
- `POST /api/upload` → multipart/form-data (`file` field) → returns `{ url, key, provider }`
- `GET /api/media?page=1&pageSize=20` → paginated list
- Uploaded files are served at `GET /uploads/<key>`

Quick local verification:
1) Open the **Manage Profile** page and upload a demo track (Demo Tracks section).
2) Verify backend returns a URL like `http://localhost:8800/uploads/<key>`.
3) Check the file exists under `backend/uploads/`.
4) Call `GET http://localhost:8800/api/media` (or `GET /api/media` via Next.js) to see stored metadata.

### Switch to OVH Object Storage (S3 compatible)

Backend env:
- `STORAGE_DRIVER=s3`
- `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION`
- Optional but recommended: `PUBLIC_CDN_BASE_URL` (public base URL for objects)

Two upload modes:
- **Server-side upload (simple):** keep `USE_PRESIGNED_UPLOADS=false` and use `POST /api/upload`.
- **Presigned upload (recommended):** set `USE_PRESIGNED_UPLOADS=true` (backend) and `NEXT_PUBLIC_USE_PRESIGNED_UPLOADS=true` (frontend).
  - `POST /api/uploads/presign` → `{ uploadUrl, key, publicUrl }`
  - Browser `PUT` directly to `uploadUrl`
  - `POST /api/uploads/confirm` to persist metadata

## Test on a real phone (same Wi-Fi)

If you open the site on your phone, **don't use** `http://localhost:3000` (on a phone, `localhost` is the phone).

1) Start the dev server so it's reachable on your network:

```bash
npm run dev:lan
```

2) Find your computer's LAN IP (example `192.168.1.50`) and open this on the phone:

`http://<YOUR_PC_IP>:3000`

3) If login/OAuth is involved, update `.env.local` so URLs are not hardcoded to `localhost` when testing on mobile:
- `NEXTAUTH_URL` must match the exact URL you open on the phone (IP + port).
- Any `NEXT_PUBLIC_*` API base URL should not point to `localhost` (or use relative `/api/...` via proxy).

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
