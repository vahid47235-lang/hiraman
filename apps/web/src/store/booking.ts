import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type BookingStep = 1 | 2 | 3 | 4 | 5

export type SelectedUnit = {
  id: string
  slug: string
  nameEn: string
  nameFa: string
  image: string
  pricePerNight: number // IRR
  hasPool: boolean
  capacity: number
}

export type AddOn = {
  id: string
  nameEn: string
  nameFa: string
  pricePerUnit: number // IRR
  quantity: number
  unit: 'per_night' | 'per_person' | 'per_stay' | 'per_day'
}

export type GuestInfo = {
  firstName: string
  lastName: string
  email: string
  phone: string
  specialRequests?: string
}

type BookingState = {
  step: BookingStep
  // Step 1
  checkIn: string | null
  checkOut: string | null
  adults: number
  children: number
  childrenAges: number[]
  requirePool: boolean
  // Step 2
  unit: SelectedUnit | null
  holdId: string | null
  holdExpiresAt: string | null
  sessionId: string
  // Step 3
  addOns: AddOn[]
  // Step 4
  guest: GuestInfo | null
  agreedToTerms: boolean
  couponCode: string | null
  couponDiscount: number // percentage 0–100
  // Step 5
  reservationNo: string | null
  paymentStatus: 'idle' | 'pending' | 'success' | 'failed'

  // Actions
  setStep: (step: BookingStep) => void
  setSearch: (params: {
    checkIn: string
    checkOut: string
    adults: number
    children: number
    childrenAges: number[]
    requirePool: boolean
  }) => void
  setUnit: (unit: SelectedUnit) => void
  setHold: (holdId: string, expiresAt: string) => void
  setAddOns: (addOns: AddOn[]) => void
  setGuestInfo: (guest: GuestInfo) => void
  setTerms: (v: boolean) => void
  setCoupon: (code: string | null, discount: number) => void
  setPaymentStatus: (status: BookingState['paymentStatus']) => void
  setConfirmed: (reservationNo: string) => void
  reset: () => void

  // Derived
  nights: () => number
  subtotal: () => number
  addOnsTotal: () => number
  grandTotal: () => number
}

const initialState = {
  step: 1 as BookingStep,
  checkIn: null,
  checkOut: null,
  adults: 2,
  children: 0,
  childrenAges: [] as number[],
  requirePool: false,
  unit: null,
  holdId: null,
  holdExpiresAt: null,
  sessionId: typeof crypto !== 'undefined' ? crypto.randomUUID() : '',
  addOns: [] as AddOn[],
  guest: null,
  agreedToTerms: false,
  couponCode: null,
  couponDiscount: 0,
  reservationNo: null,
  paymentStatus: 'idle' as const,
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ step }),

      setSearch: (params) => set({
        ...params,
        unit: null,
        holdId: null,
        holdExpiresAt: null,
        addOns: [],
        step: 1,
      }),

      setUnit: (unit) => set({ unit, addOns: [] }),

      setHold: (holdId, holdExpiresAt) => set({ holdId, holdExpiresAt }),

      setAddOns: (addOns) => set({ addOns }),

      setGuestInfo: (guest) => set({ guest }),

      setTerms: (agreedToTerms) => set({ agreedToTerms }),

      setCoupon: (couponCode, couponDiscount) => set({ couponCode, couponDiscount }),

      setPaymentStatus: (paymentStatus) => set({ paymentStatus }),

      setConfirmed: (reservationNo) => set({
        reservationNo,
        paymentStatus: 'success',
        step: 5,
        holdId: null,
        holdExpiresAt: null,
      }),

      reset: () => set({
        ...initialState,
        sessionId: typeof crypto !== 'undefined' ? crypto.randomUUID() : '',
      }),

      nights: () => {
        const { checkIn, checkOut } = get()
        if (!checkIn || !checkOut) return 0
        return Math.max(0, Math.round(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000
        ))
      },

      subtotal: () => {
        const { unit } = get()
        if (!unit) return 0
        return unit.pricePerNight * get().nights()
      },

      addOnsTotal: () => get().addOns.reduce((sum, a) => sum + a.pricePerUnit * a.quantity, 0),

      grandTotal: () => {
        const base = get().subtotal() + get().addOnsTotal()
        const { couponDiscount } = get()
        if (!couponDiscount) return base
        return Math.round(base * (1 - couponDiscount / 100))
      },
    }),
    {
      name: 'hiraban-booking',
      partialize: (s) => ({
        checkIn: s.checkIn,
        checkOut: s.checkOut,
        adults: s.adults,
        children: s.children,
        childrenAges: s.childrenAges,
        requirePool: s.requirePool,
        sessionId: s.sessionId,
      }),
    }
  )
)
