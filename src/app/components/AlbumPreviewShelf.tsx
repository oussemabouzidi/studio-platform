'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { FaPause, FaPlay } from 'react-icons/fa';

type Track = {
  id: string;
  title: string;
  artist: string;
  cover: string;
  startSeconds: number;
  accent: 'purple' | 'blue';
};

const PREVIEW_SECONDS = 15;
const MEDIA_SRC = '/vedio/recording.mp4';

export default function AlbumPreviewShelf() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopTimerRef = useRef<number | null>(null);

  const tracks = useMemo<Track[]>(
    () => [
      {
        id: 'noir-take',
        title: 'Noir Take',
        artist: 'Session Ensemble',
        cover: '/home/background_badge.png',
        startSeconds: 0,
        accent: 'purple',
      },
      {
        id: 'neon-room',
        title: 'Neon Room',
        artist: 'Midnight Engineer',
        cover: '/studio/cover.jpg',
        startSeconds: 15,
        accent: 'blue',
      },
      {
        id: 'blueprint',
        title: 'Blueprint',
        artist: 'Analog Club',
        cover: '/studio/cover2.jpg',
        startSeconds: 30,
        accent: 'purple',
      },
      {
        id: 'afterhours',
        title: 'Afterhours',
        artist: 'Violet Signal',
        cover: '/studio/cover.jpg',
        startSeconds: 45,
        accent: 'blue',
      },
    ],
    [],
  );

  const [unlocked, setUnlocked] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const clearStopTimer = () => {
    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    stopTimerRef.current = null;
  };

  const ensureMediaReady = async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    if (!audio.src) {
      audio.src = MEDIA_SRC;
      audio.preload = 'metadata';
      audio.load();
    }
    if (audio.readyState >= 1) return true;
    await new Promise<void>((resolve) => {
      const onMeta = () => {
        audio.removeEventListener('loadedmetadata', onMeta);
        resolve();
      };
      audio.addEventListener('loadedmetadata', onMeta);
    });
    return true;
  };

  const playPreview = async (track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!unlocked) setUnlocked(true);
    clearStopTimer();

    try {
      const ok = await ensureMediaReady();
      if (!ok) return;

      setActiveId(track.id);
      setProgress(0);
      audio.currentTime = Math.max(0, track.startSeconds);
      await audio.play();

      stopTimerRef.current = window.setTimeout(() => {
        audio.pause();
      }, PREVIEW_SECONDS * 1000);
    } catch {
      // Ignore playback errors (autoplay policies, etc.).
    }
  };

  const toggle = async (track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (activeId !== track.id || audio.paused) {
      await playPreview(track);
      return;
    }

    audio.pause();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime = () => {
      const active = tracks.find((t) => t.id === activeId);
      if (!active) return;
      const elapsed = Math.max(0, audio.currentTime - active.startSeconds);
      const p = Math.min(1, elapsed / PREVIEW_SECONDS);
      setProgress(p);
    };
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTime);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTime);
    };
  }, [activeId, tracks]);

  useEffect(() => {
    return () => {
      clearStopTimer();
    };
  }, []);

  return (
    <section className="relative" data-reveal>
      <audio ref={audioRef} preload="none" />

      <div className="lux-card overflow-hidden p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[11px] tracking-[0.24em] text-white/70 backdrop-blur font-special-regular">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_18px_rgba(126,34,206,0.55)]" />
              ALBUM PREVIEWS
            </div>
            <h2 className="mt-5 text-3xl md:text-4xl font-semibold font-special">
              Swipe. Tap. Feel the room.
            </h2>
            <p className="mt-3 max-w-2xl text-sm md:text-base text-white/70 font-special-regular">
              {unlocked
                ? `Tap a card to play a ${PREVIEW_SECONDS}s clip.`
                : `Tap any card to unlock quick ${PREVIEW_SECONDS}s previews.`}
            </p>
          </div>
          <div className="text-xs text-white/60 font-special-regular">
            <span className="lux-chip border-white/10 bg-black/30">Cinematic</span>{' '}
            <span className="lux-chip border-white/10 bg-black/30">Fast</span>{' '}
            <span className="lux-chip border-white/10 bg-black/30">No clutter</span>
          </div>
        </div>

        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tracks.map((track) => {
            const isActive = activeId === track.id;
            const barWidth = isActive && isPlaying ? `${Math.round(progress * 100)}%` : '0%';
            const accent =
              track.accent === 'purple'
                ? 'shadow-[0_0_0_1px_rgba(126,34,206,0.25),0_26px_90px_rgba(0,0,0,0.55)]'
                : 'shadow-[0_0_0_1px_rgba(37,99,235,0.22),0_26px_90px_rgba(0,0,0,0.55)]';

            return (
              <button
                key={track.id}
                type="button"
                onClick={() => toggle(track)}
                className={[
                  'group relative w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left',
                  'transition-transform duration-300 ease-out hover:-translate-y-0.5',
                  isActive ? accent : 'shadow-[0_14px_38px_rgba(0,0,0,0.45)]',
                ].join(' ')}
              >
                <div className="relative h-40">
                  <Image
                    src={track.cover}
                    alt={`${track.title} cover`}
                    fill
                    sizes="280px"
                    className="object-cover lux-media-bw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/40 px-3 py-1.5 text-xs text-white/80 backdrop-blur">
                    <span
                      className={
                        track.accent === 'purple'
                          ? 'h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_16px_rgba(126,34,206,0.7)]'
                          : 'h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_16px_rgba(37,99,235,0.6)]'
                      }
                    />
                    <span className="font-special-regular tracking-wide">
                      {isActive && isPlaying ? 'PLAYING' : 'PREVIEW'}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-lg font-semibold text-white font-special truncate">
                        {track.title}
                      </div>
                      <div className="mt-1 text-sm text-white/65 font-special-regular truncate">
                        {track.artist}
                      </div>
                    </div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/40 text-white/90 shadow-[0_0_0_1px_rgba(214,178,106,0.12)] transition-transform duration-300 ease-out group-hover:scale-[1.03]">
                      {isActive && isPlaying ? <FaPause /> : <FaPlay />}
                    </span>
                  </div>

                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[color:var(--lux-metal-platinum)] via-[color:var(--lux-metal-gold)] to-[color:var(--lux-metal-silver)] shadow-[0_0_18px_rgba(214,178,106,0.16)] transition-[width] duration-150 ease-linear"
                      style={{ width: barWidth }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-white/55 font-special-regular">
                    <span>Clip: {PREVIEW_SECONDS}s</span>
                    <span className="tracking-[0.2em]">TAP</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
