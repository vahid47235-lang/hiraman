'use client'

import { useState } from 'react'
import { Check, ArrowRight, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import { useBookingStore, type AddOn } from '@/store/booking'

type Props = { locale: string }

type AddOnDef = {
  id: string
  nameEn: string
  nameFa: string
  descEn: string
  descFa: string
  icon: string
  pricePerUnit: number
  unit: 'per_night' | 'per_person' | 'per_stay' | 'per_day'
  category: 'dining' | 'wellness' | 'adventure' | 'convenience'
}

const ADD_ONS: AddOnDef[] = [
  // Dining
  {
    id: 'breakfast',
    nameEn: 'Daily Breakfast',
    nameFa: 'صبحانه روزانه',
    descEn: 'Full Persian breakfast served at your villa each morning.',
    descFa: 'صبحانه کامل ایرانی هر روز صبح در ویلای شما سرو می‌شود.',
    icon: '☕',
    pricePerUnit: 350_000,
    unit: 'per_person',
    category: 'dining',
  },
  {
    id: 'dinner',
    nameEn: 'Candlelit Dinner',
    nameFa: 'شام رمانتیک',
    descEn: 'Private dinner for two in the forest clearing.',
    descFa: 'شام خصوصی برای دو نفر در دل جنگل.',
    icon: '🕯️',
    pricePerUnit: 2_500_000,
    unit: 'per_stay',
    category: 'dining',
  },
  // Wellness
  {
    id: 'massage',
    nameEn: 'Forest Spa Massage',
    nameFa: 'ماساژ اسپا جنگلی',
    descEn: '90-minute deep-tissue massage with forest aromatherapy.',
    descFa: '۹۰ دقیقه ماساژ بافت عمیق با آروماتراپی جنگلی.',
    icon: '💆',
    pricePerUnit: 1_200_000,
    unit: 'per_person',
    category: 'wellness',
  },
  {
    id: 'yoga',
    nameEn: 'Private Yoga Session',
    nameFa: 'جلسه یوگای خصوصی',
    descEn: 'Sunrise yoga with a certified instructor in the meadow.',
    descFa: 'یوگا در طلوع آفتاب با مربی مجاز در دشت.',
    icon: '🧘',
    pricePerUnit: 800_000,
    unit: 'per_person',
    category: 'wellness',
  },
  // Adventure
  {
    id: 'atv',
    nameEn: 'ATV Forest Tour',
    nameFa: 'تور ATV جنگلی',
    descEn: '2-hour guided ATV ride through the mountain trails.',
    descFa: '۲ ساعت تور ATV هدایت‌شده در مسیرهای کوهستانی.',
    icon: '🏍️',
    pricePerUnit: 1_500_000,
    unit: 'per_person',
    category: 'adventure',
  },
  {
    id: 'horse',
    nameEn: 'Horse Riding',
    nameFa: 'اسب‌سواری',
    descEn: '1-hour guided horse ride through the Lootka trails.',
    descFa: '۱ ساعت اسب‌سواری هدایت‌شده در مسیرهای لوتکا.',
    icon: '🐴',
    pricePerUnit: 900_000,
    unit: 'per_person',
    category: 'adventure',
  },
  {
    id: 'kids-camp',
    nameEn: "Children's Nature Camp",
    nameFa: 'کمپ طبیعت کودکان',
    descEn: 'Half-day supervised nature activities for children 4–12.',
    descFa: 'فعالیت‌های نیمه‌روزه طبیعت تحت نظارت برای کودکان ۴ تا ۱۲ سال.',
    icon: '🌿',
    pricePerUnit: 600_000,
    unit: 'per_person',
    category: 'adventure',
  },
  // Convenience
  {
    id: 'early-checkin',
    nameEn: 'Early Check-in',
    nameFa: 'ورود زودهنگام',
    descEn: 'Check in from 10:00 AM (subject to availability).',
    descFa: 'ورود از ساعت ۱۰:۰۰ صبح (در صورت موجودیت).',
    icon: '🌅',
    pricePerUnit: 500_000,
    unit: 'per_stay',
    category: 'convenience',
  },
  {
    id: 'late-checkout',
    nameEn: 'Late Check-out',
    nameFa: 'خروج دیرهنگام',
    descEn: 'Check out until 4:00 PM (subject to availability).',
    descFa: 'خروج تا ساعت ۱۶:۰۰ بعدازظهر (در صورت موجودیت).',
    icon: '🌇',
    pricePerUnit: 500_000,
    unit: 'per_stay',
    category: 'convenience',
  },
]

const CATEGORY_LABELS: Record<string, { fa: string; en: string }> = {
  dining: { fa: 'غذا و نوشیدنی', en: 'Dining' },
  wellness: { fa: 'سلامت و آرامش', en: 'Wellness' },
  adventure: { fa: 'ماجراجویی', en: 'Adventure' },
  convenience: { fa: 'آسایش', en: 'Convenience' },
}

const CATEGORIES = ['dining', 'wellness', 'adventure', 'convenience'] as const

export default function Step3AddOns({ locale }: Props) {
  const isFa = locale === 'fa'
  const Arrow = isFa ? ArrowLeft : ArrowRight

  const addOns = useBookingStore(s => s.addOns)
  const setAddOns = useBookingStore(s => s.setAddOns)
  const setStep = useBookingStore(s => s.setStep)
  const nights = useBookingStore(s => s.nights())
  const adults = useBookingStore(s => s.adults)
  const children = useBookingStore(s => s.children)

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggle = (id: string) => {
    const existing = addOns.find(a => a.id === id)
    if (existing) {
      setAddOns(addOns.filter(a => a.id !== id))
    } else {
      const def = ADD_ONS.find(a => a.id === id)!
      const qty = def.unit === 'per_person' ? adults + children : 1
      setAddOns([...addOns, { id: def.id, nameEn: def.nameEn, nameFa: def.nameFa, pricePerUnit: def.pricePerUnit, quantity: qty, unit: def.unit }])
    }
  }

  const computeLineTotal = (def: AddOnDef): number => {
    if (def.unit === 'per_night') return def.pricePerUnit * nights
    if (def.unit === 'per_person') return def.pricePerUnit * (adults + children)
    return def.pricePerUnit
  }

  const unitLabel = (def: AddOnDef) => {
    if (isFa) {
      if (def.unit === 'per_night') return `${formatNumber(def.pricePerUnit)} تومان / شب`
      if (def.unit === 'per_person') return `${formatNumber(def.pricePerUnit)} تومان / نفر`
      return `${formatNumber(def.pricePerUnit)} تومان`
    }
    if (def.unit === 'per_night') return `${formatNumber(def.pricePerUnit)} IRR/night`
    if (def.unit === 'per_person') return `${formatNumber(def.pricePerUnit)} IRR/person`
    return `${formatNumber(def.pricePerUnit)} IRR`
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className={cn('text-headline text-charcoal mb-1', isFa ? 'font-persian-display' : 'font-display')}>
          {isFa ? 'تجربه‌های اضافی' : 'Add experiences'}
        </h2>
        <p className={cn('text-body text-warm-gray', isFa && 'text-end')}>
          {isFa
            ? 'اقامت خود را با خدمات ویژه لوتکا کامل‌تر کنید. همه موارد اختیاری هستند.'
            : 'Enhance your stay with curated LOOTKA experiences. All optional.'}
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {CATEGORIES.map(cat => {
          const catItems = ADD_ONS.filter(a => a.category === cat)
          const label = CATEGORY_LABELS[cat]
          const isOpen = !collapsed[cat]

          return (
            <div key={cat}>
              <button
                onClick={() => setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }))}
                className={cn('w-full flex items-center justify-between mb-3 group', isFa && 'flex-row-reverse')}
              >
                <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider">
                  {isFa ? label.fa : label.en}
                </h3>
                {isOpen
                  ? <ChevronUp size={16} className="text-warm-gray" />
                  : <ChevronDown size={16} className="text-warm-gray" />}
              </button>

              {isOpen && (
                <div className="space-y-3">
                  {catItems.map(def => {
                    const isSelected = addOns.some(a => a.id === def.id)
                    const lineTotal = computeLineTotal(def)

                    return (
                      <button
                        key={def.id}
                        onClick={() => toggle(def.id)}
                        className={cn(
                          'w-full text-start flex items-start gap-3 p-4 rounded-xl border-2 transition-all',
                          isSelected
                            ? 'border-lootka-pine bg-lootka-pine/5'
                            : 'border-stone hover:border-lootka-pine/40 bg-white',
                          isFa && 'flex-row-reverse',
                        )}
                        aria-pressed={isSelected}
                      >
                        <span className="text-2xl flex-shrink-0 leading-none mt-0.5">{def.icon}</span>
                        <div className={cn('flex-1 min-w-0', isFa && 'text-end')}>
                          <div className={cn('flex items-center gap-2 mb-0.5', isFa && 'flex-row-reverse justify-end')}>
                            <span className="text-sm font-semibold text-charcoal">
                              {isFa ? def.nameFa : def.nameEn}
                            </span>
                          </div>
                          <p className="text-caption text-warm-gray line-clamp-2 mb-2">
                            {isFa ? def.descFa : def.descEn}
                          </p>
                          <div className={cn('flex items-center justify-between', isFa && 'flex-row-reverse')}>
                            <span className="num text-caption text-warm-gray" dir="ltr">
                              {unitLabel(def)}
                            </span>
                            {isSelected && (
                              <span className="num text-sm font-semibold text-lootka-pine" dir="ltr">
                                +{formatNumber(lineTotal)}{' '}
                                <span className="text-caption font-normal">{isFa ? 'تومان' : 'IRR'}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div
                          className={cn(
                            'w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center mt-0.5',
                            isSelected ? 'bg-lootka-pine border-lootka-pine' : 'border-stone',
                          )}
                        >
                          {isSelected && <Check size={12} className="text-warm-ivory" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className={cn('flex items-center gap-4', isFa && 'flex-row-reverse')}>
        <button
          onClick={() => setStep(4)}
          className={cn('btn btn-primary flex items-center gap-2', isFa && 'flex-row-reverse')}
        >
          {isFa ? 'ادامه' : 'Continue'}
          <Arrow size={16} />
        </button>
        <button
          onClick={() => setStep(4)}
          className="btn btn-ghost text-sm text-warm-gray"
        >
          {isFa ? 'رد کردن' : 'Skip'}
        </button>
        <button
          onClick={() => setStep(2)}
          className="btn btn-ghost text-sm text-warm-gray"
        >
          {isFa ? 'بازگشت' : 'Back'}
        </button>
      </div>
    </div>
  )
}
