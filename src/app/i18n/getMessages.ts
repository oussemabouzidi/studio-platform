import type { Locale } from "@/app/i18n/locales";
import { DEFAULT_LOCALE, normalizeLocale } from "@/app/i18n/locales";

export type Messages = Record<string, unknown>;

export function resolveLocale(input: unknown): Locale {
  return normalizeLocale(input);
}

export async function getMessages(inputLocale: unknown): Promise<{
  locale: Locale;
  messages: Messages;
}> {
  const locale = resolveLocale(inputLocale);

  switch (locale) {
    case "fr": {
      const mod = await import("./messages/fr.json");
      return { locale, messages: mod.default as Messages };
    }
    case "de": {
      const mod = await import("./messages/de.json");
      return { locale, messages: mod.default as Messages };
    }
    case "ja": {
      const mod = await import("./messages/ja.json");
      return { locale, messages: mod.default as Messages };
    }
    case "es": {
      const mod = await import("./messages/es.json");
      return { locale, messages: mod.default as Messages };
    }
    case "ru": {
      const mod = await import("./messages/ru.json");
      return { locale, messages: mod.default as Messages };
    }
    case "pt": {
      const mod = await import("./messages/pt.json");
      return { locale, messages: mod.default as Messages };
    }
    case "en":
    default: {
      const mod = await import("./messages/en.json");
      return { locale: DEFAULT_LOCALE, messages: mod.default as Messages };
    }
  }
}

export async function getMessagesBundle(inputLocale: unknown): Promise<{
  locale: Locale;
  messages: Messages;
  fallbackMessages: Messages;
}> {
  const { locale, messages } = await getMessages(inputLocale);
  if (locale === DEFAULT_LOCALE) {
    return { locale, messages, fallbackMessages: messages };
  }

  const fallback = await getMessages(DEFAULT_LOCALE);
  return { locale, messages, fallbackMessages: fallback.messages };
}
