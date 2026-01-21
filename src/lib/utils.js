import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const CHILE_TZ = "America/Santiago";
const LOCALE_NUMERIC = "und-u-nu-latn";


function normalizeDateOnlyToUTCNoon(date) {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      12,
      0,
      0
    )
  );
}

function getChileParts(date) {
  const parts = new Intl.DateTimeFormat(LOCALE_NUMERIC, {
    timeZone: CHILE_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type)?.value;
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
  };
}

export function formatDateChile(
  date,
  options = { day: "2-digit", month: "2-digit", year: "numeric" },
  locale = "es-CL"
) {
  return new Intl.DateTimeFormat(locale, { timeZone: CHILE_TZ, ...options }).format(date);
}


export function formatDateChileDateOnly(
  date,
  options = { day: "2-digit", month: "2-digit", year: "numeric" },
  locale = "es-CL"
) {
  return new Intl.DateTimeFormat(locale, { timeZone: CHILE_TZ, ...options }).format(
    normalizeDateOnlyToUTCNoon(date)
  );
}

export function getChileDayOfMonth(date) {
  return getChileParts(date).day;
}

export function getChileYear(date) {
  return getChileParts(date).year;
}

export function getChileDayOfMonthDateOnly(date) {
  return getChileParts(normalizeDateOnlyToUTCNoon(date)).day;
}

export function getChileYearDateOnly(date) {
  return getChileParts(normalizeDateOnlyToUTCNoon(date)).year;
}

export function getCapitalizedMonth(date, locale = "es-CL") {
  const month = new Intl.DateTimeFormat(locale, { timeZone: CHILE_TZ, month: "long" }).format(date);
  return month.charAt(0).toUpperCase() + month.slice(1);
}

export function getCapitalizedMonthDateOnly(date, locale = "es-CL") {
  const month = new Intl.DateTimeFormat(locale, { timeZone: CHILE_TZ, month: "long" }).format(
    normalizeDateOnlyToUTCNoon(date)
  );
  return month.charAt(0).toUpperCase() + month.slice(1);
}
