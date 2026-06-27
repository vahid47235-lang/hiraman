'use client'

import { useEffect } from 'react'
import { CheckCircle, Calendar, MapPin, Users, Download, Share2, Phone, MessageCircle } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import { useBookingStore } from '@/store/booking'

type Props = { locale: string }

const LOOTKA_PHONE = '+982133445566'
const LOOTKA_WHATSAPP = '982133445566'

export default function Step5Confirmation({ locale }: Props) {
  const isFa = locale === 'fa'

  const reservationNo = useBookingStore(s => s.reservationNo)
  const unit = useBookingStore(s => s.unit)
  const checkIn = useBookingStore(s => s.checkIn)
  const checkOut = useBookingStore(s => s.checkOut)
  const adults = useBookingStore(s => s.adults)
  const children = useBookingStore(s => s.children)
  const addOns = useBookingStore(s => s.addOns)
  const guest = useBookingStore(s => s.guest)
  const grandTotal = useBookingStore(s => s.grandTotal())
  const nights = useBookingStore(s => s.nights())
  const reset = useBookingStore(s => s.reset)

  // Generate a placeholder reservation number if not set (demo mode)
  const resNo = reservationNo ?? 'HR-' + Math.random().toString(36).slice(2, 8).toUpperCase()

  const handleAddToCalendar = () => {
    if (!checkIn || !checkOut || !unit) return
    const title = `LOOTKA – ${isFa ? unit.nameFa : unit.nameEn}`
    const start = checkIn.replace(/-/g, '')
    const end = checkOut.replace(/-/g, '')
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&location=${encodeURIComponent('LOOTKA Resort, Alborz, Iran')}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleShare = async () => {
    const text = isFa
      ? `رزرو لوتکا: ${unit ? unit.nameFa : ''} — کد رزرو: ${resNo}`
      : `LOOTKA Reservation: ${unit ? unit.nameEn : ''} — Booking #${resNo}`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'LOOTKA', text })
      } catch {}
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  return (
    <div className={cn('max-w-lg', isFa && 'text-end')}>
      {/* Success header */}
      <div className={cn('flex items-start gap-4 mb-8', isFa && 'flex-row-reverse')}>
        <CheckCircle size={48} className="text-lootka-pine flex-shrink-0 mt-1" strokeWidth={1.5} />
        <div>
          <h2 className={cn('text-headline text-charcoal mb-1', isFa ? 'font-persian-display' : 'font-display')}>
            {isFa ? 'رزرو شما تأیید شد!' : 'Your reservation is confirmed!'}
          </h2>
          <p className="text-body text-warm-gray">
            {isFa
              ? 'ایمیل تأییدیه به زودی ارسال می‌شود.'
              : 'A confirmation email will be sent shortly.'}
          </p>
        </div>
      </div>

      {/* Reservation number */}
      <div className="bg-deep-forest text-warm-ivory rounded-xl p-5 mb-6">
        <div className={cn('text-caption opacity-60 mb-1', isFa && 'text-end')}>
          {isFa ? 'شماره رزرو' : 'Booking reference'}
        </div>
        <div className="num text-2xl font-bold tracking-widest" dir="ltr">{resNo}</div>
        <div className={cn('text-caption opacity-60 mt-2', isFa && 'text-end')}>
          {isFa
            ? 'این کد را برای پیگیری رزرو نگه دارید.'
            : 'Keep this code for your records.'}
        </div>
      </div>

      {/* Stay details */}
      <div className="bg-white border border-stone rounded-xl divide-y divide-stone mb-6">
        {unit && (
          <div className={cn('flex items-start gap-3 p-4', isFa && 'flex-row-reverse')}>
            <MapPin size={16} className="text-forest-moss mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-semibold text-charcoal">
                {isFa ? unit.nameFa : unit.nameEn}
              </div>
              <div className="text-caption text-warm-gray">{isFa ? 'لوتکا، البرز، ایران' : 'LOOTKA, Alborz, Iran'}</div>
            </div>
          </div>
        )}

        {checkIn && checkOut && (
          <div className={cn('flex items-start gap-3 p-4', isFa && 'flex-row-reverse')}>
            <Calendar size={16} className="text-forest-moss mt-0.5 flex-shrink-0" />
            <div>
              <div className={cn('flex items-center gap-2 text-sm font-semibold text-charcoal', isFa && 'flex-row-reverse')}>
                <span className="num" dir="ltr">{checkIn}</span>
                <span className="text-warm-gray">→</span>
                <span className="num" dir="ltr">{checkOut}</span>
              </div>
              <div className="num text-caption text-warm-gray" dir="ltr">
                {nights} {isFa ? 'شب' : `night${nights !== 1 ? 's' : ''}`}
              </div>
            </div>
          </div>
        )}

        <div className={cn('flex items-start gap-3 p-4', isFa && 'flex-row-reverse')}>
          <Users size={16} className="text-forest-moss mt-0.5 flex-shrink-0" />
          <div className="text-sm text-charcoal">
            <span className="num" dir="ltr">{adults}</span>{' '}
            {isFa ? 'بزرگسال' : `adult${adults !== 1 ? 's' : ''}`}
            {children > 0 && (
              <>
                {' · '}
                <span className="num" dir="ltr">{children}</span>{' '}
                {isFa ? 'کودک' : `child${children !== 1 ? 'ren' : ''}`}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add-ons */}
      {addOns.length > 0 && (
        <div className="bg-white border border-stone rounded-xl p-4 mb-6">
          <h3 className={cn('text-sm font-semibold text-charcoal mb-3', isFa && 'text-end')}>
            {isFa ? 'خدمات افزوده' : 'Included add-ons'}
          </h3>
          <ul className="space-y-1">
            {addOns.map(a => (
              <li key={a.id} className={cn('flex items-center justify-between text-sm', isFa && 'flex-row-reverse')}>
                <span className="text-charcoal">{isFa ? a.nameFa : a.nameEn}</span>
                <span className="num text-warm-gray" dir="ltr">
                  {formatNumber(a.pricePerUnit * a.quantity)}{' '}
                  {isFa ? 'تومان' : 'IRR'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Total */}
      <div className={cn('flex items-center justify-between p-4 bg-warm-ivory rounded-xl mb-6', isFa && 'flex-row-reverse')}>
        <span className="text-sm font-semibold text-charcoal">{isFa ? 'مبلغ پرداخت شده' : 'Total paid'}</span>
        <span className="num text-base font-bold text-lootka-pine" dir="ltr">
          {formatNumber(grandTotal)}{' '}
          <span className="text-warm-gray font-normal text-sm">{isFa ? 'تومان' : 'IRR'}</span>
        </span>
      </div>

      {/* Action buttons */}
      <div className={cn('flex flex-wrap gap-3 mb-8', isFa && 'flex-row-reverse')}>
        <button
          onClick={handleAddToCalendar}
          className={cn('btn btn-secondary text-sm flex items-center gap-2', isFa && 'flex-row-reverse')}
        >
          <Calendar size={15} />
          {isFa ? 'افزودن به تقویم' : 'Add to calendar'}
        </button>
        <button
          onClick={handleShare}
          className={cn('btn btn-secondary text-sm flex items-center gap-2', isFa && 'flex-row-reverse')}
        >
          <Share2 size={15} />
          {isFa ? 'اشتراک‌گذاری' : 'Share'}
        </button>
        <button
          className={cn('btn btn-secondary text-sm flex items-center gap-2', isFa && 'flex-row-reverse')}
          onClick={() => window.print()}
        >
          <Download size={15} />
          {isFa ? 'دانلود PDF' : 'Download PDF'}
        </button>
      </div>

      {/* Cancellation policy */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <h4 className={cn('text-sm font-semibold text-amber-800 mb-1', isFa && 'text-end')}>
          {isFa ? 'سیاست لغو رزرو' : 'Cancellation policy'}
        </h4>
        <p className={cn('text-caption text-amber-700', isFa && 'text-end')}>
          {isFa
            ? 'لغو تا ۷ روز قبل از ورود: استرداد کامل. لغو ۳ تا ۷ روز قبل: استرداد ۵۰٪. کمتر از ۳ روز: بدون استرداد.'
            : 'Cancel up to 7 days before check-in: full refund. 3–7 days: 50% refund. Less than 3 days: no refund.'}
        </p>
      </div>

      {/* Contact */}
      <div className="bg-white border border-stone rounded-xl p-4">
        <h4 className={cn('text-sm font-semibold text-charcoal mb-3', isFa && 'text-end')}>
          {isFa ? 'نیاز به کمک دارید؟' : 'Need assistance?'}
        </h4>
        <div className={cn('flex flex-wrap gap-3', isFa && 'flex-row-reverse')}>
          <a
            href={`tel:${LOOTKA_PHONE}`}
            className={cn('flex items-center gap-2 text-sm text-lootka-pine hover:underline', isFa && 'flex-row-reverse')}
          >
            <Phone size={14} />
            <span className="num" dir="ltr">{LOOTKA_PHONE}</span>
          </a>
          <a
            href={`https://wa.me/${LOOTKA_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn('flex items-center gap-2 text-sm text-[#25D366] hover:underline', isFa && 'flex-row-reverse')}
          >
            <MessageCircle size={14} />
            <span>{isFa ? 'واتساپ' : 'WhatsApp'}</span>
          </a>
        </div>
      </div>

      {/* New reservation */}
      <button
        onClick={() => reset()}
        className="btn btn-ghost text-sm text-warm-gray mt-6"
      >
        {isFa ? 'رزرو جدید' : 'Make another reservation'}
      </button>
    </div>
  )
}
