import { cookies, headers } from "next/headers";

import { normalizeLocale, type Locale } from "@/app/i18n/locales";

export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("aa_locale")?.value;
  if (cookieLocale) return normalizeLocale(cookieLocale);

  const headerStore = await headers();
  const accept = headerStore.get("accept-language") || "";
  return normalizeLocale(accept);
}
