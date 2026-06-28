'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = { locale: string }

export default function CookieConsent({ locale }: Props) {
  const isFa = locale === 'fa'
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('lootka_cookie_consent')
    if (!consent) setShow(true)
  }, [])

  const accept = () => {
    localStorage.setItem('lootka_cookie_consent', 'accepted')
    setShow(false)
  }

  const decline = () => {
    localStorage.setItem('lootka_cookie_consent', 'declined')
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={isFa ? 'رضایت کوکی' : 'Cookie consent'}
      className={cn(
        'fixed bottom-0 inset-x-0 z-[150] p-4',
        'sm:bottom-4 sm:start-4 sm:end-auto sm:max-w-sm',
      )}
    >
      <div className="glass-light rounded-xl shadow-xl p-5">
        <p className={cn('text-body-sm text-white mb-4', isFa && 'text-end')}>
          {isFa
            ? 'لوتکا از کوکی‌ها برای بهبود تجربه شما و تحلیل ترافیک استفاده می‌کند.'
            : 'Lootka uses cookies to improve your experience and analyse traffic.'}
          {' '}
          <Link
            href={`/${locale}/legal/cookies`}
            className="text-lootka-pine hover:text-aged-brass underline"
          >
            {isFa ? 'اطلاعات بیشتر' : 'Learn more'}
          </Link>
        </p>
        <div className={cn('flex gap-2', isFa && 'flex-row-reverse')}>
          <button
            onClick={accept}
            className="btn btn-primary btn-sm flex-1"
          >
            {isFa ? 'قبول' : 'Accept'}
          </button>
          <button
            onClick={decline}
            className="btn btn-outline-dark btn-sm flex-1"
          >
            {isFa ? 'رد' : 'Decline'}
          </button>
        </div>
      </div>
    </div>
  )
}
