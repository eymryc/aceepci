import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge.
 * Use this for conditional or composed classNames in components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
