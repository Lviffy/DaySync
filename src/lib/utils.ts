import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and optimizes them with tailwind-merge
 * This function is used throughout the application for conditional class application
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
