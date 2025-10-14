import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type DateStyle = Intl.DateTimeFormatOptions["dateStyle"];

interface DateFormatOptions {
  dateStyle?: DateStyle;
  timeStyle?: Intl.DateTimeFormatOptions["timeStyle"];
  locales?: string | string[];
  timeZone?: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "";
  const nameParts = name.trim().split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  const firstInitial = nameParts[0].charAt(0).toUpperCase();
  const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
  return firstInitial + lastInitial;
}

export function timeAgo(date: Date): string {
  const now = new Date().getTime();
  const past = date.getTime();
  const seconds = Math.floor((now - past) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return interval === 1 ? "1 year ago" : `${interval} years ago`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? "1 month ago" : `${interval} months ago`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? "1 day ago" : `${interval} days ago`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
  }
  return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
}

export function timeAgoShort(date: Date): string {
  const now = new Date().getTime();
  const past = date.getTime();
  const seconds = Math.floor((now - past) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return interval === 1 ? "1y" : `${interval}y`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? "1mo" : `${interval}mo`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? "1d" : `${interval}d`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? "1h" : `${interval}h`;
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? "1m" : `${interval}m`;
  }
  return seconds === 1 ? "1s" : `${seconds}s`;
}

export function formatDate(
  date: string | Date,
  options: DateFormatOptions = {},
) {
  try {
    const {
      dateStyle = "medium",
      timeStyle,
      locales = "en",
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
    } = options;

    const dateToFormat =
      date instanceof Date ? date : new Date(date.replaceAll("-", "/"));

    if (isNaN(dateToFormat.getTime())) {
      throw new Error(`Invalid date: ${date}`);
    }

    const formatOptions: Intl.DateTimeFormatOptions = {
      dateStyle,
      ...(timeStyle && { timeStyle }),
      timeZone,
    };

    return new Intl.DateTimeFormat(locales, formatOptions).format(dateToFormat);
  } catch {
    return new Date(date).toLocaleDateString();
  }
}

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxFileSize?: number;
}

export interface ProcessedImageResult {
  file: File;
  url: string;
  width: number;
  height: number;
  size: number;
}

export async function resizeAndCompressImage(
  file: File,
  options: ImageProcessingOptions = {},
): Promise<ProcessedImageResult> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    maxFileSize = 5 * 1024 * 1024, // 5MB
  } = options;

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  // Create image element to get dimensions
  const img = new Image();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  return new Promise((resolve, reject) => {
    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > height) {
          width = maxWidth;
          height = width / aspectRatio;
        } else {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob with compression
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not compress image"));
            return;
          }

          // Check if file size is still too large
          if (blob.size > maxFileSize) {
            // Try with lower quality
            canvas.toBlob(
              (lowerQualityBlob) => {
                if (!lowerQualityBlob) {
                  reject(
                    new Error("Could not compress image to required size"),
                  );
                  return;
                }
                const processedFile = new File([lowerQualityBlob], file.name, {
                  type: lowerQualityBlob.type,
                  lastModified: Date.now(),
                });
                resolve({
                  file: processedFile,
                  url: URL.createObjectURL(processedFile),
                  width,
                  height,
                  size: processedFile.size,
                });
              },
              "image/jpeg",
              0.6,
            );
          } else {
            const processedFile = new File([blob], file.name, {
              type: blob.type,
              lastModified: Date.now(),
            });
            resolve({
              file: processedFile,
              url: URL.createObjectURL(processedFile),
              width,
              height,
              size: processedFile.size,
            });
          }
        },
        "image/jpeg",
        quality,
      );
    };

    img.onerror = () => reject(new Error("Could not load image"));
    img.src = URL.createObjectURL(file);
  });
}

export function validateFile(
  file: File,
  options: {
    allowedTypes?: string[];
    maxSize?: number;
    maxWidth?: number;
    maxHeight?: number;
  } = {},
): { valid: boolean; error?: string } {
  const {
    allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
    maxSize = 10 * 1024 * 1024, // 10MB
    maxWidth = 5000,
    maxHeight = 5000,
  } = options;

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum size of ${(maxSize / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  // For images, we could validate dimensions here if needed
  // This would require loading the image first, which we do in the processing step
  // So we'll skip dimension validation here to avoid duplicate work

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Re-export bits-ui types for convenience
export type {
  WithElementRef,
  WithoutChild,
  WithoutChildren,
  WithoutChildrenOrChild,
} from "bits-ui";
