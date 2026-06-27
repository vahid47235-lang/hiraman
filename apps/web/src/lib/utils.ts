import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  amount: number,
  currency: 'IRR' | 'USD' = 'IRR',
  locale: string = 'fa',
): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: currency === 'USD' ? 'currency' : 'decimal',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)

  if (currency === 'IRR') {
    return locale === 'fa' ? `${formatted} تومان` : `${formatted} IRT`
  }
  return formatted
}

/**
 * Always format numbers as Western (0-9) regardless of locale.
 * This is a hard requirement for HIRABAN — no Eastern Arabic numerals.
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

export function formatDate(
  date: Date | string,
  locale: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR-u-nu-latn' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(d)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w؀-ۿ-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trimEnd() + '…'
}

export function getLocaleHref(
  path: string,
  currentLocale: string,
  targetLocale: string,
): string {
  const withoutLocale = path.replace(/^\/(fa|en)/, '')
  return `/${targetLocale}${withoutLocale || '/'}`
}
