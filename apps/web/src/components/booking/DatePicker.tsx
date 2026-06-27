'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  locale: string
  checkIn: string | null
  checkOut: string | null
  onChange: (checkIn: string | null, checkOut: string | null) => void
  onClose?: () => void
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function firstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay() // 0=Sun
}

const MONTH_NAMES_FA = [
  'فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور',
  'مهر','آبان','آذر','دی','بهمن','اسفند',
]
const MONTH_NAMES_EN = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DOW_FA = ['ش','ی','د','س','چ','پ','ج']
const DOW_EN = ['Su','Mo','Tu','We','Th','Fr','Sa']

export default function DatePicker({ locale, checkIn, checkOut, onChange, onClose }: Props) {
  const isFa = locale === 'fa'
  const today = toDateStr(new Date())

  const startDate = checkIn ? new Date(checkIn) : new Date()
  const [viewYear, setViewYear] = useState(startDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(startDate.getMonth())
  const [selecting, setSelecting] = useState<'in' | 'out'>(checkIn ? 'out' : 'in')

  const monthNames = isFa ? MONTH_NAMES_FA : MONTH_NAMES_EN
  const dowLabels = isFa ? DOW_FA : DOW_EN

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const handleDayClick = (dateStr: string) => {
    if (dateStr < today) return
    if (selecting === 'in') {
      onChange(dateStr, null)
      setSelecting('out')
    } else {
      if (checkIn && dateStr <= checkIn) {
        onChange(dateStr, null)
        setSelecting('out')
      } else {
        onChange(checkIn, dateStr)
        setSelecting('in')
      }
    }
  }

  const days = daysInMonth(viewYear, viewMonth)
  const firstDay = firstDayOfMonth(viewYear, viewMonth)

  const cells: (string | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: days }, (_, i) => {
      const d = new Date(viewYear, viewMonth, i + 1)
      return toDateStr(d)
    }),
  ]
  // Pad to complete grid
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="bg-white border border-stone rounded-xl shadow-lg p-4 w-full max-w-sm">
      {/* Header */}
      <div className={cn('flex items-center justify-between mb-4', isFa && 'flex-row-reverse')}>
        <button onClick={prevMonth} className="p-1.5 hover:bg-warm-ivory rounded-lg transition-colors" aria-label={isFa ? 'ماه قبل' : 'Previous month'}>
          {isFa ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <span className="text-sm font-semibold text-charcoal">
          {monthNames[viewMonth]}{' '}
          <span className="num" dir="ltr">{viewYear}</span>
        </span>
        <div className="flex items-center gap-1">
          <button onClick={nextMonth} className="p-1.5 hover:bg-warm-ivory rounded-lg transition-colors" aria-label={isFa ? 'ماه بعد' : 'Next month'}>
            {isFa ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1.5 hover:bg-warm-ivory rounded-lg transition-colors ms-2" aria-label={isFa ? 'بستن' : 'Close'}>
              <X size={14} className="text-warm-gray" />
            </button>
          )}
        </div>
      </div>

      {/* Prompt */}
      <p className={cn('text-caption text-warm-gray mb-3', isFa && 'text-end')}>
        {selecting === 'in'
          ? (isFa ? 'تاریخ ورود را انتخاب کنید' : 'Select check-in date')
          : (isFa ? 'تاریخ خروج را انتخاب کنید' : 'Select check-out date')}
      </p>

      {/* Day of week headers */}
      <div className={cn('grid grid-cols-7 mb-1', isFa && 'dir-rtl')}>
        {(isFa ? [...DOW_FA].reverse() : DOW_EN).map(d => (
          <div key={d} className="text-center text-caption text-warm-gray py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((dateStr, i) => {
          if (!dateStr) return <div key={`empty-${i}`} />

          const isPast = dateStr < today
          const isCheckIn = dateStr === checkIn
          const isCheckOut = dateStr === checkOut
          const isInRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut
          const isSelected = isCheckIn || isCheckOut
          const day = parseInt(dateStr.slice(-2))

          return (
            <button
              key={dateStr}
              onClick={() => handleDayClick(dateStr)}
              disabled={isPast}
              className={cn(
                'relative h-9 w-full text-sm rounded-lg transition-colors',
                isPast && 'text-stone cursor-not-allowed',
                !isPast && !isSelected && !isInRange && 'hover:bg-lootka-pine/10 text-charcoal',
                isSelected && 'bg-lootka-pine text-warm-ivory font-medium',
                isInRange && 'bg-lootka-pine/10 text-lootka-pine rounded-none',
                isCheckIn && checkOut && 'rounded-e-none',
                isCheckOut && checkIn && 'rounded-s-none',
              )}
              aria-label={dateStr}
              aria-pressed={isSelected}
              aria-disabled={isPast}
            >
              <span className="num" dir="ltr">{day}</span>
            </button>
          )
        })}
      </div>

      {/* Selected range summary */}
      {checkIn && (
        <div className={cn('mt-4 pt-4 border-t border-stone flex gap-4', isFa && 'flex-row-reverse')}>
          <div className={isFa ? 'text-end' : ''}>
            <div className="text-caption text-warm-gray">{isFa ? 'ورود' : 'Check-in'}</div>
            <div className="num text-sm font-medium text-charcoal" dir="ltr">{checkIn}</div>
          </div>
          {checkOut && (
            <>
              <div className="text-stone self-center">→</div>
              <div className={isFa ? 'text-end' : ''}>
                <div className="text-caption text-warm-gray">{isFa ? 'خروج' : 'Check-out'}</div>
                <div className="num text-sm font-medium text-charcoal" dir="ltr">{checkOut}</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
