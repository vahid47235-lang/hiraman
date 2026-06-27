'use client'

import { useState } from 'react'
import { ArrowRight, ArrowLeft, Lock, Tag, X, AlertCircle } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import { useBookingStore } from '@/store/booking'

type Props = { locale: string }

type FormErrors = Partial<Record<string, string>>

export default function Step4GuestDetails({ locale }: Props) {
  const isFa = locale === 'fa'
  const Arrow = isFa ? ArrowLeft : ArrowRight

  const guest = useBookingStore(s => s.guest)
  const agreedToTerms = useBookingStore(s => s.agreedToTerms)
  const couponCode = useBookingStore(s => s.couponCode)
  const couponDiscount = useBookingStore(s => s.couponDiscount)
  const grandTotal = useBookingStore(s => s.grandTotal())
  const setGuestInfo = useBookingStore(s => s.setGuestInfo)
  const setTerms = useBookingStore(s => s.setTerms)
  const setCoupon = useBookingStore(s => s.setCoupon)
  const setStep = useBookingStore(s => s.setStep)

  const [errors, setErrors] = useState<FormErrors>({})
  const [couponInput, setCouponInput] = useState(couponCode ?? '')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!guest?.firstName?.trim()) e.firstName = isFa ? 'نام الزامی است.' : 'First name is required.'
    if (!guest?.lastName?.trim()) e.lastName = isFa ? 'نام خانوادگی الزامی است.' : 'Last name is required.'
    if (!guest?.phone?.trim()) e.phone = isFa ? 'شماره موبایل الزامی است.' : 'Phone number is required.'
    else if (!/^\+?[0-9]{10,15}$/.test(guest.phone.trim())) {
      e.phone = isFa ? 'شماره موبایل معتبر نیست.' : 'Phone number is not valid.'
    }
    if (!guest?.email?.trim()) e.email = isFa ? 'ایمیل الزامی است.' : 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email.trim())) {
      e.email = isFa ? 'فرمت ایمیل نادرست است.' : 'Email format is invalid.'
    }
    if (!agreedToTerms) e.terms = isFa ? 'پذیرش قوانین الزامی است.' : 'You must accept the terms.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    setCouponError(null)
    // TODO: call API POST /api/v1/coupons/validate
    await new Promise(r => setTimeout(r, 800))
    if (couponInput.trim().toUpperCase() === 'HIRABAN10') {
      setCoupon(couponInput.trim().toUpperCase(), 10) // 10% discount
    } else {
      setCouponError(isFa ? 'کد تخفیف نامعتبر است.' : 'Invalid coupon code.')
    }
    setCouponLoading(false)
  }

  const handleRemoveCoupon = () => {
    setCoupon(null, 0)
    setCouponInput('')
    setCouponError(null)
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    // TODO: call API POST /api/v1/reservations/confirm
    // which will: verify hold, re-check availability, verify price, create reservation
    await new Promise(r => setTimeout(r, 1200))
    setSubmitting(false)
    setStep(5)
  }

  const field = (
    id: keyof NonNullable<typeof guest>,
    label: string,
    type = 'text',
    placeholder = '',
    isNum = false,
  ) => (
    <div>
      <label htmlFor={id} className={cn('block text-sm font-medium text-charcoal mb-1.5', isFa && 'text-end')}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        dir={isNum ? 'ltr' : undefined}
        inputMode={isNum ? 'tel' : undefined}
        placeholder={placeholder}
        value={(guest as Record<string, string>)?.[id] ?? ''}
        onChange={e => setGuestInfo({ ...guest, [id]: e.target.value } as NonNullable<typeof guest>)}
        className={cn(
          'w-full px-4 py-3 border rounded-xl text-sm bg-white text-charcoal placeholder:text-stone transition-colors focus:outline-none focus:ring-1',
          errors[id as string]
            ? 'border-natural-clay focus:border-natural-clay focus:ring-natural-clay/20'
            : 'border-stone focus:border-hiraban-pine focus:ring-hiraban-pine/20',
          isFa && !isNum && 'text-end',
        )}
        aria-invalid={!!errors[id as string]}
        aria-describedby={errors[id as string] ? `${id}-error` : undefined}
      />
      {errors[id as string] && (
        <p id={`${id}-error`} className={cn('mt-1 text-caption text-natural-clay flex items-center gap-1', isFa && 'flex-row-reverse justify-end')}>
          <AlertCircle size={11} />
          {errors[id as string]}
        </p>
      )}
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h2 className={cn('text-headline text-charcoal mb-1', isFa ? 'font-persian-display' : 'font-display')}>
          {isFa ? 'اطلاعات مهمان' : 'Guest details'}
        </h2>
        <p className={cn('text-body text-warm-gray', isFa && 'text-end')}>
          {isFa
            ? 'اطلاعات تماس برای تأیید رزرو لازم است.'
            : 'Contact details are required to confirm your reservation.'}
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal info */}
        <div className="bg-white border border-stone rounded-xl p-5 space-y-4">
          <h3 className={cn('text-sm font-semibold text-charcoal', isFa && 'text-end')}>
            {isFa ? 'مشخصات فردی' : 'Personal information'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('firstName', isFa ? 'نام' : 'First name', 'text', isFa ? 'علی' : 'First name')}
            {field('lastName', isFa ? 'نام خانوادگی' : 'Last name', 'text', isFa ? 'احمدی' : 'Last name')}
          </div>
          {field('phone', isFa ? 'شماره موبایل' : 'Phone number', 'tel', '+98 912 345 6789', true)}
          {field('email', isFa ? 'ایمیل' : 'Email address', 'email', 'you@example.com', true)}
          <div>
            <label htmlFor="specialRequests" className={cn('block text-sm font-medium text-charcoal mb-1.5', isFa && 'text-end')}>
              {isFa ? 'درخواست‌های خاص' : 'Special requests'}
              <span className="text-warm-gray font-normal ms-1">({isFa ? 'اختیاری' : 'optional'})</span>
            </label>
            <textarea
              id="specialRequests"
              rows={3}
              placeholder={isFa ? 'مثلاً: نیاز به اتاق کودک، آلرژی غذایی...' : 'E.g. need a crib, dietary allergies...'}
              value={guest?.specialRequests ?? ''}
              onChange={e => setGuestInfo({ ...guest, specialRequests: e.target.value } as NonNullable<typeof guest>)}
              className={cn(
                'w-full px-4 py-3 border border-stone rounded-xl text-sm bg-white text-charcoal placeholder:text-stone transition-colors focus:outline-none focus:border-hiraban-pine focus:ring-1 focus:ring-hiraban-pine/20 resize-none',
                isFa && 'text-end',
              )}
            />
          </div>
        </div>

        {/* Coupon */}
        <div className="bg-white border border-stone rounded-xl p-5">
          <h3 className={cn('text-sm font-semibold text-charcoal mb-3', isFa && 'text-end')}>
            {isFa ? 'کد تخفیف' : 'Coupon code'}
          </h3>
          {couponCode ? (
            <div className={cn('flex items-center gap-2', isFa && 'flex-row-reverse')}>
              <div className={cn('flex items-center gap-2 bg-hiraban-pine/10 text-hiraban-pine px-3 py-2 rounded-lg flex-1', isFa && 'flex-row-reverse')}>
                <Tag size={14} />
                <span className="num text-sm font-medium" dir="ltr">{couponCode}</span>
                <span className="text-sm">
                  — {isFa ? `${couponDiscount}٪ تخفیف` : `${couponDiscount}% off`}
                </span>
              </div>
              <button onClick={handleRemoveCoupon} className="p-1.5 text-warm-gray hover:text-natural-clay transition-colors">
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className={cn('flex gap-2', isFa && 'flex-row-reverse')}>
              <input
                type="text"
                dir="ltr"
                placeholder={isFa ? 'کد تخفیف' : 'Enter coupon'}
                value={couponInput}
                onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(null) }}
                onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                className="flex-1 px-4 py-2.5 border border-stone rounded-xl text-sm bg-white text-charcoal focus:outline-none focus:border-hiraban-pine focus:ring-1 focus:ring-hiraban-pine/20"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={!couponInput.trim() || couponLoading}
                className="btn btn-secondary text-sm px-4"
              >
                {couponLoading ? '...' : (isFa ? 'اعمال' : 'Apply')}
              </button>
            </div>
          )}
          {couponError && (
            <p className={cn('mt-2 text-caption text-natural-clay flex items-center gap-1', isFa && 'flex-row-reverse justify-end')}>
              <AlertCircle size={11} />
              {couponError}
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="bg-white border border-stone rounded-xl p-5">
          <label className={cn('flex items-start gap-3 cursor-pointer', isFa && 'flex-row-reverse')}>
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={e => setTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-hiraban-pine flex-shrink-0"
              aria-describedby="terms-error"
            />
            <span className={cn('text-sm text-charcoal leading-relaxed', isFa && 'text-end')}>
              {isFa ? (
                <>
                  قوانین و شرایط هیرابان از جمله{' '}
                  <a href="/fa/legal/cancellation" target="_blank" className="text-hiraban-pine underline">سیاست لغو رزرو</a>{' '}
                  و{' '}
                  <a href="/fa/legal/privacy" target="_blank" className="text-hiraban-pine underline">سیاست حریم خصوصی</a>{' '}
                  را خوانده‌ام و می‌پذیرم.
                </>
              ) : (
                <>
                  I have read and accept HIRABAN's{' '}
                  <a href="/en/legal/cancellation" target="_blank" className="text-hiraban-pine underline">Cancellation Policy</a>{' '}
                  and{' '}
                  <a href="/en/legal/privacy" target="_blank" className="text-hiraban-pine underline">Privacy Policy</a>.
                </>
              )}
            </span>
          </label>
          {errors.terms && (
            <p id="terms-error" className={cn('mt-2 text-caption text-natural-clay flex items-center gap-1', isFa && 'flex-row-reverse justify-end')}>
              <AlertCircle size={11} />
              {errors.terms}
            </p>
          )}
        </div>

        {/* Total & confirm */}
        <div className="bg-deep-forest rounded-xl p-5 text-warm-ivory">
          <div className={cn('flex items-center justify-between mb-4', isFa && 'flex-row-reverse')}>
            <span className="text-sm opacity-80">{isFa ? 'مبلغ قابل پرداخت' : 'Total to pay'}</span>
            <span className="num text-xl font-bold" dir="ltr">
              {formatNumber(grandTotal)}{' '}
              <span className="text-sm font-normal opacity-70">{isFa ? 'تومان' : 'IRR'}</span>
            </span>
          </div>

          <div className={cn('flex items-center gap-2 text-caption opacity-60 mb-4', isFa && 'flex-row-reverse')}>
            <Lock size={11} />
            <span>{isFa ? 'پرداخت از طریق درگاه امن' : 'Secure payment gateway'}</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={cn(
              'w-full btn flex items-center justify-center gap-2 bg-aged-brass hover:bg-soft-gold text-deep-forest font-semibold py-3 rounded-xl transition-colors',
              submitting && 'opacity-70 cursor-not-allowed',
              isFa && 'flex-row-reverse',
            )}
          >
            {submitting ? (
              <span>{isFa ? 'در حال پردازش...' : 'Processing...'}</span>
            ) : (
              <>
                <Lock size={16} />
                {isFa ? 'تأیید و پرداخت' : 'Confirm & pay'}
              </>
            )}
          </button>
        </div>

        {/* Back */}
        <button
          onClick={() => setStep(3)}
          className="btn btn-ghost text-sm text-warm-gray"
        >
          {isFa ? 'بازگشت' : 'Back'}
        </button>
      </div>
    </div>
  )
}
