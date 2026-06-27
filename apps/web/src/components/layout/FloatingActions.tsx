'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, MessageCircle, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = { locale: string }

export default function FloatingActions({ locale }: Props) {
  const isFa = locale === 'fa'
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 200)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!visible) return null

  return (
    <div
      className={cn(
        'fixed bottom-6 z-[90] flex flex-col gap-2 items-end',
        isFa ? 'left-4' : 'right-4',
      )}
      role="complementary"
      aria-label={isFa ? 'دکمه‌های تماس سریع' : 'Quick contact actions'}
    >
      {/* Reserve CTA — only on mobile */}
      <Link
        href={`/${locale}/reserve`}
        className={cn(
          'sm:hidden btn btn-primary flex items-center gap-2 shadow-xl animate-slide-in-bottom',
          'text-sm px-4 py-2.5',
        )}
        aria-label={isFa ? 'رزرو سریع' : 'Quick reserve'}
      >
        <Calendar size={15} />
        {isFa ? 'رزرو' : 'Reserve'}
      </Link>

      {/* WhatsApp */}
      <a
        href="https://wa.me/989125584407"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
        aria-label={isFa ? 'پیام واتس‌اپ به هیرابان' : 'WhatsApp Hiraban'}
      >
        <MessageCircle size={20} />
      </a>

      {/* Phone */}
      <a
        href="tel:+989125584407"
        className="w-12 h-12 bg-hiraban-pine text-warm-ivory rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
        aria-label={isFa ? 'تماس تلفنی با هیرابان: شماره 989125584407' : 'Call Hiraban: +989125584407'}
      >
        <Phone size={18} />
      </a>
    </div>
  )
}
