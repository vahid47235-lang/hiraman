'use client'

import { Minus, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  locale: string
  adults: number
  children: number
  childrenAges: number[]
  onChange: (adults: number, children: number, ages: number[]) => void
  onClose?: () => void
}

const MAX_TOTAL = 12
const MAX_ADULTS = 10
const MAX_CHILDREN = 6

function Counter({
  label,
  sub,
  value,
  min,
  max,
  onInc,
  onDec,
  isFa,
}: {
  label: string
  sub?: string
  value: number
  min: number
  max: number
  onInc: () => void
  onDec: () => void
  isFa: boolean
}) {
  return (
    <div className={cn('flex items-center justify-between py-3', isFa && 'flex-row-reverse')}>
      <div className={isFa ? 'text-end' : ''}>
        <div className="text-sm font-medium text-charcoal">{label}</div>
        {sub && <div className="text-caption text-warm-gray">{sub}</div>}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onDec}
          disabled={value <= min}
          className={cn(
            'w-8 h-8 rounded-full border flex items-center justify-center transition-colors',
            value <= min
              ? 'border-stone text-stone cursor-not-allowed'
              : 'border-hiraban-pine text-hiraban-pine hover:bg-hiraban-pine hover:text-warm-ivory',
          )}
          aria-label={`Decrease ${label}`}
        >
          <Minus size={14} />
        </button>
        <span className="num w-6 text-center text-sm font-semibold text-charcoal" dir="ltr">
          {value}
        </span>
        <button
          onClick={onInc}
          disabled={value >= max}
          className={cn(
            'w-8 h-8 rounded-full border flex items-center justify-center transition-colors',
            value >= max
              ? 'border-stone text-stone cursor-not-allowed'
              : 'border-hiraban-pine text-hiraban-pine hover:bg-hiraban-pine hover:text-warm-ivory',
          )}
          aria-label={`Increase ${label}`}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}

export default function GuestPicker({ locale, adults, children, childrenAges, onChange, onClose }: Props) {
  const isFa = locale === 'fa'
  const total = adults + children

  const setAdults = (n: number) => {
    const capped = Math.min(n, MAX_ADULTS)
    onChange(capped, children, childrenAges)
  }

  const setChildren = (n: number) => {
    const capped = Math.min(n, MAX_CHILDREN)
    const newAges = [...childrenAges]
    if (capped > childrenAges.length) {
      while (newAges.length < capped) newAges.push(5)
    } else {
      newAges.splice(capped)
    }
    onChange(adults, capped, newAges)
  }

  const setChildAge = (idx: number, age: number) => {
    const newAges = [...childrenAges]
    newAges[idx] = age
    onChange(adults, children, newAges)
  }

  const ageOptions = Array.from({ length: 18 }, (_, i) => i)

  return (
    <div className="p-4">
      {/* Header */}
      <div className={cn('flex items-center justify-between mb-3', isFa && 'flex-row-reverse')}>
        <h3 className="text-sm font-semibold text-charcoal">
          {isFa ? 'تعداد مهمانان' : 'Guests'}
        </h3>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-warm-ivory rounded-lg transition-colors" aria-label={isFa ? 'بستن' : 'Close'}>
            <X size={14} className="text-warm-gray" />
          </button>
        )}
      </div>

      <div className="divide-y divide-stone/50">
        <Counter
          label={isFa ? 'بزرگسال' : 'Adults'}
          sub={isFa ? '۱۳ سال به بالا' : '13 years and above'}
          value={adults}
          min={1}
          max={Math.min(MAX_ADULTS, MAX_TOTAL - children)}
          onInc={() => total < MAX_TOTAL && setAdults(adults + 1)}
          onDec={() => adults > 1 && setAdults(adults - 1)}
          isFa={isFa}
        />
        <Counter
          label={isFa ? 'کودک' : 'Children'}
          sub={isFa ? 'زیر ۱۳ سال' : 'Under 13 years'}
          value={children}
          min={0}
          max={Math.min(MAX_CHILDREN, MAX_TOTAL - adults)}
          onInc={() => total < MAX_TOTAL && setChildren(children + 1)}
          onDec={() => children > 0 && setChildren(children - 1)}
          isFa={isFa}
        />
      </div>

      {/* Children's ages */}
      {children > 0 && (
        <div className="mt-3 pt-3 border-t border-stone/50">
          <p className={cn('text-caption text-warm-gray mb-2', isFa && 'text-end')}>
            {isFa ? 'سن کودکان را مشخص کنید:' : 'Ages of children:'}
          </p>
          <div className={cn('flex flex-wrap gap-2', isFa && 'flex-row-reverse')}>
            {Array.from({ length: children }, (_, i) => (
              <div key={i} className={cn('flex items-center gap-1', isFa && 'flex-row-reverse')}>
                <span className="text-caption text-warm-gray">
                  {isFa ? `کودک ${i + 1}` : `Child ${i + 1}`}
                </span>
                <select
                  value={childrenAges[i] ?? 5}
                  onChange={e => setChildAge(i, parseInt(e.target.value))}
                  className="text-sm border border-stone rounded-lg px-2 py-1 bg-white text-charcoal focus:outline-none focus:border-hiraban-pine"
                  aria-label={isFa ? `سن کودک ${i + 1}` : `Age of child ${i + 1}`}
                >
                  {ageOptions.map(age => (
                    <option key={age} value={age}>
                      {age === 0
                        ? (isFa ? 'زیر ۱ سال' : '< 1 yr')
                        : isFa
                          ? `${age} سال`
                          : `${age} yr`}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Capacity note */}
      {total >= MAX_TOTAL && (
        <p className={cn('mt-3 text-caption text-natural-clay', isFa && 'text-end')}>
          {isFa
            ? `حداکثر ${MAX_TOTAL} نفر در هر واحد پذیرفته می‌شود.`
            : `Maximum ${MAX_TOTAL} guests per unit.`}
        </p>
      )}

      {/* Done button */}
      <button
        onClick={onClose}
        className="w-full mt-4 btn btn-secondary text-sm"
      >
        {isFa ? 'تأیید' : 'Done'}
      </button>
    </div>
  )
}
