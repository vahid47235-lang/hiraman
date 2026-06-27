'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Calendar, Users, Waves, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

type SearchState = {
  checkIn: Date | null
  checkOut: Date | null
  adults: number
  children: number
  childrenAges: number[]
  privatePool: boolean
}

type Props = {
  locale: string
  className?: string
  compact?: boolean
}

export default function AvailabilitySearch({ locale, className, compact = false }: Props) {
  const t = useTranslations('search')
  const router = useRouter()
  const isFa = locale === 'fa'

  const [state, setState] = useState<SearchState>({
    checkIn: null,
    checkOut: null,
    adults: 2,
    children: 0,
    childrenAges: [],
    privatePool: false,
  })
  const [showGuestPicker, setShowGuestPicker] = useState(false)
  const [showCheckin, setShowCheckin] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  const nights =
    state.checkIn && state.checkOut
      ? Math.round((state.checkOut.getTime() - state.checkIn.getTime()) / (1000 * 60 * 60 * 24))
      : 0

  const guestLabel = (() => {
    const total = state.adults + state.children
    if (isFa) return `${total} نفر`
    return `${total} guest${total !== 1 ? 's' : ''}`
  })()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (state.checkIn) params.set('checkin', state.checkIn.toISOString().split('T')[0])
    if (state.checkOut) params.set('checkout', state.checkOut.toISOString().split('T')[0])
    params.set('adults', String(state.adults))
    if (state.children > 0) params.set('children', String(state.children))
    if (state.privatePool) params.set('pool', '1')
    router.push(`/${locale}/accommodations?${params.toString()}`)
  }

  return (
    <section
      id="availability-search"
      className={cn(
        'py-6 bg-warm-ivory border-b border-stone',
        compact && 'py-4',
        className,
      )}
    >
      <div className="container-content">
        <div
          className={cn(
            'flex flex-col md:flex-row gap-3 items-stretch md:items-center',
            isFa && 'md:flex-row-reverse',
          )}
        >
          {/* Check-in */}
          <button
            className="flex-1 min-w-0 flex items-center gap-3 px-4 py-3 bg-white border border-stone rounded-lg hover:border-lootka-pine transition-colors text-start"
            onClick={() => { setShowCheckin(!showCheckin); setShowCheckout(false); setShowGuestPicker(false) }}
            aria-label={t('checkin')}
            aria-expanded={showCheckin}
          >
            <Calendar size={18} className="text-forest-moss flex-shrink-0" />
            <div>
              <div className="text-caption text-warm-gray">{t('checkin')}</div>
              <div className={cn('text-body font-medium mt-0.5', state.checkIn ? 'text-charcoal' : 'text-warm-gray')}>
                <span className="bidi-isolate" dir="ltr">
                  {state.checkIn ? formatDate(state.checkIn, locale) : t('checkin_placeholder')}
                </span>
              </div>
            </div>
          </button>

          {/* Nights indicator */}
          {nights > 0 && (
            <div className="hidden md:flex items-center justify-center w-16 text-center">
              <div>
                <div className="num text-aged-brass font-medium" dir="ltr">{nights}</div>
                <div className="text-caption text-warm-gray">{nights === 1 ? t('night') : t('nights')}</div>
              </div>
            </div>
          )}

          {/* Check-out */}
          <button
            className="flex-1 min-w-0 flex items-center gap-3 px-4 py-3 bg-white border border-stone rounded-lg hover:border-lootka-pine transition-colors text-start"
            onClick={() => { setShowCheckout(!showCheckout); setShowCheckin(false); setShowGuestPicker(false) }}
            aria-label={t('checkout')}
            aria-expanded={showCheckout}
          >
            <Calendar size={18} className="text-forest-moss flex-shrink-0" />
            <div>
              <div className="text-caption text-warm-gray">{t('checkout')}</div>
              <div className={cn('text-body font-medium mt-0.5', state.checkOut ? 'text-charcoal' : 'text-warm-gray')}>
                <span className="bidi-isolate" dir="ltr">
                  {state.checkOut ? formatDate(state.checkOut, locale) : t('checkout_placeholder')}
                </span>
              </div>
            </div>
          </button>

          {/* Guests */}
          <button
            className="flex-1 min-w-0 flex items-center gap-3 px-4 py-3 bg-white border border-stone rounded-lg hover:border-lootka-pine transition-colors text-start"
            onClick={() => { setShowGuestPicker(!showGuestPicker); setShowCheckin(false); setShowCheckout(false) }}
            aria-label={t('guests')}
            aria-expanded={showGuestPicker}
          >
            <Users size={18} className="text-forest-moss flex-shrink-0" />
            <div>
              <div className="text-caption text-warm-gray">{t('guests')}</div>
              <div className="text-body font-medium mt-0.5 text-charcoal">
                <span className="bidi-isolate" dir="ltr">{guestLabel}</span>
              </div>
            </div>
          </button>

          {/* Private pool toggle */}
          <button
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-lg border transition-all text-sm font-medium',
              state.privatePool
                ? 'bg-lootka-pine text-warm-ivory border-lootka-pine'
                : 'bg-white text-charcoal border-stone hover:border-lootka-pine',
            )}
            onClick={() => setState(s => ({ ...s, privatePool: !s.privatePool }))}
            aria-pressed={state.privatePool}
          >
            <Waves size={16} />
            <span>{t('private_pool')}</span>
          </button>

          {/* Search */}
          <button
            onClick={handleSearch}
            className="btn btn-primary flex items-center gap-2 md:px-6"
            aria-label={t('search_btn')}
          >
            <Search size={16} />
            <span className="md:inline hidden">{t('search_btn')}</span>
          </button>
        </div>

        {/* Guest Picker Dropdown */}
        {showGuestPicker && (
          <div
            className={cn(
              'absolute z-50 mt-2 p-5 bg-white rounded-xl shadow-xl border border-stone w-72',
              isFa ? 'end-0' : 'start-0',
            )}
          >
            <GuestCounter
              label={isFa ? 'بزرگسال' : 'Adults'}
              sublabel={isFa ? '13 سال به بالا' : 'Age 13+'}
              value={state.adults}
              min={1}
              max={10}
              onChange={(v) => setState(s => ({ ...s, adults: v }))}
            />
            <GuestCounter
              label={isFa ? 'کودک' : 'Children'}
              sublabel={isFa ? 'زیر 13 سال' : 'Under 13'}
              value={state.children}
              min={0}
              max={6}
              onChange={(v) => setState(s => ({ ...s, children: v }))}
            />
            <button
              className="mt-4 w-full btn btn-outline-dark btn-sm"
              onClick={() => setShowGuestPicker(false)}
            >
              {isFa ? 'تأیید' : 'Done'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function GuestCounter({
  label, sublabel, value, min, max, onChange
}: {
  label: string
  sublabel: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-stone last:border-0">
      <div>
        <div className="text-sm font-medium text-charcoal">{label}</div>
        <div className="text-caption text-warm-gray mt-0.5">{sublabel}</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="w-8 h-8 rounded-full border border-stone flex items-center justify-center text-charcoal hover:border-lootka-pine hover:text-lootka-pine transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className="num w-4 text-center font-medium" dir="ltr">{value}</span>
        <button
          className="w-8 h-8 rounded-full border border-stone flex items-center justify-center text-charcoal hover:border-lootka-pine hover:text-lootka-pine transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )
}
