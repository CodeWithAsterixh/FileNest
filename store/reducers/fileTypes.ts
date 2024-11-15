// types/file.ts

export interface FileIn {
  id: string; // Unique identifier for the file (could be a hash or UUID)
  name: string; // Name of the file
  size: number; // Size of the file in bytes
  type: string; // MIME type of the file (e.g., "image/jpeg", "application/pdf")
  encrypted?: boolean; // Whether the file is encrypted
  previewUrl?: string; // Optional URL for file preview (if applicable)
  lastModified?: number; // Timestamp of when the file was last modified
  content?: File | null;
}
