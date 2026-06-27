'use client'

import { useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useBookingStore } from '@/store/booking'
import BookingSteps from '@/components/booking/BookingSteps'
import BookingSummary from '@/components/booking/BookingSummary'
import HoldTimer from '@/components/booking/HoldTimer'
import Step1Search from '@/components/booking/steps/Step1Search'
import Step2Choose from '@/components/booking/steps/Step2Choose'
import Step3AddOns from '@/components/booking/steps/Step3AddOns'
import Step4GuestDetails from '@/components/booking/steps/Step4GuestDetails'
import Step5Confirmation from '@/components/booking/steps/Step5Confirmation'
import { cn } from '@/lib/utils'

type Props = { locale: string }

export default function ReserveClient({ locale }: Props) {
  const isFa = locale === 'fa'
  const params = useSearchParams()

  const step = useBookingStore(s => s.step)
  const holdExpiresAt = useBookingStore(s => s.holdExpiresAt)
  const setStep = useBookingStore(s => s.setStep)
  const reset = useBookingStore(s => s.reset)
  const setSearch = useBookingStore(s => s.setSearch)

  // Pre-fill from URL params (from accommodation detail page "Reserve" button)
  useEffect(() => {
    const checkin = params.get('checkin')
    const checkout = params.get('checkout')
    const adults = parseInt(params.get('adults') ?? '2')
    const children = parseInt(params.get('children') ?? '0')
    if (checkin && checkout) {
      setSearch({
        checkIn: checkin,
        checkOut: checkout,
        adults: isNaN(adults) ? 2 : adults,
        children: isNaN(children) ? 0 : children,
        childrenAges: [],
        requirePool: params.get('pool') === '1',
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleHoldExpire = useCallback(() => {
    // On hold expiry, go back to step 2 and show warning
    setStep(2)
  }, [setStep])

  const showSummary = step >= 2 && step < 5

  return (
    <div className="min-h-screen bg-warm-ivory pt-[var(--nav-height)]">
      {/* Page header */}
      <div className="bg-deep-forest text-warm-ivory py-8">
        <div className="container-content">
          <div className={cn('flex items-center justify-between gap-4 mb-6', isFa && 'flex-row-reverse')}>
            <h1 className={cn('text-title font-medium', isFa ? 'font-persian-display' : 'font-display')}>
              {isFa ? 'رزرو اقامتگاه' : 'Reserve your stay'}
            </h1>
            {/* Hold timer — visible on steps 3 & 4 */}
            {holdExpiresAt && (step === 3 || step === 4) && (
              <HoldTimer
                expiresAt={holdExpiresAt}
                locale={locale}
                onExpire={handleHoldExpire}
              />
            )}
          </div>
          {step < 5 && <BookingSteps current={step} locale={locale} />}
        </div>
      </div>

      {/* Main content */}
      <div className="container-content py-8 lg:py-12">
        <div className={cn(
          'flex gap-8',
          showSummary ? 'flex-col lg:flex-row' : 'flex-col',
          isFa && showSummary && 'lg:flex-row-reverse',
        )}>
          {/* Step content */}
          <main
            className={cn('min-w-0', showSummary ? 'lg:flex-1' : 'max-w-2xl mx-auto w-full')}
            id="booking-step-content"
            aria-live="polite"
          >
            {step === 1 && <Step1Search locale={locale} />}
            {step === 2 && <Step2Choose locale={locale} />}
            {step === 3 && <Step3AddOns locale={locale} />}
            {step === 4 && <Step4GuestDetails locale={locale} />}
            {step === 5 && <Step5Confirmation locale={locale} />}
          </main>

          {/* Summary sidebar */}
          {showSummary && (
            <div className="lg:w-80 xl:w-96 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <BookingSummary locale={locale} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sticky reserve bar (steps 2–4) */}
      {showSummary && step < 4 && (
        <MobileStickyBar locale={locale} step={step} />
      )}
    </div>
  )
}

function MobileStickyBar({ locale, step }: { locale: string; step: number }) {
  const isFa = locale === 'fa'
  const grandTotal = useBookingStore(s => s.grandTotal())
  const setStep = useBookingStore(s => s.setStep)
  const unit = useBookingStore(s => s.unit)

  if (!unit) return null

  const nextLabel = {
    fa: { 2: 'افزودن خدمات', 3: 'تکمیل اطلاعات' },
    en: { 2: 'Add experiences', 3: 'Guest details' },
  }[locale as 'fa' | 'en'][step as 2 | 3]

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-stone p-4">
      <div className={cn('flex items-center justify-between gap-4', isFa && 'flex-row-reverse')}>
        <div className={isFa ? 'text-end' : ''}>
          <div className="text-caption text-warm-gray">{isFa ? 'مبلغ کل' : 'Total'}</div>
          <div className="num text-base font-semibold text-charcoal" dir="ltr">
            {new Intl.NumberFormat('en-US').format(grandTotal)}{' '}
            <span className="text-warm-gray font-normal text-sm">{isFa ? 'تومان' : 'IRR'}</span>
          </div>
        </div>
        <button
          className="btn btn-primary flex-1 max-w-[220px]"
          onClick={() => setStep((step + 1) as 2 | 3 | 4)}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  )
}
