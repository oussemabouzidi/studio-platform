'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

export default function LuxMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const root = document.documentElement;
    root.classList.add("lux-motion");

    let pointerRaf = 0;
    let scrollRaf = 0;
    let lastPointerX = 0.5;
    let lastPointerY = 0.5;

    const setPointerVars = () => {
      pointerRaf = 0;
      const px = (lastPointerX - 0.5) * 2; // -1..1
      const py = (lastPointerY - 0.5) * 2; // -1..1
      const dx = px * 18; // px
      const dy = py * 18;
      root.style.setProperty('--lux-px', `${px.toFixed(4)}`);
      root.style.setProperty('--lux-py', `${py.toFixed(4)}`);
      root.style.setProperty('--lux-mx', `${dx.toFixed(1)}px`);
      root.style.setProperty('--lux-my', `${dy.toFixed(1)}px`);
      root.style.setProperty('--lux-mx-sm', `${(dx * 0.55).toFixed(1)}px`);
      root.style.setProperty('--lux-my-sm', `${(dy * 0.55).toFixed(1)}px`);
      root.style.setProperty('--lux-mx-lg', `${(dx * 1.25).toFixed(1)}px`);
      root.style.setProperty('--lux-my-lg', `${(dy * 1.25).toFixed(1)}px`);
    };

    const onPointerMove = (e: PointerEvent) => {
      const x = e.clientX / Math.max(1, window.innerWidth);
      const y = e.clientY / Math.max(1, window.innerHeight);
      lastPointerX = Math.min(1, Math.max(0, x));
      lastPointerY = Math.min(1, Math.max(0, y));
      if (pointerRaf) return;
      pointerRaf = window.requestAnimationFrame(setPointerVars);
    };

    const setScrollVars = () => {
      scrollRaf = 0;
      const y = window.scrollY || 0;
      root.style.setProperty('--lux-scroll-y', `${y.toFixed(0)}px`);
      root.style.setProperty('--lux-hero-parallax', `${Math.min(640, y) * -0.06}px`);
      const fade = 1 - Math.min(1, y / 520);
      root.style.setProperty('--lux-hero-fade', `${fade.toFixed(3)}`);
    };

    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = window.requestAnimationFrame(setScrollVars);
    };

    const revealSelector = '[data-reveal]';
    const parallaxSelector = '[data-parallax]';

    const revealEls = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));
    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>(parallaxSelector));

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add('is-revealed');
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -12% 0px' },
    );

    for (const el of revealEls) io.observe(el);

    const updateParallax = () => {
      const vh = Math.max(1, window.innerHeight);
      for (const el of parallaxEls) {
        const speed = Number(el.dataset.parallax ?? '0.08');
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const progress = (center - vh / 2) / vh; // -1..1-ish
        const offset = -progress * speed * 160;
        el.style.setProperty('--lux-parallax', `${offset.toFixed(1)}px`);
      }
    };

    let parallaxRaf = 0;
    const onParallaxScroll = () => {
      if (parallaxRaf) return;
      parallaxRaf = window.requestAnimationFrame(() => {
        parallaxRaf = 0;
        updateParallax();
      });
    };

    const canUsePointerMotion =
      window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches ?? false;

    if (canUsePointerMotion) window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onParallaxScroll, { passive: true });

    setPointerVars();
    setScrollVars();
    updateParallax();

    return () => {
      if (pointerRaf) window.cancelAnimationFrame(pointerRaf);
      if (scrollRaf) window.cancelAnimationFrame(scrollRaf);
      if (parallaxRaf) window.cancelAnimationFrame(parallaxRaf);
      if (canUsePointerMotion)
        window.removeEventListener('pointermove', onPointerMove as EventListener);
      window.removeEventListener('scroll', onScroll as EventListener);
      window.removeEventListener('scroll', onParallaxScroll as EventListener);
      io.disconnect();
      root.classList.remove("lux-motion");
    };
  }, [pathname]);

  return null;
}
