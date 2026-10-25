import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getNepaliDate } from '@/lib/utils'
import backfillRows from '@/data/backfill-prices.json'

// One-time bulk import of the missing FENEGOSIDA daily rates
// (2026-04-02 .. 2026-10-25). Admin-session protected and
// idempotent: createMany + skipDuplicates inserts only the
// dates that are still missing, so re-running it after the
// first (partially completed) run safely fills the gap.
// Remove this route and src/data/backfill-prices.json once
// the import has been verified.
export const dynamic = 'force-dynamic'
export const maxDuration = 60

interface BackfillRow {
  date: string
  gold: number
  silver: number
}

const TOLA_GRAMS = 11.6638
const OUNCE_GRAMS = 31.1035

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = backfillRows as BackfillRow[]

  const goldData = rows.map((row) => {
    const perTola = row.gold
    return {
      date: new Date(`${row.date}T00:00:00.000Z`),
      nepali_date: getNepaliDate(row.date),
      price_per_tola: perTola,
      price_per_10g: Math.round(((perTola * 10) / TOLA_GRAMS) * 100) / 100,
      price_per_ounce:
        Math.round(((perTola * OUNCE_GRAMS) / TOLA_GRAMS) * 100) / 100,
    }
  })

  const silverData = rows.map((row) => {
    const perTola = row.silver
    return {
      date: new Date(`${row.date}T00:00:00.000Z`),
      nepali_date: getNepaliDate(row.date),
      silver_per_tola: perTola,
      silver_per_10g: Math.round(((perTola * 10) / TOLA_GRAMS) * 100) / 100,
      silver_per_ounce:
        Math.round(((perTola * OUNCE_GRAMS) / TOLA_GRAMS) * 100) / 100,
    }
  })

  const goldResult = await prisma.goldPrice.createMany({
    data: goldData,
    skipDuplicates: true,
  })
  const silverResult = await prisma.silverPrice.createMany({
    data: silverData,
    skipDuplicates: true,
  })

  const totalGold = await prisma.goldPrice.count()
  const latest = await prisma.goldPrice.findFirst({
    orderBy: { date: 'desc' },
  })

  revalidatePath('/')
  revalidatePath('/gold-price-history')
  revalidatePath('/silver-price-nepal')
  revalidatePath('/gold-price-today')

  return NextResponse.json({
    success: true,
    gold_inserted: goldResult.count,
    silver_inserted: silverResult.count,
    dataset_rows: rows.length,
    total_gold_rows: totalGold,
    latest_date: latest?.date ?? null,
    latest_gold_per_tola: latest ? Number(latest.price_per_tola) : null,
    latest_nepali_date: latest?.nepali_date ?? null,
  })
}
