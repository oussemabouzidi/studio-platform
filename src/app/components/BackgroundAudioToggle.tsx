"use client";

import { audioTracks } from "@/app/config/audioTracks";
import { useBackgroundAudio } from "@/app/hooks/useBackgroundAudio";

function MusicIcon() {
  return (
    <span className="relative inline-flex items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
        fill="none"
      >
        <path
          d="M10 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M18 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M12 18V6l8-2v12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 10l8-2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none">
      <path
        d="M10 8.25v7.5a.75.75 0 0 0 1.2.6l6-3.75a.75.75 0 0 0 0-1.2l-6-3.75a.75.75 0 0 0-1.2.6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none">
      <path
        d="M9 7v10M15 7v10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NextTrackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none">
      <path
        d="M6 7l8 5-8 5V7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14 7l8 5-8 5V7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BackgroundAudioToggle() {
  const { state, toggle, nextTrack } = useBackgroundAudio({
    tracks: audioTracks,
    defaultVolume: 0.2,
    storageNamespace: "home_bg_audio",
  });

  const label = state.enabled ? "Music on" : "Music off";
  const hasMultipleTracks = audioTracks.length > 1;
  const trackName = state.currentTrack?.name ?? "Background music";
  const isOn = state.enabled;

  return (
    <div className="fixed z-[70] right-[calc(1.25rem+env(safe-area-inset-right))] bottom-[calc(4.75rem+env(safe-area-inset-bottom))]">
      <div className="rounded-full bg-black/55 backdrop-blur-xl border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.55)] overflow-hidden">
        <div className="flex items-center gap-2 px-2 py-2">
          <button
            type="button"
            onClick={() => void toggle()}
            className={`h-10 w-10 rounded-full grid place-items-center transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black/60 motion-reduce:transition-none ${
              isOn
                ? "bg-[#1DB954]/90 hover:bg-[#1DB954] text-black shadow-[0_0_0_1px_rgba(29,185,84,0.35),0_0_26px_rgba(29,185,84,0.22)] focus-visible:ring-[#1DB954]/80"
                : "bg-white/10 hover:bg-white/15 text-white/90 shadow-[0_0_0_1px_rgba(255,255,255,0.10)] focus-visible:ring-purple-400/70"
            }`}
            aria-label={label}
            aria-pressed={isOn}
            title={isOn ? `Pause • ${trackName}` : `Play • ${trackName}`}
          >
            <span className="sr-only">{label}</span>
            <span aria-hidden="true">{isOn ? <PauseIcon /> : <PlayIcon />}</span>
          </button>

          <div className="min-w-0 px-1">
            <div className="flex items-center gap-2">
              <span className="text-white/70">
                <MusicIcon />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/45 font-special-regular">
                  Background
                </div>
                <div className="text-sm font-medium text-white/85 truncate max-w-[180px] sm:max-w-[240px] font-special">
                  {trackName}
                </div>
              </div>
              <span
                aria-hidden="true"
                className={`lux-eq ${isOn && state.isPlaying ? "is-on" : ""}`}
              >
                <span />
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>

          {hasMultipleTracks ? (
            <button
              type="button"
              onClick={() => nextTrack()}
              disabled={!isOn}
              className="h-10 w-10 rounded-full grid place-items-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/85 transition-all duration-300 ease-out disabled:opacity-40 disabled:hover:bg-white/5 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/60 motion-reduce:transition-none"
              aria-label="Next background track"
              title={isOn ? `Next • ${trackName}` : "Turn music on to change tracks"}
            >
              <span className="sr-only">Next background track</span>
              <span aria-hidden="true">
                <NextTrackIcon />
              </span>
            </button>
          ) : null}
        </div>

        <div className="h-[3px] bg-white/10">
          <div
            className={`h-full w-[58%] bg-gradient-to-r from-[#1DB954] via-purple-400 to-[#FF5500] ${
              isOn && state.isPlaying ? "animate-gradient" : ""
            }`}
          />
        </div>
      </div>
      {state.error ? (
        <div className="mt-2 max-w-[260px] text-xs text-red-200/90 bg-red-950/40 border border-red-500/20 rounded-xl px-3 py-2 backdrop-blur">
          {state.error}
        </div>
      ) : null}
    </div>
  );
}
