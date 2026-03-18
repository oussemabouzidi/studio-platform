"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { Locale } from "@/app/i18n/locales";
import { DEFAULT_LOCALE } from "@/app/i18n/locales";
import type { Messages } from "@/app/i18n/getMessages";
import { getMessagesBundle } from "@/app/i18n/getMessages";
import { createTranslator } from "@/app/i18n/translate";

type I18nContextValue = {
  locale: Locale;
  messages: Messages;
  t: (key: string, vars?: Record<string, string | number>) => string;
  setLocale: (nextLocale: Locale) => Promise<void>;
  isChangingLocale: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export default function I18nProvider({
  locale,
  messages,
  fallbackMessages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  fallbackMessages: Messages;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChangingLocale, setIsChangingLocale] = useState(false);
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null);

  const [activeLocale, setActiveLocale] = useState<Locale>(locale);
  const [activeMessages, setActiveMessages] = useState<Messages>(messages);
  const [activeFallbackMessages, setActiveFallbackMessages] =
    useState<Messages>(fallbackMessages);

  useEffect(() => {
    if (!pendingLocale) return;

    if (locale === pendingLocale) {
      setIsChangingLocale(false);
      setPendingLocale(null);
      return;
    }

    const timeout = setTimeout(() => {
      setIsChangingLocale(false);
      setPendingLocale(null);
    }, 8000);

    return () => clearTimeout(timeout);
  }, [locale, pendingLocale]);

  useEffect(() => {
    setActiveLocale(locale);
    setActiveMessages(messages);
    setActiveFallbackMessages(fallbackMessages);
  }, [locale, messages, fallbackMessages]);

  const t = useMemo(
    () => createTranslator(activeMessages, activeFallbackMessages),
    [activeMessages, activeFallbackMessages]
  );

  const setLocale = useCallback(
    async (nextLocale: Locale) => {
      const target = nextLocale || DEFAULT_LOCALE;
      if (target === activeLocale) return;

      setIsChangingLocale(true);
      setPendingLocale(target);
      try {
        const res = await fetch("/api/locale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale: target }),
        });

        if (!res.ok) throw new Error("Failed to set locale");

        try {
          const {
            locale: resolvedLocale,
            messages: resolvedMessages,
            fallbackMessages: resolvedFallbackMessages,
          } = await getMessagesBundle(target);
          setActiveLocale(resolvedLocale);
          setActiveMessages(resolvedMessages);
          setActiveFallbackMessages(resolvedFallbackMessages);
        } catch {
          // If client-side message loading fails, server refresh will still apply the new locale.
        }

        try {
          document.documentElement.lang = target;
        } catch {
          // ignore
        }
        router.refresh();
      } catch {
        setPendingLocale(null);
        setIsChangingLocale(false);
      }
    },
    [activeLocale, router]
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale: activeLocale,
      messages: activeMessages,
      t,
      setLocale,
      isChangingLocale,
    }),
    [activeLocale, activeMessages, t, setLocale, isChangingLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
