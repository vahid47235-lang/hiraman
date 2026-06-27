'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Check, Waves, Users, Moon, ArrowRight, ArrowLeft, Star } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import { useBookingStore } from '@/store/booking'

type Props = { locale: string }

type UnitResult = {
  id: string
  slug: string
  nameEn: string
  nameFa: string
  descEn: string
  descFa: string
  image: string
  capacity: number
  hasPool: boolean
  pricePerNight: number // IRR
  minStay: number
  tags: string[]
}

// Mock data — replaced by real API once backend is running
const MOCK_UNITS: UnitResult[] = [
  {
    id: 'villa-a',
    slug: 'forest-villa-a',
    nameEn: 'Forest Villa A',
    nameFa: 'ویلای جنگلی آ',
    descEn: 'Private hillside villa with panoramic forest views and private pool.',
    descFa: 'ویلای خصوصی روی تپه با دید پانوراما به جنگل و استخر اختصاصی.',
    image: '/images/accommodations/villa-a.jpg',
    capacity: 6,
    hasPool: true,
    pricePerNight: 12_500_000,
    minStay: 2,
    tags: ['pool', 'view', 'fireplace'],
  },
  {
    id: 'villa-b',
    slug: 'forest-villa-b',
    nameEn: 'Forest Villa B',
    nameFa: 'ویلای جنگلی ب',
    descEn: 'Spacious villa nestled among ancient oaks, sleeps up to 8.',
    descFa: 'ویلای بزرگ در میان بلوط‌های کهنسال، برای ۸ نفر.',
    image: '/images/accommodations/villa-b.jpg',
    capacity: 8,
    hasPool: true,
    pricePerNight: 15_000_000,
    minStay: 2,
    tags: ['pool', 'large', 'bbq'],
  },
  {
    id: 'treehouse-1',
    slug: 'treehouse-1',
    nameEn: 'Oak Treehouse',
    nameFa: 'کلبه درختی بلوط',
    descEn: 'Elevated hideaway in the forest canopy. Romantic and serene.',
    descFa: 'پناهگاه معلق در تاج درختان جنگل. رمانتیک و آرام.',
    image: '/images/accommodations/treehouse-1.jpg',
    capacity: 2,
    hasPool: false,
    pricePerNight: 8_000_000,
    minStay: 1,
    tags: ['romantic', 'view', 'unique'],
  },
  {
    id: 'cabin-1',
    slug: 'mountain-cabin-1',
    nameEn: 'Mountain Cabin',
    nameFa: 'کلبه کوهستانی',
    descEn: 'Cozy stone cabin with fireplace and mountain stream access.',
    descFa: 'کلبه سنگی دنج با شومینه و دسترسی به جوی کوهستانی.',
    image: '/images/accommodations/cabin-1.jpg',
    capacity: 4,
    hasPool: false,
    pricePerNight: 6_500_000,
    minStay: 1,
    tags: ['fireplace', 'stream', 'cozy'],
  },
]

export default function Step2Choose({ locale }: Props) {
  const isFa = locale === 'fa'
  const Arrow = isFa ? ArrowLeft : ArrowRight

  const checkIn = useBookingStore(s => s.checkIn)
  const checkOut = useBookingStore(s => s.checkOut)
  const adults = useBookingStore(s => s.adults)
  const children = useBookingStore(s => s.children)
  const requirePool = useBookingStore(s => s.requirePool)
  const nights = useBookingStore(s => s.nights())
  const selectedUnit = useBookingStore(s => s.unit)
  const setUnit = useBookingStore(s => s.setUnit)
  const setStep = useBookingStore(s => s.setStep)

  const [loading, setLoading] = useState(true)
  const [units, setUnits] = useState<UnitResult[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    // TODO: replace with real API call
    // GET /api/v1/availability?check_in=...&check_out=...&adults=...&children=...&require_pool=...
    const timer = setTimeout(() => {
      let filtered = MOCK_UNITS.filter(u => u.capacity >= adults + children)
      if (requirePool) filtered = filtered.filter(u => u.hasPool)
      setUnits(filtered)
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [checkIn, checkOut, adults, children, requirePool])

  const handleSelect = (unit: UnitResult) => {
    setUnit({
      id: unit.id,
      slug: unit.slug,
      nameEn: unit.nameEn,
      nameFa: unit.nameFa,
      image: unit.image,
      pricePerNight: unit.pricePerNight,
      hasPool: unit.hasPool,
      capacity: unit.capacity,
    })
  }

  const handleContinue = () => {
    if (!selectedUnit) return
    setStep(3)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className={cn('text-headline text-charcoal mb-1', isFa ? 'font-persian-display' : 'font-display')}>
          {isFa ? 'انتخاب واحد اقامتی' : 'Choose your accommodation'}
        </h2>
        <p className="text-body text-warm-gray">
          {isFa
            ? `${nights} شب · ${adults + children} نفر${requirePool ? ' · استخر اختصاصی' : ''}`
            : `${nights} night${nights !== 1 ? 's' : ''} · ${adults + children} guest${adults + children !== 1 ? 's' : ''}${requirePool ? ' · Private pool' : ''}`}
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-xl bg-stone/30 animate-pulse h-64" />
          ))}
        </div>
      )}

      {!loading && units.length === 0 && (
        <div className={cn('py-12 text-center', isFa && 'text-center')}>
          <p className="text-warm-gray mb-4">
            {isFa
              ? 'متأسفانه برای تاریخ‌های انتخابی واحدی موجود نیست.'
              : 'No units available for your selected dates.'}
          </p>
          <button
            onClick={() => setStep(1)}
            className="btn btn-secondary text-sm"
          >
            {isFa ? 'تغییر تاریخ‌ها' : 'Change dates'}
          </button>
        </div>
      )}

      {!loading && units.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {units.map(unit => {
              const isSelected = selectedUnit?.id === unit.id
              const total = unit.pricePerNight * nights

              return (
                <button
                  key={unit.id}
                  onClick={() => handleSelect(unit)}
                  className={cn(
                    'relative text-start rounded-xl border-2 overflow-hidden transition-all group',
                    isSelected
                      ? 'border-hiraban-pine shadow-md'
                      : 'border-stone hover:border-hiraban-pine/50',
                  )}
                  aria-pressed={isSelected}
                  aria-label={isFa ? unit.nameFa : unit.nameEn}
                >
                  {/* Image */}
                  <div className="relative h-44 bg-stone/30">
                    <Image
                      src={unit.image}
                      alt={isFa ? unit.nameFa : unit.nameEn}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Selected overlay */}
                    {isSelected && (
                      <div className="absolute top-3 end-3 w-7 h-7 rounded-full bg-hiraban-pine flex items-center justify-center">
                        <Check size={14} className="text-warm-ivory" />
                      </div>
                    )}
                    {/* Pool badge */}
                    {unit.hasPool && (
                      <div className="absolute bottom-3 start-3 flex items-center gap-1 bg-deep-forest/80 text-warm-ivory text-caption px-2 py-1 rounded-full">
                        <Waves size={11} />
                        <span>{isFa ? 'استخر اختصاصی' : 'Private pool'}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className={cn('font-semibold text-charcoal mb-1', isFa ? 'font-persian text-end' : '')}>
                      {isFa ? unit.nameFa : unit.nameEn}
                    </h3>
                    <p className={cn('text-caption text-warm-gray mb-3 line-clamp-2', isFa && 'text-end')}>
                      {isFa ? unit.descFa : unit.descEn}
                    </p>

                    {/* Meta row */}
                    <div className={cn('flex items-center gap-3 text-caption text-warm-gray mb-3', isFa && 'flex-row-reverse')}>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        <span className="num" dir="ltr">{isFa ? `تا ${unit.capacity} نفر` : `Up to ${unit.capacity}`}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Moon size={12} />
                        <span className="num" dir="ltr">
                          {unit.minStay > 1
                            ? (isFa ? `حداقل ${unit.minStay} شب` : `Min ${unit.minStay} nights`)
                            : (isFa ? 'حداقل ۱ شب' : 'Min 1 night')}
                        </span>
                      </span>
                    </div>

                    {/* Price */}
                    <div className={cn('flex items-end justify-between', isFa && 'flex-row-reverse')}>
                      <div className={isFa ? 'text-end' : ''}>
                        <div className="text-caption text-warm-gray">
                          {isFa ? 'مجموع برای اقامت' : 'Total for stay'}
                        </div>
                        <div className="num text-base font-bold text-hiraban-pine" dir="ltr">
                          {formatNumber(total)}{' '}
                          <span className="text-sm font-normal text-warm-gray">{isFa ? 'تومان' : 'IRR'}</span>
                        </div>
                        <div className="num text-caption text-warm-gray" dir="ltr">
                          {formatNumber(unit.pricePerNight)}{' '}
                          {isFa ? 'تومان/شب' : 'IRR/night'}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Continue */}
          <div className={cn('flex items-center gap-4', isFa ? 'flex-row-reverse' : '')}>
            <button
              onClick={handleContinue}
              disabled={!selectedUnit}
              className={cn(
                'btn btn-primary flex items-center gap-2',
                !selectedUnit && 'opacity-50 cursor-not-allowed',
                isFa && 'flex-row-reverse',
              )}
            >
              {isFa ? 'ادامه' : 'Continue'}
              <Arrow size={16} />
            </button>
            <button
              onClick={() => setStep(1)}
              className="btn btn-ghost text-sm text-warm-gray"
            >
              {isFa ? 'تغییر تاریخ' : 'Change dates'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
