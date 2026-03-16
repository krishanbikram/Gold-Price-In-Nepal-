import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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

// Nepali date conversion (approximate BS dates)
const nepaliMonths = [
  'बैशाख', 'जेठ', 'असार', 'श्रावण', 'भदौ', 'असोज',
  'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फाल्गुण', 'चैत्र'
]

const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९']

export function toNepaliDigits(num: number | string): string {
  return String(num).replace(/[0-9]/g, (d) => nepaliDigits[parseInt(d)])
}

export function getNepaliDate(targetDate?: Date | string): string {
  // Approximate BS date calculation (simplified)
  const date = targetDate ? new Date(targetDate) : new Date()
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  
  // Approximate BS year (AD + 56.7 years)
  // More accurate offset: April 13/14 is usually the start of the Nepali year
  let bsYear = year + 56
  let bsMonth = month + 8 // Offset from Jan (approx mid-April is Baisakh)
  let bsDay = day + 15
  
  if (bsMonth > 11) {
    bsMonth -= 12
    bsYear += 1
  }

  if (bsDay > 30) {
    bsDay -= 30
    bsMonth += 1
  }
  
  if (bsMonth > 11) {
    bsMonth -= 12
    bsYear += 1
  }

  return `${toNepaliDigits(bsYear)} ${nepaliMonths[bsMonth]} ${toNepaliDigits(bsDay)} गते`
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
