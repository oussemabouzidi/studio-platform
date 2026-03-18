"use client";

import LuxSpinner from "@/app/components/LuxSpinner";
import { useI18n } from "@/app/i18n/I18nProvider";
import { useT } from "@/app/i18n/useT";

export default function LocaleChangeOverlay() {
  const { isChangingLocale } = useI18n();
  const t = useT();

  if (!isChangingLocale) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-[200]",
        "flex items-center justify-center",
        "bg-black/50 backdrop-blur-sm",
      ].join(" ")}
      aria-busy="true"
    >
      <div className="lux-card lux-rect px-7 py-7">
        <LuxSpinner size="md" label={t("common.switchingLanguage")} />
      </div>
    </div>
  );
}
