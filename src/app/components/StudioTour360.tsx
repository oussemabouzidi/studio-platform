'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaExpand, FaHandPointer, FaTimes } from 'react-icons/fa';
import { useT } from '@/app/i18n/useT';

export type StudioTourHotspot = {
  id: string;
  label: string;
  x: number; // 0..1 across panorama width
  y: number; // 0..1 across panorama height
  description?: string;
  tags?: string[];
};

export type StudioTourScene = {
  id: string;
  title: string;
  imageUrl: string;
  hotspots?: StudioTourHotspot[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildDefaultHotspots(labels: string[], defaultDescription: string): StudioTourHotspot[] {
  const items = labels.filter(Boolean).slice(0, 10);
  if (items.length === 0) return [];
  return items.map((label, index) => {
    const t = (index + 1) / (items.length + 1);
    const y = clamp(0.58 + Math.sin(index * 1.7) * 0.12, 0.28, 0.78);
    return {
      id: `${index}-${label}`.toLowerCase().replace(/\s+/g, '-'),
      label,
      x: clamp(t, 0.06, 0.94),
      y,
      description: defaultDescription,
    };
  });
}

function normalizeScenes(
  scenes: StudioTourScene[],
  equipmentLabels: string[],
  defaultHotspotDescription: string,
) {
  const cleaned = scenes
    .filter((s) => s && s.id && s.title && s.imageUrl)
    .map((s) => ({
      ...s,
      hotspots:
        s.hotspots && s.hotspots.length > 0
          ? s.hotspots
          : buildDefaultHotspots(equipmentLabels, defaultHotspotDescription),
    }));
  return cleaned;
}

function Viewer({
  scene,
  selectedId,
  onSelect,
  heightClassName,
}: {
  scene: StudioTourScene;
  selectedId: string | null;
  onSelect: (id: string) => void;
  heightClassName: string;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [offsetX, setOffsetX] = useState(0);
  const [maxOffsetX, setMaxOffsetX] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  const dragRef = useRef<{
    startX: number;
    startOffset: number;
    active: boolean;
  }>({ startX: 0, startOffset: 0, active: false });

  const driftRef = useRef<{
    raf: number;
    direction: 1 | -1;
    lastInteractAt: number;
  }>({ raf: 0, direction: 1, lastInteractAt: 0 });

  const updateMetrics = () => {
    const viewport = viewportRef.current;
    const img = imageRef.current;
    if (!viewport || !img) return;
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const iw = img.clientWidth;
    setViewportWidth(vw);
    setViewportHeight(vh);
    const max = Math.max(0, iw - vw);
    setMaxOffsetX(max);
    setOffsetX((prev) => clamp(prev, 0, max));
  };

  useEffect(() => {
    updateMetrics();
    const onResize = () => updateMetrics();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.imageUrl]);

  useEffect(() => {
    // Center-ish on scene change
    setOffsetX(Math.max(0, maxOffsetX * 0.45));
    driftRef.current.lastInteractAt = Date.now();
  }, [scene.id, maxOffsetX]);

  useEffect(() => {
    // Gentle auto-drift (pauses after interaction)
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    if (reduced) return;

    const tick = () => {
      driftRef.current.raf = 0;
      const now = Date.now();
      const recentlyInteracted = now - driftRef.current.lastInteractAt < 1600;
      if (!dragRef.current.active && !recentlyInteracted && maxOffsetX > 8) {
        const speed = Math.min(0.32, Math.max(0.12, viewportWidth / 2200));
        setOffsetX((prev) => {
          let next = prev + speed * driftRef.current.direction;
          if (next <= 0) {
            next = 0;
            driftRef.current.direction = 1;
          } else if (next >= maxOffsetX) {
            next = maxOffsetX;
            driftRef.current.direction = -1;
          }
          return next;
        });
      }

      driftRef.current.raf = window.requestAnimationFrame(tick);
    };

    driftRef.current.raf = window.requestAnimationFrame(tick);
    return () => {
      if (driftRef.current.raf) window.cancelAnimationFrame(driftRef.current.raf);
      driftRef.current.raf = 0;
    };
  }, [maxOffsetX, viewportWidth]);

  const onPointerDown = (e: React.PointerEvent) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    dragRef.current.active = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startOffset = offsetX;
    driftRef.current.lastInteractAt = Date.now();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const next = clamp(dragRef.current.startOffset - dx, 0, maxOffsetX);
    setOffsetX(next);
  };

  const onPointerUp = () => {
    dragRef.current.active = false;
    driftRef.current.lastInteractAt = Date.now();
  };

  const hotspots = scene.hotspots ?? [];
  const hotspotPositions = useMemo(() => {
    const img = imageRef.current;
    if (!img) return [];
    const iw = img.clientWidth || 1;
    const vh = viewportHeight || 1;
    return hotspots.map((h) => ({
      ...h,
      leftPx: h.x * iw - offsetX,
      topPx: h.y * vh,
    }));
  }, [hotspots, offsetX, viewportHeight]);

  return (
    <div
      ref={viewportRef}
      className={[
        'relative overflow-hidden rounded-xl border border-white/10 bg-black/30',
        'select-none touch-pan-y',
        heightClassName,
      ].join(' ')}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="application"
      aria-label="360 studio tour viewer"
    >
      <img
        ref={imageRef}
        src={scene.imageUrl}
        alt={`${scene.title} panorama`}
        loading="lazy"
        draggable={false}
        onLoad={updateMetrics}
        className="h-full w-auto max-w-none opacity-95"
        style={{
          transform: `translate3d(${-offsetX}px, 0, 0)`,
          willChange: 'transform',
          transition: dragRef.current.active ? 'none' : 'transform 260ms var(--lux-ease-out)',
        }}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
      </div>

      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-2 text-xs text-white/80 backdrop-blur-xl">
        <FaHandPointer className="text-white/70" />
        <span className="font-special-regular">Drag to look around</span>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4">
        <div className="text-xs text-white/70 font-special-regular">
          <span className="lux-icon-metal">360°</span> • {scene.title}
        </div>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[color:var(--lux-metal-platinum)] via-[color:var(--lux-metal-gold)] to-[color:var(--lux-metal-silver)]"
            style={{
              width: `${maxOffsetX <= 1 ? 100 : clamp((offsetX / maxOffsetX) * 100, 0, 100)}%`,
              transition: 'width 260ms var(--lux-ease-out)',
            }}
          />
        </div>
      </div>

      <div className="absolute inset-0">
        {hotspotPositions.map((h) => {
          const visible = h.leftPx >= -40 && h.leftPx <= viewportWidth + 40;
          return (
            <button
              key={h.id}
              type="button"
              onClick={() => onSelect(h.id)}
              className={[
                'absolute -translate-x-1/2 -translate-y-1/2',
                'rounded-full border border-white/18 bg-black/55 backdrop-blur-xl',
                'px-2.5 py-2 text-[11px] text-white/85 shadow-[0_16px_60px_rgba(0,0,0,0.55)]',
                'transition-transform duration-200 ease-out hover:scale-[1.02]',
                selectedId === h.id ? 'ring-4 ring-[color:var(--lux-metal-gold)]/18' : '',
                visible ? 'opacity-100' : 'opacity-0 pointer-events-none',
              ].join(' ')}
              style={{ left: `${h.leftPx}px`, top: `${h.topPx}px` }}
              aria-label={h.label}
            >
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[color:var(--lux-metal-gold)] shadow-[0_0_0_4px_rgba(214,178,106,0.14)]" />
                <span className="font-special-regular">{h.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function StudioTour360({
  scenes,
  equipment = [],
  defaultSceneId,
}: {
  scenes: StudioTourScene[];
  equipment?: string[];
  defaultSceneId?: string;
}) {
  const t = useT();
  const normalized = useMemo(
    () => normalizeScenes(scenes, equipment, t('tour360.tapToLearnMore')),
    [scenes, equipment, t],
  );
  const initialIndex = Math.max(
    0,
    defaultSceneId ? normalized.findIndex((s) => s.id === defaultSceneId) : 0,
  );
  const [sceneIndex, setSceneIndex] = useState(initialIndex);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const scene = normalized[sceneIndex];
  const hotspots = scene?.hotspots ?? [];
  const selected = selectedHotspotId
    ? hotspots.find((h) => h.id === selectedHotspotId) ?? null
    : null;

  useEffect(() => {
    setSelectedHotspotId(null);
  }, [sceneIndex]);

  if (!scene) {
    return (
      <div className="lux-card lux-rect p-6">
        <h3 className="text-xl font-semibold text-white">{t('tour360.title')}</h3>
        <p className="text-gray-400 mt-2">
          {t('tour360.addPanorama')}
        </p>
      </div>
    );
  }

  const content = (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {normalized.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSceneIndex(idx)}
                className={
                  idx === sceneIndex
                    ? 'lux-btn-metal px-4 py-2 text-xs font-medium'
                    : 'lux-btn-ghost px-4 py-2 text-xs font-medium text-white/80'
                }
              >
                {s.title}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setFullscreen(true)}
            className="lux-btn-ghost px-3 py-2 text-xs font-medium"
            aria-label="Open virtual tour fullscreen"
          >
            <span className="inline-flex items-center gap-2">
              <FaExpand className="lux-icon-metal" />
              Fullscreen
            </span>
          </button>
        </div>

        <Viewer
          scene={scene}
          selectedId={selectedHotspotId}
          onSelect={(id) => setSelectedHotspotId(id)}
          heightClassName="h-[320px] sm:h-[420px]"
        />

        <div className="lux-card lux-rect p-4 bg-black/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-sm text-white font-semibold">Interactive setup</div>
              <div className="text-xs text-white/65 font-special-regular">
                Tap a hotspot or select an item below to learn about the gear in this room.
              </div>
            </div>
            <div className="text-xs text-white/60 font-special-regular">
              {hotspots.length} interactive points
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="lux-card lux-rect p-5">
          <h4 className="text-lg font-semibold text-white">Gear highlights</h4>
          <p className="text-gray-400 text-sm mt-1">
            Click an item to reveal details and highlight it in the tour.
          </p>

          <div className="mt-4 space-y-2">
            {hotspots.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setSelectedHotspotId(h.id)}
                className={[
                  'w-full text-left flex items-center justify-between gap-3',
                  'rounded-lg border px-3 py-2',
                  selectedHotspotId === h.id
                    ? 'border-[color:var(--lux-metal-gold)]/25 bg-white/5'
                    : 'border-white/10 bg-black/25 hover:bg-white/5',
                ].join(' ')}
              >
                <span className="text-sm text-white/85 font-special-regular">{h.label}</span>
                <span className="text-[11px] text-white/55">{t('tour360.view')}</span>
              </button>
            ))}

            {hotspots.length === 0 ? (
              <div className="text-sm text-white/60">{t('tour360.none')}</div>
            ) : null}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="lux-card lux-rect p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h5 className="text-lg font-semibold text-white">{selected.label}</h5>
                  <p className="text-gray-400 text-sm mt-1">
                    {selected.description ?? t('tour360.premiumGear')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedHotspotId(null)}
                  className="lux-btn-ghost p-2"
                  aria-label={t('tour360.closeGearDetails')}
                >
                  <FaTimes />
                </button>
              </div>

              {selected.tags && selected.tags.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selected.tags.map((t) => (
                    <span key={t} className="lux-chip border-white/10 bg-black/25 text-white/75">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedHotspotId(null)}
                  className="lux-btn-ghost px-4 py-2 text-xs font-medium"
                >
                  {t('common.close')}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lux-card lux-rect p-5"
            >
              <h5 className="text-lg font-semibold text-white">{t('tour360.tipTitle')}</h5>
              <p className="text-gray-400 text-sm mt-1">
                {t('tour360.tipBody')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {content}

      <AnimatePresence>
        {fullscreen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-md p-4 sm:p-8"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setFullscreen(false);
            }}
            role="dialog"
            aria-modal="true"
            aria-label={t('tour360.fullscreenAria')}
          >
            <div className="mx-auto max-w-6xl h-[calc(100dvh-2rem)] flex flex-col">
              <div className="flex items-center justify-between gap-3 pb-3">
                <div className="text-white font-semibold">{t('tour360.title')}</div>
                <button
                  type="button"
                  onClick={() => setFullscreen(false)}
                  className="lux-btn-ghost px-3 py-2 text-xs font-medium"
                >
                  <span className="inline-flex items-center gap-2">
                    <FaTimes />
                    {t('common.close')}
                  </span>
                </button>
              </div>

              <div className="lux-card lux-rect p-4 flex-1 min-h-0 overflow-hidden">
                <Viewer
                  scene={scene}
                  selectedId={selectedHotspotId}
                  onSelect={(id) => setSelectedHotspotId(id)}
                  heightClassName="h-full"
                />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
