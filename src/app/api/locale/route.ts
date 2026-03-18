import { NextResponse } from "next/server";

import { normalizeLocale, type Locale } from "@/app/i18n/locales";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const locale = normalizeLocale((body as { locale?: unknown })?.locale) as Locale;

  const res = NextResponse.json({ locale });
  res.cookies.set("aa_locale", locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return res;
}

