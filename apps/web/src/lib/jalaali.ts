// Jalaali (Solar Hijri) calendar utilities using the built-in Intl API.
// Gregorian → Jalali uses Intl.DateTimeFormat (guaranteed correct).
// Jalali → Gregorian finds Nowruz with Intl, then adds day offset.

function persianToWestern(s: string): number {
  return parseInt(
    s.replace(/[۰-۹]/g, c => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))),
    10,
  )
}

const jalFmt = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  timeZone: 'Asia/Tehran',
})

/** Convert a Gregorian JS Date → Jalali { jy, jm, jd } */
export function dateToJalali(date: Date): { jy: number; jm: number; jd: number } {
  const parts = jalFmt.formatToParts(date)
  return {
    jy: persianToWestern(parts.find(p => p.type === 'year')?.value ?? '0'),
    jm: persianToWestern(parts.find(p => p.type === 'month')?.value ?? '0'),
    jd: persianToWestern(parts.find(p => p.type === 'day')?.value ?? '0'),
  }
}

// Cache: jalali year → Gregorian Date of 1 Farvardin
const nowruzCache: Record<number, Date> = {}

/** Find the Gregorian Date of 1 Farvardin (Nowruz) for a given Jalali year */
function nowruzDate(jy: number): Date {
  if (nowruzCache[jy]) return nowruzCache[jy]
  const approxGy = jy + 621
  // Nowruz is always between March 19 and March 24
  for (let gd = 18; gd <= 26; gd++) {
    const d = new Date(approxGy, 2, gd) // month index 2 = March
    const j = dateToJalali(d)
    if (j.jy === jy && j.jm === 1 && j.jd === 1) {
      nowruzCache[jy] = d
      return d
    }
  }
  throw new Error(`Cannot find Nowruz for Jalali year ${jy}`)
}

/** Convert Jalali { jy, jm, jd } → Gregorian JS Date */
export function jalaliToDate(jy: number, jm: number, jd: number): Date {
  const nowruz = nowruzDate(jy)
  // Days after Nowruz: months 1-6 have 31 days, months 7-11 have 30 days
  let offset = jd - 1
  if (jm <= 6) offset += (jm - 1) * 31
  else offset += 6 * 31 + (jm - 7) * 30
  const result = new Date(nowruz)
  result.setDate(result.getDate() + offset)
  return result
}

/** Number of days in a Jalali month */
export function jMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31
  if (jm <= 11) return 30
  // Month 12 (Esfand): 29 days normally, 30 in leap year
  // Check by seeing if day 30 maps back to the same month
  try {
    const d = jalaliToDate(jy, 12, 30)
    return dateToJalali(d).jm === 12 ? 30 : 29
  } catch {
    return 29
  }
}

/** Day-of-week for the 1st of a Jalali month (0=Sat … 6=Fri, Persian week) */
export function jFirstDow(jy: number, jm: number): number {
  const d = jalaliToDate(jy, jm, 1)
  const dow = d.getDay() // 0=Sun, 1=Mon … 6=Sat
  // Shift to Persian week: Saturday=0, Sunday=1, … Friday=6
  return (dow + 1) % 7
}
