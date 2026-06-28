'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { dateToJalali, jalaliToDate, jMonthLength, jFirstDow } from '@/lib/jalaali'

type Props = {
  locale: string
  checkIn: string | null
  checkOut: string | null
  onChange: (checkIn: string | null, checkOut: string | null) => void
  onClose?: () => void
}

// ─── helpers ────────────────────────────────────────────────────────────────

function toIso(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function todayIso(): string {
  return toIso(new Date())
}

function toPersian(n: number): string {
  return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d])
}

// ─── constants ───────────────────────────────────────────────────────────────

const MONTH_FA = [
  'فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور',
  'مهر','آبان','آذر','دی','بهمن','اسفند',
]
const MONTH_EN = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DOW_FA = ['ش','ی','د','س','چ','پ','ج'] // Sat→Fri
const DOW_EN = ['Su','Mo','Tu','We','Th','Fr','Sa']

// ─── Gregorian helpers ───────────────────────────────────────────────────────

function gregDaysInMonth(y: number, m: number) {
  return new Date(y, m, 0).getDate()
}
function gregFirstDow(y: number, m: number) {
  return new Date(y, m - 1, 1).getDay() // 0=Sun
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DatePicker({ locale, checkIn, checkOut, onChange, onClose }: Props) {
  const isFa = locale === 'fa'
  const today = todayIso()

  // Jalali view state — initialise from checkIn or today
  const initJ = checkIn
    ? dateToJalali(new Date(checkIn))
    : dateToJalali(new Date())
  const [jViewYear, setJViewYear] = useState(initJ.jy)
  const [jViewMonth, setJViewMonth] = useState(initJ.jm)

  // Gregorian view state
  const initD = checkIn ? new Date(checkIn) : new Date()
  const [gViewYear, setGViewYear] = useState(initD.getFullYear())
  const [gViewMonth, setGViewMonth] = useState(initD.getMonth() + 1)

  const [selecting, setSelecting] = useState<'in' | 'out'>(checkIn ? 'out' : 'in')

  // ── navigation ──
  const prevMonth = () => {
    if (isFa) {
      if (jViewMonth === 1) { setJViewYear(y => y - 1); setJViewMonth(12) }
      else setJViewMonth(m => m - 1)
    } else {
      if (gViewMonth === 1) { setGViewYear(y => y - 1); setGViewMonth(12) }
      else setGViewMonth(m => m - 1)
    }
  }
  const nextMonth = () => {
    if (isFa) {
      if (jViewMonth === 12) { setJViewYear(y => y + 1); setJViewMonth(1) }
      else setJViewMonth(m => m + 1)
    } else {
      if (gViewMonth === 12) { setGViewYear(y => y + 1); setGViewMonth(1) }
      else setGViewMonth(m => m + 1)
    }
  }

  // ── day click ──
  const handleDayClick = (iso: string) => {
    if (iso < today) return
    if (selecting === 'in') {
      onChange(iso, null)
      setSelecting('out')
    } else {
      if (checkIn && iso <= checkIn) {
        onChange(iso, null)
        setSelecting('out')
      } else {
        onChange(checkIn, iso)
        setSelecting('in')
      }
    }
  }

  // ── build grid ──
  type Cell = { iso: string; label: string } | null
  let cells: Cell[]
  let dowLabels: string[]
  let headerText: string

  if (isFa) {
    const days = jMonthLength(jViewYear, jViewMonth)
    const firstDow = jFirstDow(jViewYear, jViewMonth)
    dowLabels = DOW_FA
    headerText = `${MONTH_FA[jViewMonth - 1]} ${toPersian(jViewYear)}`

    cells = [
      ...Array<null>(firstDow).fill(null),
      ...Array.from({ length: days }, (_, i) => {
        const jd = i + 1
        const gDate = jalaliToDate(jViewYear, jViewMonth, jd)
        return { iso: toIso(gDate), label: toPersian(jd) }
      }),
    ]
  } else {
    const days = gregDaysInMonth(gViewYear, gViewMonth)
    const firstDow = gregFirstDow(gViewYear, gViewMonth)
    dowLabels = DOW_EN
    headerText = `${MONTH_EN[gViewMonth - 1]} ${gViewYear}`

    cells = [
      ...Array<null>(firstDow).fill(null),
      ...Array.from({ length: days }, (_, i) => {
        const d = new Date(gViewYear, gViewMonth - 1, i + 1)
        return { iso: toIso(d), label: String(i + 1) }
      }),
    ]
  }
  while (cells.length % 7 !== 0) cells.push(null)

  // ── format display date ──
  const formatDisplay = (iso: string) => {
    if (isFa) {
      const j = dateToJalali(new Date(iso))
      return `${toPersian(j.jd)} ${MONTH_FA[j.jm - 1]} ${toPersian(j.jy)}`
    }
    const [y, m, d] = iso.split('-').map(Number)
    return `${d} ${MONTH_EN[m - 1]} ${y}`
  }

  return (
    <div className="bg-[#111111] border border-white/10 rounded-xl shadow-2xl p-4 w-full max-w-sm">
      {/* Header */}
      <div className={cn('flex items-center justify-between mb-4', isFa && 'flex-row-reverse')}>
        {/* In RTL: right arrow = go to previous month */}
        <button
          onClick={isFa ? nextMonth : prevMonth}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          aria-label={isFa ? 'ماه قبل' : 'Previous month'}
        >
          <ChevronRight size={16} />
        </button>

        <span className="text-sm font-semibold text-white">{headerText}</span>

        <div className="flex items-center gap-1">
          <button
            onClick={isFa ? prevMonth : nextMonth}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={isFa ? 'ماه بعد' : 'Next month'}
          >
            <ChevronLeft size={16} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors ms-2"
              aria-label={isFa ? 'بستن' : 'Close'}
            >
              <X size={14} className="text-white/40" />
            </button>
          )}
        </div>
      </div>

      {/* Prompt */}
      <p className={cn('text-caption text-white/40 mb-3', isFa && 'text-end')}>
        {selecting === 'in'
          ? (isFa ? 'تاریخ ورود را انتخاب کنید' : 'Select check-in date')
          : (isFa ? 'تاریخ خروج را انتخاب کنید' : 'Select check-out date')}
      </p>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {dowLabels.map(d => (
          <div key={d} className="text-center text-caption text-white/40 py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((cell, i) => {
          if (!cell) return <div key={`empty-${i}`} />
          const { iso, label } = cell
          const isPast = iso < today
          const isCheckIn = iso === checkIn
          const isCheckOut = iso === checkOut
          const isInRange = !!(checkIn && checkOut && iso > checkIn && iso < checkOut)
          const isSelected = isCheckIn || isCheckOut

          return (
            <button
              key={iso}
              onClick={() => handleDayClick(iso)}
              disabled={isPast}
              className={cn(
                'h-9 w-full text-sm rounded-lg transition-colors',
                isPast && 'text-stone cursor-not-allowed',
                !isPast && !isSelected && !isInRange && 'hover:bg-white/10 text-white',
                isSelected && "bg-white text-black font-medium",
                isInRange && "bg-white/10 text-white rounded-none",
                isCheckIn && checkOut && 'rounded-e-none',
                isCheckOut && checkIn && 'rounded-s-none',
              )}
              aria-label={iso}
              aria-pressed={isSelected}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Selected range summary */}
      {checkIn && (
        <div className={cn('mt-4 pt-4 border-t border-white/10 flex gap-4', isFa && 'flex-row-reverse')}>
          <div className={isFa ? 'text-end' : ''}>
            <div className="text-caption text-white/40">{isFa ? 'ورود' : 'Check-in'}</div>
            <div className="text-sm font-medium text-white">{formatDisplay(checkIn)}</div>
          </div>
          {checkOut && (
            <>
              <div className="text-stone self-center">{isFa ? '←' : '→'}</div>
              <div className={isFa ? 'text-end' : ''}>
                <div className="text-caption text-white/40">{isFa ? 'خروج' : 'Check-out'}</div>
                <div className="text-sm font-medium text-white">{formatDisplay(checkOut)}</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
