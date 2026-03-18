export type StorageProvider = "local" | "s3";

export type UploadResult = {
  url: string;
  key: string;
  provider: StorageProvider;
  mimeType: string;
  size: number;
};

export type UploadOptions = {
  basePath?: string;
  usePresignedUploads?: boolean;
  onProgress?: (percent: number) => void;
};

