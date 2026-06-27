'use client'

/**
 * Privacy-conscious analytics.
 * Replace with your preferred provider (Plausible, PostHog, etc.).
 * Never send PII or guest data to analytics services.
 */
export function Analytics() {
  // Placeholder — implement with provider that respects consent
  return null
}

/**
 * Track a user interaction event.
 * Call this for: searches, booking steps, experience clicks, etc.
 */
export function track(event: string, properties?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return
  if (localStorage.getItem('hiraban_cookie_consent') !== 'accepted') return

  // Replace with your analytics provider's event API
  if (process.env.NODE_ENV === 'development') {
    console.debug('[analytics]', event, properties)
  }
}
