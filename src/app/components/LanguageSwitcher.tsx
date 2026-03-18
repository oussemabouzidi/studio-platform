"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

import { useI18n } from "@/app/i18n/I18nProvider";
import { LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from "@/app/i18n/locales";

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none">
      <path
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M2 12h20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 2c2.8 2.9 4.5 6.3 4.5 10S14.8 19.1 12 22c-2.8-2.9-4.5-6.3-4.5-10S9.2 4.9 12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LanguageSwitcher() {
  const { locale, setLocale, isChangingLocale, t } = useI18n();

  return (
    <div className="fixed z-[75] left-[calc(1.25rem+env(safe-area-inset-left))] bottom-[calc(1.25rem+env(safe-area-inset-bottom))]">
      <Menu as="div" className="relative">
        <Menu.Button
          type="button"
          aria-label={t("common.language")}
          className={[
            "h-11 rounded-full",
            "px-4",
            "bg-black/40 backdrop-blur-lg",
            "border border-white/10",
            "hover:border-purple-400/35 hover:bg-black/55",
            "shadow-[0_10px_30px_rgba(0,0,0,0.55)]",
            "hover:shadow-[0_0_22px_rgba(126,34,206,0.14)]",
            "transition-all duration-300 ease-out motion-reduce:transition-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/60",
            "inline-flex items-center gap-2",
            isChangingLocale ? "opacity-80" : "opacity-100",
          ].join(" ")}
          disabled={isChangingLocale}
        >
          <span className="text-white/85">
            <GlobeIcon />
          </span>
          <span className="text-sm font-medium text-white/85">
            {LOCALE_LABELS[locale]}
          </span>
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-120"
          enterFrom="transform opacity-0 translate-y-2"
          enterTo="transform opacity-100 translate-y-0"
          leave="transition ease-in duration-90"
          leaveFrom="transform opacity-100 translate-y-0"
          leaveTo="transform opacity-0 translate-y-2"
        >
          <Menu.Items className="absolute left-0 bottom-14 w-56 origin-bottom-left lux-popover lux-rect focus:outline-none">
            <div className="px-3 py-2 text-xs text-white/55 border-b border-white/10">
              {t("common.language")}
            </div>
            <div className="py-1">
              {SUPPORTED_LOCALES.map((l) => (
                <Menu.Item key={l}>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={() => void setLocale(l as Locale)}
                      className={[
                        "w-full text-left px-3 py-2 text-sm",
                        active ? "bg-white/5" : "",
                        l === locale ? "text-purple-200" : "text-white/80",
                      ].join(" ")}
                    >
                      {LOCALE_LABELS[l]}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

