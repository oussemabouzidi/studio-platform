'use client';

import React, { useMemo, useRef } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  ariaLabel: string;
  items: React.ReactNode[];
};

export default function SnapCarousel({ title, subtitle, ariaLabel, items }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const id = useMemo(() => `carousel-${Math.random().toString(16).slice(2)}`, []);

  const scrollByPage = (dir: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const amount = Math.max(280, Math.floor(scroller.clientWidth * 0.88));
    scroller.scrollBy({ left: amount * dir, behavior: 'smooth' });
  };

  return (
    <section className="relative" data-reveal>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <h2 className="text-3xl md:text-4xl font-semibold font-special">{title}</h2>
          {subtitle ? (
            <p className="mt-3 max-w-2xl text-sm md:text-base text-white/70 font-special-regular">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="lux-btn-ghost h-11 w-11 rounded-full"
            onClick={() => scrollByPage(-1)}
            aria-controls={id}
            aria-label="Scroll left"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            className="lux-btn-ghost h-11 w-11 rounded-full"
            onClick={() => scrollByPage(1)}
            aria-controls={id}
            aria-label="Scroll right"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>

      <div
        id={id}
        ref={scrollerRef}
        aria-label={ariaLabel}
        className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((node, idx) => (
          <div key={idx} className="snap-start">
            {node}
          </div>
        ))}
      </div>
    </section>
  );
}

