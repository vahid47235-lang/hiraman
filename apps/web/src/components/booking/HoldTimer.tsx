'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  expiresAt: string
  locale: string
  onExpire?: () => void
}

export default function HoldTimer({ expiresAt, locale, onExpire }: Props) {
  const isFa = locale === 'fa'
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    const update = () => {
      const secs = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
      setRemaining(secs)
      if (secs === 0) onExpire?.()
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [expiresAt, onExpire])

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const urgent = remaining < 120

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        isFa && 'flex-row-reverse',
        urgent
          ? 'bg-natural-clay/10 text-natural-clay border border-natural-clay/20'
          : 'bg-forest-moss/10 text-forest-moss border border-forest-moss/20',
      )}
      role="timer"
      aria-live="polite"
      aria-label={isFa ? `زمان باقی‌مانده برای رزرو` : `Time remaining to complete booking`}
    >
      <Clock size={14} className="flex-shrink-0" />
      <span>
        {isFa ? 'زمان نگه‌داری: ' : 'Hold expires in: '}
      </span>
      <span className="num tabular-nums" dir="ltr">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
    </div>
  )
}
