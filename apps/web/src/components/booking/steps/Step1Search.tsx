'use client'

import { useState } from 'react'
import { useBookingStore } from '@/store/booking'
import { cn } from '@/lib/utils'
import { Calendar, Users, Waves, ArrowRight, ArrowLeft } from 'lucide-react'
import DatePicker from '@/components/booking/DatePicker'
import GuestPicker from '@/components/booking/GuestPicker'

type Props = { locale: string }

export default function Step1Search({ locale }: Props) {
  const isFa = locale === 'fa'
  const Arrow = isFa ? ArrowLeft : ArrowRight

  const checkIn = useBookingStore(s => s.checkIn)
  const checkOut = useBookingStore(s => s.checkOut)
  const adults = useBookingStore(s => s.adults)
  const children = useBookingStore(s => s.children)
  const childrenAges = useBookingStore(s => s.childrenAges)
  const requirePool = useBookingStore(s => s.requirePool)
  const setSearch = useBookingStore(s => s.setSearch)
  const setStep = useBookingStore(s => s.setStep)
  const nights = useBookingStore(s => s.nights())

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showGuestPicker, setShowGuestPicker] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canContinue = checkIn && checkOut && adults >= 1

  const handleContinue = () => {
    if (!checkIn || !checkOut) {
      setError(isFa ? 'لطفاً تاریخ ورود و خروج را انتخاب کنید.' : 'Please select check-in and check-out dates.')
      return
    }
    setError(null)
    setSearch({ checkIn, checkOut, adults, children, childrenAges, requirePool })
    setStep(2)
  }

  const guestSummary = (() => {
    const total = adults + children
    if (isFa) return `${total} نفر`
    return `${total} guest${total !== 1 ? 's' : ''}`
  })()

  const nightsSummary = nights > 0
    ? isFa ? `${nights} شب` : `${nights} night${nights !== 1 ? 's' : ''}`
    : null

  return (
    <div className="max-w-lg">
      <h2 className={cn('text-headline text-charcoal mb-2', isFa ? 'font-persian-display' : 'font-display')}>
        {isFa ? 'تاریخ و تعداد مهمانان' : 'When are you visiting?'}
      </h2>
      <p className="text-body text-warm-gray mb-8">
        {isFa
          ? 'تاریخ ورود، خروج و تعداد مهمانان را مشخص کنید تا واحدهای موجود را مشاهده کنید.'
          : 'Select your dates and guest count to see available accommodations.'}
      </p>

      <div className="space-y-4">
        {/* Date range */}
        <div>
          <label className={cn('block text-sm font-medium text-charcoal mb-2', isFa && 'text-end')}>
            {isFa ? 'تاریخ اقامت' : 'Dates'}
          </label>
          <button
            onClick={() => { setShowDatePicker(true); setShowGuestPicker(false) }}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-4 bg-white border rounded-xl transition-colors text-start',
              showDatePicker ? 'border-lootka-pine ring-1 ring-lootka-pine/20' : 'border-stone hover:border-lootka-pine/50',
              isFa && 'flex-row-reverse',
            )}
            aria-expanded={showDatePicker}
            aria-label={isFa ? 'انتخاب تاریخ' : 'Select dates'}
          >
            <Calendar size={18} className="text-forest-moss flex-shrink-0" />
            <div className={cn('flex-1 min-w-0', isFa && 'text-end')}>
              {checkIn && checkOut ? (
                <div className={cn('flex items-center gap-2 text-charcoal font-medium', isFa && 'flex-row-reverse justify-end')}>
                  <span className="num" dir="ltr">{checkIn}</span>
                  <span className="text-warm-gray">→</span>
                  <span className="num" dir="ltr">{checkOut}</span>
                  {nightsSummary && (
                    <span className="text-caption text-warm-gray bg-warm-ivory px-2 py-0.5 rounded-full">
                      {nightsSummary}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-warm-gray">
                  {isFa ? 'انتخاب تاریخ ورود و خروج' : 'Select check-in & check-out'}
                </span>
              )}
            </div>
          </button>

          {showDatePicker && (
            <div className="mt-2">
              <DatePicker
                locale={locale}
                checkIn={checkIn}
                checkOut={checkOut}
                onChange={(ci, co) => {
                  useBookingStore.setState({ checkIn: ci, checkOut: co })
                  if (ci && co) setShowDatePicker(false)
                }}
                onClose={() => setShowDatePicker(false)}
              />
            </div>
          )}
        </div>

        {/* Guests */}
        <div>
          <label className={cn('block text-sm font-medium text-charcoal mb-2', isFa && 'text-end')}>
            {isFa ? 'مهمانان' : 'Guests'}
          </label>
          <button
            onClick={() => { setShowGuestPicker(!showGuestPicker); setShowDatePicker(false) }}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-4 bg-white border rounded-xl transition-colors text-start',
              showGuestPicker ? 'border-lootka-pine ring-1 ring-lootka-pine/20' : 'border-stone hover:border-lootka-pine/50',
              isFa && 'flex-row-reverse',
            )}
            aria-expanded={showGuestPicker}
          >
            <Users size={18} className="text-forest-moss flex-shrink-0" />
            <span className={cn('text-charcoal font-medium', isFa && 'flex-1 text-end')}>
              {guestSummary}
            </span>
          </button>

          {showGuestPicker && (
            <div className="mt-2 bg-white border border-stone rounded-xl overflow-hidden">
              <GuestPicker
                locale={locale}
                adults={adults}
                children={children}
                childrenAges={childrenAges}
                onChange={(a, c, ages) => {
                  useBookingStore.setState({ adults: a, children: c, childrenAges: ages })
                }}
                onClose={() => setShowGuestPicker(false)}
              />
            </div>
          )}
        </div>

        {/* Private pool toggle */}
        <button
          onClick={() => useBookingStore.setState({ requirePool: !requirePool })}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-start',
            requirePool
              ? 'bg-lootka-pine text-warm-ivory border-lootka-pine'
              : 'bg-white text-charcoal border-stone hover:border-lootka-pine/50',
            isFa && 'flex-row-reverse',
          )}
          aria-pressed={requirePool}
        >
          <Waves size={18} className="flex-shrink-0" />
          <div className={cn('flex-1', isFa && 'text-end')}>
            <div className="text-sm font-medium">
              {isFa ? 'واحد با استخر اختصاصی' : 'Private pool unit'}
            </div>
            <div className="text-caption opacity-70 mt-0.5">
              {isFa
                ? 'فقط واحدهای دارای استخر اختصاصی نمایش داده شوند'
                : 'Only show units with a private pool'}
            </div>
          </div>
          <div
            className={cn(
              'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
              requirePool ? 'bg-aged-brass border-aged-brass' : 'border-stone',
            )}
          >
            {requirePool && <div className="w-2 h-2 rounded-full bg-deep-forest" />}
          </div>
        </button>

        {/* Error */}
        {error && (
          <div role="alert" className={cn('text-natural-clay text-sm', isFa && 'text-end')}>
            {error}
          </div>
        )}

        {/* Continue */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={cn(
            'w-full btn btn-primary btn-lg flex items-center justify-center gap-2 mt-2',
            !canContinue && 'opacity-50 cursor-not-allowed',
            isFa && 'flex-row-reverse',
          )}
        >
          {isFa ? 'مشاهده واحدهای موجود' : 'View available units'}
          <Arrow size={18} />
        </button>
      </div>
    </div>
  )
}
