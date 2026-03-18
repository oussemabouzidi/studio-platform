"use client";

import { useI18n } from "@/app/i18n/I18nProvider";

export function useT() {
  const { t } = useI18n();
  return t;
}

