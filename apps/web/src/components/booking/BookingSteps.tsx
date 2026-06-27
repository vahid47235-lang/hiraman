'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BookingStep } from '@/store/booking'

type Props = {
  current: BookingStep
  locale: string
}

const STEPS = {
  fa: ['جستجو', 'اقامتگاه', 'خدمات', 'اطلاعات', 'تأیید'],
  en: ['Search', 'Stay', 'Add-ons', 'Details', 'Confirm'],
}

export default function BookingSteps({ current, locale }: Props) {
  const isFa = locale === 'fa'
  const labels = isFa ? STEPS.fa : STEPS.en

  return (
    <nav
      aria-label={isFa ? 'مراحل رزرو' : 'Booking steps'}
      className="relative"
    >
      {/* Progress line */}
      <div className="absolute top-4 inset-x-0 h-px bg-stone" aria-hidden="true">
        <div
          className="h-full bg-aged-brass transition-all duration-500"
          style={{ width: `${((current - 1) / 4) * 100}%` }}
        />
      </div>

      <ol className={cn('relative flex justify-between', isFa && 'flex-row-reverse')}>
        {labels.map((label, i) => {
          const stepNum = (i + 1) as BookingStep
          const done = current > stepNum
          const active = current === stepNum

          return (
            <li key={label} className="flex flex-col items-center gap-2">
              {/* Circle */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300 z-10',
                  done
                    ? 'bg-aged-brass border-aged-brass text-deep-forest'
                    : active
                      ? 'bg-white border-aged-brass text-aged-brass'
                      : 'bg-white border-stone text-warm-gray',
                )}
                aria-current={active ? 'step' : undefined}
              >
                {done ? <Check size={14} strokeWidth={2.5} /> : <span className="num" dir="ltr">{stepNum}</span>}
              </div>

              {/* Label — hidden on very small screens */}
              <span
                className={cn(
                  'hidden sm:block text-caption whitespace-nowrap transition-colors duration-200',
                  active ? 'text-charcoal font-medium' : done ? 'text-forest-moss' : 'text-warm-gray',
                )}
              >
                {label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
