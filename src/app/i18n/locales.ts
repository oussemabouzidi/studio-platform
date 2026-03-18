export const SUPPORTED_LOCALES = [
  "de",
  "fr",
  "en",
  "ja",
  "es",
  "ru",
  "pt",
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function normalizeLocale(input: unknown): Locale {
  if (typeof input !== "string" || !input.trim()) return DEFAULT_LOCALE;

  const raw = input.trim().toLowerCase();
  const primary = raw.split(",")[0]?.trim() ?? raw;
  const tag = primary.split(";")[0]?.trim() ?? primary;
  const base = tag.split("-")[0]?.trim() ?? tag;

  return (SUPPORTED_LOCALES as readonly string[]).includes(base)
    ? (base as Locale)
    : DEFAULT_LOCALE;
}

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
  es: "Español",
  ru: "Русский",
  pt: "Português",
};

