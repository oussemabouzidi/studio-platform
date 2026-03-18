"use client";

import type { UploadOptions, UploadResult } from "./types";

function envBool(value: string | undefined, fallback: boolean) {
  if (value == null) return fallback;
  return value === "true" || value === "1" || value === "yes";
}

function resolveBasePath(explicit?: string) {
  if (explicit) return explicit.replace(/\/+$/, "");
  const fromEnv = process.env.NEXT_PUBLIC_UPLOAD_API_BASE;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return "/api";
}

function xhrUpload<TResponse>({
  method,
  url,
  body,
  contentType,
  onProgress,
}: {
  method: "POST" | "PUT";
  url: string;
  body: XMLHttpRequestBodyInit | Document | null;
  contentType?: string;
  onProgress?: (percent: number) => void;
}): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    if (contentType) xhr.setRequestHeader("Content-Type", contentType);
    xhr.responseType = "json";

    xhr.upload.onprogress = (evt) => {
      if (!evt.lengthComputable) return;
      const percent = Math.round((evt.loaded / evt.total) * 100);
      onProgress?.(percent);
    };

    xhr.onload = () => {
      const status = xhr.status;
      const resp = xhr.response as any;
      if (status >= 200 && status < 300) {
        resolve(resp as TResponse);
        return;
      }
      reject(new Error(resp?.error || `Upload failed (HTTP ${status})`));
    };

    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(body);
  });
}

async function uploadMultipart(file: File, opts: UploadOptions): Promise<UploadResult> {
  const basePath = resolveBasePath(opts.basePath);
  const form = new FormData();
  form.append("file", file);

  return xhrUpload<UploadResult>({
    method: "POST",
    url: `${basePath}/upload`,
    body: form,
    onProgress: opts.onProgress,
  });
}

async function uploadPresigned(file: File, opts: UploadOptions): Promise<UploadResult> {
  const basePath = resolveBasePath(opts.basePath);
  if (!file.type) throw new Error("Missing file mime type");

  const presignRes = await fetch(`${basePath}/uploads/presign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
    }),
  });

  const presignBody = (await presignRes.json().catch(() => null)) as any;
  if (!presignRes.ok) {
    throw new Error(presignBody?.error || `Presign failed (HTTP ${presignRes.status})`);
  }

  if (!presignBody?.uploadUrl || !presignBody?.key || !presignBody?.publicUrl) {
    throw new Error("Invalid presign response");
  }

  const uploadUrl = String(presignBody.uploadUrl);
  const key = String(presignBody.key);
  const publicUrl = String(presignBody.publicUrl);

  await xhrUpload<unknown>({
    method: "PUT",
    url: uploadUrl,
    body: file,
    contentType: file.type,
    onProgress: opts.onProgress,
  });

  const confirmRes = await fetch(`${basePath}/uploads/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key,
      url: publicUrl,
      mimeType: file.type,
      size: file.size,
    }),
  });
  if (!confirmRes.ok) {
    const body = (await confirmRes.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || `Confirm failed (HTTP ${confirmRes.status})`);
  }

  return {
    url: publicUrl,
    key,
    provider: "s3",
    mimeType: file.type,
    size: file.size,
  };
}

export async function uploadMedia(file: File, opts: UploadOptions = {}): Promise<UploadResult> {
  const usePresigned =
    opts.usePresignedUploads ??
    envBool(process.env.NEXT_PUBLIC_USE_PRESIGNED_UPLOADS, false);

  if (usePresigned) {
    try {
      return await uploadPresigned(file, opts);
    } catch (err) {
      return await uploadMultipart(file, opts);
    }
  }

  return uploadMultipart(file, opts);
}
