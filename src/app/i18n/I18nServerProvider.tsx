import type { Locale } from "@/app/i18n/locales";
import { getMessagesBundle } from "@/app/i18n/getMessages";
import I18nProvider from "@/app/i18n/I18nProvider";

export default async function I18nServerProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const { messages, fallbackMessages } = await getMessagesBundle(locale);
  return (
    <I18nProvider locale={locale} messages={messages} fallbackMessages={fallbackMessages}>
      {children}
    </I18nProvider>
  );
}
