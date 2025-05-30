import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine multiple class names with Tailwind merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date as a localized string
 */
export function formatDate(date: Date | string, locale = "vi-VN") {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale);
}

/**
 * Format currency value
 */
export function formatCurrency(
  value: number,
  locale = "vi-VN",
  currency = "VND"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Truncate a string to a maximum length with ellipsis
 */
export function truncateString(str: string, maxLength: number) {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

/**
 * Generate a range of numbers
 */
export function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Sleep/delay for a specified duration
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if an element is in view
 */
export function isElementInView(el: HTMLElement) {
  if (!el) return false;

  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() || "";
}

/**
 * Check if a file is an image by its extension
 */
export function isImageFile(filename: string) {
  const ext = getFileExtension(filename);
  return ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(ext);
}

/**
 * Check if a file is a PDF
 */
export function isPdfFile(filename: string) {
  return getFileExtension(filename) === "pdf";
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
