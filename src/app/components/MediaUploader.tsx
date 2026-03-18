"use client";

import React, { useMemo, useRef, useState } from "react";

import type { UploadResult } from "@/app/lib/uploads/types";
import { uploadMedia } from "@/app/lib/uploads/uploadMedia";

type MediaUploaderProps = {
  value?: UploadResult | null;
  onUploaded: (media: UploadResult) => void;
  onClear?: () => void;
  accept?: string;
  label?: string;
  disabled?: boolean;
};

function Preview({ media }: { media: UploadResult }) {
  if (media.mimeType.startsWith("image/")) {
    return <img src={media.url} alt="Uploaded media" className="w-full max-h-64 object-contain rounded-xl" />;
  }
  if (media.mimeType.startsWith("audio/")) {
    return <audio controls src={media.url} className="w-full" />;
  }
  if (media.mimeType.startsWith("video/")) {
    return <video controls src={media.url} className="w-full max-h-64 rounded-xl" />;
  }
  return (
    <a className="text-purple-300 underline" href={media.url} target="_blank" rel="noreferrer">
      Open uploaded file
    </a>
  );
}

export default function MediaUploader({
  value,
  onUploaded,
  onClear,
  accept = "image/*,audio/*,video/*",
  label = "Upload media",
  disabled = false,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const canClear = !!value && !!onClear && !isUploading;

  const helpText = useMemo(() => {
    if (isUploading) return `Uploading… ${progress}%`;
    return "Drag & drop or click to choose a file (max 50MB).";
  }, [isUploading, progress]);

  async function handleFile(file: File) {
    setError(null);
    setIsUploading(true);
    setProgress(0);
    try {
      const result = await uploadMedia(file, { onProgress: setProgress });
      onUploaded(result);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div
        className={[
          "lux-card lux-rect p-4 border border-white/10 bg-black/20",
          isDragging ? "ring-2 ring-purple-500/60" : "",
          disabled || isUploading ? "opacity-60 pointer-events-none" : "cursor-pointer",
        ].join(" ")}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void handleFile(file);
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-white font-medium">{label}</div>
            <div className="text-sm text-gray-400">{helpText}</div>
            {error ? <div className="text-sm text-red-300 mt-2">{error}</div> : null}
          </div>
          {canClear ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear?.();
              }}
              className="lux-btn-ghost px-3 py-2 text-sm"
            >
              Remove
            </button>
          ) : null}
        </div>

        {isUploading ? (
          <div className="mt-3 w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-2 bg-purple-500" style={{ width: `${progress}%` }} />
          </div>
        ) : null}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
      </div>

      {value ? (
        <div className="lux-card lux-rect p-4 border border-white/10 bg-black/20">
          <div className="text-xs text-gray-400 mb-2">
            {value.provider} • {value.mimeType} • {(value.size / (1024 * 1024)).toFixed(2)} MB
          </div>
          <Preview media={value} />
        </div>
      ) : null}
    </div>
  );
}

