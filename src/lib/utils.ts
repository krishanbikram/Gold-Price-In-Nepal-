import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { BS_MONTH_DAYS, BS_MONTH_NAMES_NP } from './bs-calendar'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Conversion constants
const TOLA_TO_GRAM = 11.6638
const OUNCE_TO_GRAM = 31.1035

export function tolaToGram(pricePerTola: number): number {
  return Number((pricePerTola / TOLA_TO_GRAM).toFixed(2))
}

export function tolaToPer10g(pricePerTola: number): number {
  return Number(((pricePerTola * 10) / TOLA_TO_GRAM).toFixed(2))
}

export function tolaToOunce(pricePerTola: number): number {
  return Number(((pricePerTola * OUNCE_TO_GRAM) / TOLA_TO_GRAM).toFixed(2))
}

export function formatNPR(amount: number): string {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('en-NP', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Nepali (BS) date conversion using the official BS calendar data
// in ./bs-calendar (anchor: 2000-01-01 BS = 1943-04-14 AD).
// The previous hand-rolled approximation (day + 15 / month + 8)
// produced wrong dates — e.g. it showed 2026-10-25 as
// "Kartik 10" instead of the correct Kartik 8, 2083.
const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९']

export function toNepaliDigits(num: number | string): string {
  return String(num).replace(/[0-9]/g, (d) => nepaliDigits[parseInt(d)])
}

const BS_EPOCH_UTC = Date.UTC(1943, 3, 14) // 2000-01-01 BS

export function getNepaliDate(targetDate?: Date | string): string {
  try {
    const raw = targetDate ? new Date(targetDate) : new Date()
    if (isNaN(raw.getTime())) return ''
    // Work on the UTC calendar day so the result never shifts
    // with the runtime timezone.
    const dayUtc = Date.UTC(raw.getUTCFullYear(), raw.getUTCMonth(), raw.getUTCDate())
    let days = Math.floor((dayUtc - BS_EPOCH_UTC) / 86400000)
    if (days < 0) return ''

    let year = 2000
    while (BS_MONTH_DAYS[year]) {
      const yearDays = BS_MONTH_DAYS[year].reduce((a, b) => a + b, 0)
      if (days < yearDays) break
      days -= yearDays
      year++
    }
    const months = BS_MONTH_DAYS[year]
    if (!months) return ''

    let month = 0
    while (month < 11 && days >= months[month]) {
      days -= months[month]
      month++
    }

    return `${toNepaliDigits(year)} ${BS_MONTH_NAMES_NP[month]} ${toNepaliDigits(days + 1)} गते`
  } catch {
    return ''
  }
}

export function formatDateEN(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateShort(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

export function getChangeIndicator(change: number): { color: string; icon: string; text: string } {
  if (change > 0) {
    return { color: 'text-green-500', icon: '▲', text: `+${formatNumber(change)}` }
  } else if (change < 0) {
    return { color: 'text-red-500', icon: '▼', text: `${formatNumber(change)}` }
  }
  return { color: 'text-slate-400', icon: '—', text: '0' }
}
