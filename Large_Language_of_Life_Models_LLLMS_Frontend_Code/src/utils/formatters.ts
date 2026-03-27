import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges tailwind classes using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number with specified decimals
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Formats a percentage value
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${formatNumber(value * 100, decimals)}%`
}

/**
 * Returns the scientific color for a given score/status
 */
export function getScientificColor(type: 'blue' | 'green' | 'amber' | 'red' | 'gray' | 'purple' | 'teal'): string {
  const colors = {
    blue: '#2563EB',
    green: '#16A34A',
    amber: '#D97706',
    red: '#DC2626',
    gray: '#6B7280',
    purple: '#7C3AED',
    teal: '#0D9488',
  }
  return colors[type]
}
