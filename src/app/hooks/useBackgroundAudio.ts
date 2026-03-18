"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type BackgroundAudioTrack = {
  name: string;
  sourceUrl: string;
  localPath: string; // e.g. "/audio/my-track.mp3"
  genre: string;
};

type Options = {
  tracks: BackgroundAudioTrack[];
  defaultVolume?: number; // 0..1
  storageNamespace?: string;
};

type State = {
  enabled: boolean;
  isPlaying: boolean;
  isPrimed: boolean;
  volume: number;
  trackIndex: number;
  currentTrack: BackgroundAudioTrack | null;
  error: string | null;
};

const DEFAULT_NAMESPACE = "lux_bg_audio";

function canUseDOM() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function prefersReducedMotion() {
  if (!canUseDOM()) return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function readBool(key: string, fallback: boolean) {
  if (!canUseDOM()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (raw == null) return fallback;
  return raw === "1" || raw === "true";
}

function readNumber(key: string, fallback: number) {
  if (!canUseDOM()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return n;
}

function write(key: string, value: string) {
  if (!canUseDOM()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function useBackgroundAudio({
  tracks,
  defaultVolume = 0.2,
  storageNamespace = DEFAULT_NAMESPACE,
}: Options) {
  const enabledKey = `${storageNamespace}:enabled`;
  const volumeKey = `${storageNamespace}:volume`;
  const trackKey = `${storageNamespace}:trackIndex`;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<{
    ctx: AudioContext;
    gain: GainNode;
    filter: BiquadFilterNode;
    osc1: OscillatorNode;
    osc2: OscillatorNode;
    lfo: OscillatorNode;
    lfoGain: GainNode;
  } | null>(null);
  const interactedRef = useRef(false);
  const primedRef = useRef(false);

  const [enabled, setEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPrimed, setIsPrimed] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);
  const [trackIndex, setTrackIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fallbackMode, setFallbackMode] = useState<"audio" | "synth">("audio");

  const currentTrack = useMemo(() => tracks[trackIndex] ?? null, [tracks, trackIndex]);

  // Load preferences
  useEffect(() => {
    if (!canUseDOM()) return;
    if (prefersReducedMotion()) {
      setEnabled(false);
      return;
    }

    const hasSaved = window.localStorage.getItem(enabledKey) != null;
    const initialEnabled = hasSaved ? readBool(enabledKey, true) : true;
    setEnabled(initialEnabled);
    setVolume(clamp01(readNumber(volumeKey, defaultVolume)));
    const savedTrackIndex = Math.floor(readNumber(trackKey, 0));
    if (savedTrackIndex >= 0 && savedTrackIndex < tracks.length) setTrackIndex(savedTrackIndex);
    else setTrackIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If tracks change (or config is edited), don't get stuck on an out-of-range saved index.
  useEffect(() => {
    if (tracks.length === 0) return;
    if (trackIndex < 0 || trackIndex >= tracks.length) setTrackIndex(0);
  }, [trackIndex, tracks.length]);

  // Persist preferences
  useEffect(() => write(enabledKey, enabled ? "1" : "0"), [enabled, enabledKey]);
  useEffect(() => write(volumeKey, String(volume)), [volume, volumeKey]);
  useEffect(() => write(trackKey, String(trackIndex)), [trackIndex, trackKey]);

  const ensureAudio = useCallback(() => {
    if (!canUseDOM()) return null;
    if (audioRef.current) return audioRef.current;
    const audio = new Audio();
    audio.preload = "none"; // lazy
    audio.loop = true;
    audio.setAttribute("playsinline", "true");
    audioRef.current = audio;
    return audio;
  }, []);

  const stopSynth = useCallback(() => {
    const synth = synthRef.current;
    if (!synth) return;

    try {
      synth.gain.gain.setTargetAtTime(0.0001, synth.ctx.currentTime, 0.03);
      synth.osc1.stop(synth.ctx.currentTime + 0.08);
      synth.osc2.stop(synth.ctx.currentTime + 0.08);
      synth.lfo.stop(synth.ctx.currentTime + 0.08);
    } catch {
      // ignore
    }

    const ctx = synth.ctx;
    synthRef.current = null;
    void ctx.close().catch(() => undefined);
  }, []);

  const startSynth = useCallback(async () => {
    stopSynth();
    if (!canUseDOM()) return;
    if (prefersReducedMotion()) return;

    const AudioContextCtor =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextCtor) throw new Error("AudioContext not supported.");

    const ctx: AudioContext = new AudioContextCtor();
    const gain = ctx.createGain();
    gain.gain.value = Math.max(0.0001, clamp01(volume) * 0.55);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 680;
    filter.Q.value = 0.9;

    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 110; // A2

    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = 220; // A3
    osc2.detune.value = -9;

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.18;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 70;

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    osc1.start();
    osc2.start();
    lfo.start();

    if (ctx.state !== "running") await ctx.resume();

    synthRef.current = { ctx, gain, filter, osc1, osc2, lfo, lfoGain };
    setFallbackMode("synth");
  }, [stopSynth, volume]);

  const applyTrack = useCallback(
    (audio: HTMLAudioElement) => {
      if (!currentTrack) return;
      if (audio.src.endsWith(currentTrack.localPath)) return;
      audio.src = currentTrack.localPath;
      audio.oncanplay = () => setError(null);
      audio.onerror = () =>
        setError(
          `Missing audio asset: ${currentTrack.localPath}. Add the file under /public${currentTrack.localPath}.`,
        );
      audio.load();
    },
    [currentTrack],
  );

  const primeMutedAutoplay = useCallback(async () => {
    if (!enabled) return;
    if (!currentTrack) return;
    if (!canUseDOM()) return;
    if (prefersReducedMotion()) return;
    if (primedRef.current) return;

    const audio = ensureAudio();
    if (!audio) return;

    applyTrack(audio);

    audio.muted = true;
    audio.volume = 0; // muted anyway, but keep explicit

    try {
      // Autoplay is usually allowed only if muted.
      await audio.play();
      primedRef.current = true;
      setIsPrimed(true);
      setIsPlaying(true);
    } catch {
      // Some browsers block even muted autoplay; we'll start on first interaction.
      primedRef.current = false;
      setIsPrimed(false);
      setIsPlaying(false);
    }
  }, [applyTrack, currentTrack, enabled, ensureAudio]);

  // Prime in idle time (avoid blocking initial paint)
  useEffect(() => {
    if (!canUseDOM()) return;
    const run = () => void primeMutedAutoplay();
    const idle = (window as any).requestIdleCallback?.(run, { timeout: 1200 });
    const t = idle ? null : window.setTimeout(run, 350);
    return () => {
      if (idle) (window as any).cancelIdleCallback?.(idle);
      if (t) window.clearTimeout(t);
    };
  }, [primeMutedAutoplay]);

  // Ensure we can start audio on first user gesture (iOS etc.)
  useEffect(() => {
    if (!canUseDOM()) return;

    const onFirstInteraction = async () => {
      interactedRef.current = true;
      if (!enabled) return;
      if (!currentTrack) return;

      const audio = ensureAudio();
      if (!audio) return;

      stopSynth();
      setFallbackMode("audio");
      applyTrack(audio);
      audio.loop = true;
      audio.muted = false;
      audio.volume = clamp01(volume);

      try {
        await audio.play();
        setIsPlaying(true);
      } catch (e: any) {
        const msg = e?.message || "Audio playback failed.";
        // Common when the referenced file is missing or not a supported codec.
        if (e?.name === "NotSupportedError" || msg.includes("supported sources")) {
          setError(
            currentTrack
              ? `Audio file can't be played: ${currentTrack.localPath}. Add a valid MP3 under /public${currentTrack.localPath} (or change the track config).`
              : "Audio file can't be played. Check your track config.",
          );
          try {
            await startSynth();
            setIsPlaying(true);
          } catch {
            // keep error
          }
          return;
        }

        setError(msg);
      }
    };

    const opts: AddEventListenerOptions = { passive: true, once: true };
    window.addEventListener("pointerdown", onFirstInteraction, opts);
    window.addEventListener("keydown", onFirstInteraction, opts);
    window.addEventListener("touchstart", onFirstInteraction, opts);

    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };
  }, [applyTrack, currentTrack, enabled, ensureAudio, volume]);

  // Keep volume updated (if currently unmuted)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.muted) return;
    audio.volume = clamp01(volume);
  }, [volume]);

  useEffect(() => {
    const synth = synthRef.current;
    if (!synth) return;
    try {
      synth.gain.gain.setTargetAtTime(
        Math.max(0.0001, clamp01(volume) * 0.55),
        synth.ctx.currentTime,
        0.04,
      );
    } catch {
      // ignore
    }
  }, [volume]);

  // When switching tracks while playing, keep playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    const wasPlaying = !audio.paused;
    applyTrack(audio);
    if (enabled && wasPlaying) {
      void audio.play().catch(() => null);
    }
  }, [applyTrack, currentTrack, enabled]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.pause();
    } catch {
      // ignore
    }
    setIsPlaying(false);
  }, []);

  const start = useCallback(async () => {
    if (!currentTrack) return;
    const audio = ensureAudio();
    if (!audio) return;
    applyTrack(audio);
    audio.loop = true;
    audio.muted = !interactedRef.current;
    audio.volume = audio.muted ? 0 : clamp01(volume);

    try {
      stopSynth();
      setFallbackMode("audio");
      await audio.play();
      setIsPlaying(true);
      setIsPrimed(true);
    } catch (e: any) {
      // Muted autoplay can be blocked on some browsers; don't treat it as an error
      // until we have a real user interaction.
      if (!interactedRef.current) {
        setIsPlaying(false);
        return;
      }
      const msg = e?.message || "Audio playback failed.";
      if (e?.name === "NotSupportedError" || msg.includes("supported sources")) {
        setError(
          `Audio file can't be played: ${currentTrack.localPath}. Add a valid MP3 under /public${currentTrack.localPath} (or change the track config).`,
        );
        try {
          await startSynth();
          setIsPlaying(true);
          setIsPrimed(true);
          return;
        } catch {
          // keep error
        }
      } else {
        setError(msg);
      }
      setIsPlaying(false);
    }
  }, [applyTrack, currentTrack, ensureAudio, startSynth, stopSynth, volume]);

  const toggle = useCallback(async () => {
    setError(null);
    setEnabled((prev) => !prev);
  }, []);

  // React to enabled changes (start/stop)
  useEffect(() => {
    if (!canUseDOM()) return;
    if (!enabled) {
      stop();
      stopSynth();
      return;
    }
    void start();
  }, [enabled, start, stop, stopSynth]);

  const nextTrack = useCallback(() => {
    if (tracks.length === 0) return;
    setTrackIndex((i) => (i + 1) % tracks.length);
  }, [tracks.length]);

  const prevTrack = useCallback(() => {
    if (tracks.length === 0) return;
    setTrackIndex((i) => (i - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

  const state: State = {
    enabled,
    isPlaying,
    isPrimed,
    volume,
    trackIndex,
    currentTrack,
    error,
  };

  return {
    state,
    setEnabled,
    setVolume: (v: number) => setVolume(clamp01(v)),
    setTrackIndex,
    toggle,
    nextTrack,
    prevTrack,
  };
}
