This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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
