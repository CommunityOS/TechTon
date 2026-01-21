import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getCapitalizedMonth(date, locale = 'es-ES') {
  const month = date.toLocaleString(locale, { month: 'long' });
  return month.charAt(0).toUpperCase() + month.slice(1);
}
