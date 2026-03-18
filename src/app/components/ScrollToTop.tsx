"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/app/i18n/useT";

const SHOW_AFTER_PX = 300;

export default function ScrollToTop() {
  const t = useT();
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const nextVisible = (window.scrollY || 0) > SHOW_AFTER_PX;
      if (nextVisible === isVisibleRef.current) return;
      isVisibleRef.current = nextVisible;
      setIsVisible(nextVisible);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll as EventListener);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label={t("common.scrollToTop")}
      onClick={() => {
        try {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch {
          window.scrollTo(0, 0);
        }
      }}
      className={[
        "fixed z-[80]",
        "right-[calc(1.25rem+env(safe-area-inset-right))]",
        "bottom-[calc(1.25rem+env(safe-area-inset-bottom))]",
        "h-12 w-12 rounded-full",
        "bg-black/45 backdrop-blur-xl",
        "border border-white/10",
        "shadow-[0_10px_30px_rgba(0,0,0,0.55)]",
        "hover:shadow-[0_0_22px_rgba(126,34,206,0.18)]",
        "hover:border-purple-400/40",
        "hover:scale-[1.05]",
        "active:scale-[0.98]",
        "transition-all duration-300 ease-out motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/60",
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none",
        "transform-gpu",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
        className="mx-auto text-white/85"
        fill="none"
      >
        <path
          d="M12 5l-6 6m6-6l6 6M12 5v14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
