'use client'

import { useBookingStore } from '@/store/booking'
import { formatPrice, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Calendar, Users, Waves, Tag, ChevronDown } from 'lucide-react'
import { useState } from 'react'

type Props = { locale: string; className?: string }

export default function BookingSummary({ locale, className }: Props) {
  const isFa = locale === 'fa'
  const [expanded, setExpanded] = useState(false)

  const unit = useBookingStore(s => s.unit)
  const checkIn = useBookingStore(s => s.checkIn)
  const checkOut = useBookingStore(s => s.checkOut)
  const adults = useBookingStore(s => s.adults)
  const children = useBookingStore(s => s.children)
  const addOns = useBookingStore(s => s.addOns)
  const couponDiscount = useBookingStore(s => s.couponDiscount)
  const nights = useBookingStore(s => s.nights())
  const subtotal = useBookingStore(s => s.subtotal())
  const addOnsTotal = useBookingStore(s => s.addOnsTotal())
  const couponCode = useBookingStore(s => s.couponCode)
  const grandTotal = useBookingStore(s => s.grandTotal())
  const step = useBookingStore(s => s.step)

  if (!unit || step < 2) return null

  const unitName = isFa ? unit.nameFa : unit.nameEn

  return (
    <aside
      className={cn(
        'bg-white rounded-2xl border border-stone overflow-hidden',
        className,
      )}
      aria-label={isFa ? 'خلاصه رزرو' : 'Booking summary'}
    >
      {/* Mobile toggle header */}
      <button
        className="lg:hidden w-full flex items-center justify-between p-4 border-b border-stone"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span className="text-sm font-medium text-charcoal">
          {isFa ? 'خلاصه رزرو' : 'Booking summary'}
        </span>
        <div className={cn('flex items-center gap-3', isFa && 'flex-row-reverse')}>
          <span className="num text-sm font-semibold text-hiraban-pine" dir="ltr">
            {formatPrice(grandTotal, 'IRR', locale)}
          </span>
          <ChevronDown size={16} className={cn('text-warm-gray transition-transform', expanded && 'rotate-180')} />
        </div>
      </button>

      {/* Body */}
      <div className={cn('p-5', !expanded && 'hidden lg:block')}>
        {/* Unit */}
        <div className="mb-5 pb-5 border-b border-stone">
          <h3 className={cn('text-title font-medium text-charcoal mb-3', isFa ? 'font-persian-display' : 'font-display')}>
            {unitName}
          </h3>

          {/* Date row */}
          {checkIn && checkOut && (
            <div className={cn('flex items-center gap-2 text-body-sm text-warm-gray mb-2', isFa && 'flex-row-reverse')}>
              <Calendar size={13} className="text-forest-moss flex-shrink-0" />
              <span className="num" dir="ltr">
                {formatDate(checkIn, locale, { month: 'short', day: 'numeric' })}
              </span>
              <span>—</span>
              <span className="num" dir="ltr">
                {formatDate(checkOut, locale, { month: 'short', day: 'numeric' })}
              </span>
              <span className="text-warm-gray/60">
                · <span className="num" dir="ltr">{nights}</span>{' '}
                {isFa ? 'شب' : nights === 1 ? 'night' : 'nights'}
              </span>
            </div>
          )}

          {/* Guests */}
          <div className={cn('flex items-center gap-2 text-body-sm text-warm-gray', isFa && 'flex-row-reverse')}>
            <Users size={13} className="text-forest-moss flex-shrink-0" />
            <span>
              <span className="num" dir="ltr">{adults}</span>
              {' '}{isFa ? 'بزرگسال' : adults === 1 ? 'adult' : 'adults'}
            </span>
            {children > 0 && (
              <>
                <span>·</span>
                <span>
                  <span className="num" dir="ltr">{children}</span>
                  {' '}{isFa ? 'کودک' : children === 1 ? 'child' : 'children'}
                </span>
              </>
            )}
          </div>

          {unit.hasPool && (
            <div className={cn('flex items-center gap-2 text-body-sm text-aged-brass mt-2', isFa && 'flex-row-reverse')}>
              <Waves size={13} className="flex-shrink-0" />
              <span>{isFa ? 'استخر اختصاصی' : 'Private pool'}</span>
            </div>
          )}
        </div>

        {/* Price breakdown */}
        <div className="space-y-2.5 text-body-sm mb-5">
          {/* Per night */}
          <PriceLine
            label={
              isFa
                ? `${formatPrice(unit.pricePerNight, 'IRR', locale)} × ${nights} شب`
                : `${formatPrice(unit.pricePerNight, 'IRR', locale)} × ${nights} night${nights !== 1 ? 's' : ''}`
            }
            value={subtotal}
            locale={locale}
            isFa={isFa}
          />

          {/* Add-ons */}
          {addOns.map(a => (
            <PriceLine
              key={a.id}
              label={isFa ? a.nameFa : a.nameEn}
              value={a.pricePerUnit * a.quantity}
              locale={locale}
              isFa={isFa}
            />
          ))}

          {/* Coupon */}
          {couponDiscount > 0 && (
            <div className={cn('flex justify-between items-center', isFa && 'flex-row-reverse')}>
              <span className={cn('flex items-center gap-1.5 text-forest-moss', isFa && 'flex-row-reverse')}>
                <Tag size={12} />
                {isFa ? `تخفیف ${couponDiscount}٪` : `${couponDiscount}% discount`}
              </span>
              <span className="num text-forest-moss" dir="ltr">
                − {formatPrice(Math.round((subtotal + addOnsTotal) * couponDiscount / 100), 'IRR', locale)}
              </span>
            </div>
          )}
        </div>

        {/* Grand total */}
        <div className={cn('flex items-center justify-between pt-4 border-t border-stone', isFa && 'flex-row-reverse')}>
          <span className="text-sm font-semibold text-charcoal">
            {isFa ? 'مبلغ قابل پرداخت' : 'Total payable'}
          </span>
          <span className="num text-title font-semibold text-hiraban-pine" dir="ltr">
            {formatPrice(grandTotal, 'IRR', locale)}
          </span>
        </div>

        {/* Cancellation policy */}
        <p className="text-caption text-warm-gray mt-4 leading-relaxed">
          {isFa
            ? 'لغو تا ۷ روز قبل از ورود: استرداد کامل.'
            : 'Cancel up to 7 days before check-in for a full refund.'}
        </p>
      </div>
    </aside>
  )
}

function PriceLine({ label, value, locale, isFa }: {
  label: string
  value: number
  locale: string
  isFa: boolean
}) {
  return (
    <div className={cn('flex justify-between items-center text-warm-gray', isFa && 'flex-row-reverse')}>
      <span>{label}</span>
      <span className="num" dir="ltr">{formatPrice(value, 'IRR', locale)}</span>
    </div>
  )
}
