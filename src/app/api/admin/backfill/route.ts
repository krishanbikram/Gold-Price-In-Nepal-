import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getNepaliDate } from '@/lib/utils'
import backfillData from '@/data/backfill-prices.json'

// One-time backfill import: FENEGOSIDA daily rates 2026-04-02 .. 2026-10-25
// (173 trading days missing from the DB). Session-protected and idempotent
// (upsert by date) — safe to call more than once. Remove this route and
// src/data/backfill-prices.json after the import has been verified.

const TOLA_TO_GRAM = 11.6638
const OUNCE_TO_GRAM = 31.1035

interface BackfillRow {
  date: string
  gold: number
  silver: number
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rows = backfillData as BackfillRow[]
    let imported = 0

    for (const row of rows) {
      const date = new Date(`${row.date}T00:00:00.000Z`)
      const nepali_date = getNepaliDate(date)

      const gold = Number(row.gold)
      const silver = Number(row.silver)

      await prisma.goldPrice.upsert({
        where: { date },
        update: {
          price_per_tola: gold,
          price_per_10g: Number(((gold * 10) / TOLA_TO_GRAM).toFixed(2)),
          price_per_ounce: Number(((gold * OUNCE_TO_GRAM) / TOLA_TO_GRAM).toFixed(2)),
          nepali_date,
          updated_at: new Date(),
        },
        create: {
          date,
          price_per_tola: gold,
          price_per_10g: Number(((gold * 10) / TOLA_TO_GRAM).toFixed(2)),
          price_per_ounce: Number(((gold * OUNCE_TO_GRAM) / TOLA_TO_GRAM).toFixed(2)),
          nepali_date,
        },
      })

      await prisma.silverPrice.upsert({
        where: { date },
        update: {
          silver_per_tola: silver,
          silver_per_10g: Number(((silver * 10) / TOLA_TO_GRAM).toFixed(2)),
          silver_per_ounce: Number(((silver * OUNCE_TO_GRAM) / TOLA_TO_GRAM).toFixed(2)),
          nepali_date,
          updated_at: new Date(),
        },
        create: {
          date,
          silver_per_tola: silver,
          silver_per_10g: Number(((silver * 10) / TOLA_TO_GRAM).toFixed(2)),
          silver_per_ounce: Number(((silver * OUNCE_TO_GRAM) / TOLA_TO_GRAM).toFixed(2)),
          nepali_date,
        },
      })

      imported++
    }

    revalidatePath('/')
    revalidatePath('/gold-price-history')
    revalidatePath('/silver-price-nepal')
    revalidatePath('/gold-price-today')

    const latest = await prisma.goldPrice.findFirst({ orderBy: { date: 'desc' } })
    const total = await prisma.goldPrice.count()

    return NextResponse.json({
      success: true,
      imported,
      total_gold_rows: total,
      latest_date: latest?.date,
      latest_gold_per_tola: latest ? Number(latest.price_per_tola) : null,
      latest_nepali_date: latest?.nepali_date ?? null,
    })
  } catch (error) {
    console.error('Backfill import error:', error)
    return NextResponse.json({ error: 'Backfill import failed' }, { status: 500 })
  }
}
