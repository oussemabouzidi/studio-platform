import Link from "next/link";

import { specialGothic } from "@/app/fonts";
import { getMessagesBundle } from "@/app/i18n/getMessages";
import { getRequestLocale } from "@/app/i18n/server";
import { createTranslator } from "@/app/i18n/translate";

export const metadata = {
  title: "Help & Support | Audio Assist",
  description: "Get help with bookings, favorites, and your Audio Assist account.",
};

export default async function SupportPage() {
  const { messages, fallbackMessages } = await getMessagesBundle(await getRequestLocale());
  const t = createTranslator(messages, fallbackMessages);
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(147,51,234,0.22),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.14),transparent_55%)]" />
        <div className="relative mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-center justify-between gap-4">
            <h1 className={`text-3xl sm:text-4xl font-bold ${specialGothic.className}`}>
              {t("support.title")}
            </h1>
            <Link
              href="/pages/home"
              className="lux-btn-ghost inline-flex items-center px-4 py-2 text-sm font-medium text-white/85"
            >
              {t("support.backHome")}
            </Link>
          </div>

          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/70">
            {t("support.subtitle")}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <section className="lux-card lux-rect p-6">
              <h2 className={`text-lg font-semibold ${specialGothic.className}`}>{t("support.quickFixes")}</h2>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                <li>
                  Favorites not showing? Try signing out and back in, then revisit{" "}
                  <Link href="/pages/client/profile/favorite" className="text-purple-300 hover:text-purple-200">
                    Favorite Studios
                  </Link>
                  .
                </li>
                <li>
                  Booking issues? Check{" "}
                  <Link href="/pages/client/studios" className="text-purple-300 hover:text-purple-200">
                    Studios
                  </Link>{" "}
                  and try booking again.
                </li>
                <li>Media upload errors? Ensure files are &lt; 50MB and are image/audio/video types.</li>
              </ul>
            </section>

            <section className="lux-card lux-rect p-6">
              <h2 className={`text-lg font-semibold ${specialGothic.className}`}>{t("support.contact")}</h2>
              <p className="mt-3 text-sm text-white/75">
                For account-specific help, contact support and include your user ID and a screenshot of the issue.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  className={`lux-btn-metal px-5 py-2.5 text-sm font-bold ${specialGothic.className}`}
                  href="mailto:support@audioassist.local?subject=Audio%20Assist%20Support"
                >
                  {t("support.emailSupport")}
                </a>
                <Link
                  href="/pages/client/profile/manage-profile"
                  className="lux-btn-ghost inline-flex items-center px-4 py-2 text-sm font-medium text-white/85"
                >
                  Manage Profile
                </Link>
              </div>
            </section>
          </div>

          <div className="mt-10 text-xs text-white/45">
            If this page was opened from the profile menu, it means the `/support` route is available and working.
          </div>
        </div>
      </div>
    </main>
  );
}
