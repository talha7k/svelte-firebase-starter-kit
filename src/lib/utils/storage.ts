import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import type { FirebaseApp } from "firebase/app";

export interface UploadOptions {
  firebaseApp: FirebaseApp;
  path: string;
  metadata?: {
    contentType?: string;
    customMetadata?: Record<string, string>;
  };
}

export interface UploadResult {
  url: string;
  path: string;
  name: string;
  size: number;
  type: string;
  metadata?: any;
}

export interface UploadProgress {
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
  state: "running" | "paused" | "success" | "error" | "canceled";
}

export async function uploadFile(
  file: File,
  options: UploadOptions,
  onProgress?: (progress: UploadProgress) => void,
): Promise<UploadResult> {
  const { firebaseApp, path, metadata } = options;
  const storage = getStorage(firebaseApp);
  const storageRef = ref(storage, path);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress: UploadProgress = {
          progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          bytesTransferred: snapshot.bytesTransferred,
          totalBytes: snapshot.totalBytes,
          state: snapshot.state as UploadProgress["state"],
        };
        onProgress?.(progress);
      },
      (error) => {
        reject(new Error(`Upload failed: ${error.message}`));
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url: downloadURL,
            path: uploadTask.snapshot.ref.fullPath,
            name: file.name,
            size: file.size,
            type: file.type,
            metadata: uploadTask.snapshot.metadata,
          });
        } catch (error) {
          reject(
            new Error(
              `Failed to get download URL: ${error instanceof Error ? error.message : "Unknown error"}`,
            ),
          );
        }
      },
    );
  });
}

export async function uploadMultipleFiles(
  files: File[],
  options: Omit<UploadOptions, "path"> & { basePath: string },
  onProgress?: (fileName: string, progress: UploadProgress) => void,
): Promise<UploadResult[]> {
  const { firebaseApp, basePath, metadata } = options;
  const results: UploadResult[] = [];

  for (const file of files) {
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2)}_${file.name}`;
    const filePath = `${basePath}/${uniqueFileName}`;

    try {
      const result = await uploadFile(
        file,
        {
          firebaseApp,
          path: filePath,
          metadata,
        },
        (progress) => onProgress?.(file.name, progress),
      );
      results.push(result);
    } catch (error) {
      throw new Error(
        `Failed to upload ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  return results;
}

export async function deleteFile(
  path: string,
  firebaseApp: FirebaseApp,
): Promise<void> {
  const storage = getStorage(firebaseApp);
  const storageRef = ref(storage, path);

  try {
    await deleteObject(storageRef);
  } catch (error) {
    throw new Error(
      `Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function deleteMultipleFiles(
  paths: string[],
  firebaseApp: FirebaseApp,
): Promise<void> {
  const deletePromises = paths.map((path) => deleteFile(path, firebaseApp));
  await Promise.all(deletePromises);
}

export function generateUploadPath(basePath: string, fileName: string): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2);
  const extension = fileName.split(".").pop();
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");

  return `${basePath}/${timestamp}_${randomId}_${nameWithoutExtension}.${extension}`;
}

export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

export function isImageFile(fileName: string): boolean {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
  return imageExtensions.includes(getFileExtension(fileName));
}

export function isVideoFile(fileName: string): boolean {
  const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"];
  return videoExtensions.includes(getFileExtension(fileName));
}

export function isDocumentFile(fileName: string): boolean {
  const documentExtensions = ["pdf", "doc", "docx", "txt", "rtf", "odt"];
  return documentExtensions.includes(getFileExtension(fileName));
}
