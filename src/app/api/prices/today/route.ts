import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 3600 // ISR: revalidate every hour

export async function GET() {
  try {
    // Get today's and yesterday's prices
    const goldPrices = await prisma.goldPrice.findMany({
      orderBy: { date: 'desc' },
      take: 2,
    })

    const silverPrices = await prisma.silverPrice.findMany({
      orderBy: { date: 'desc' },
      take: 2,
    })

    const todayGold = goldPrices[0]
    const yesterdayGold = goldPrices[1]
    const todaySilver = silverPrices[0]
    const yesterdaySilver = silverPrices[1]

    if (!todayGold || !todaySilver) {
      return NextResponse.json({ error: 'No price data available' }, { status: 404 })
    }

    const goldChange = yesterdayGold
      ? Number(todayGold.price_per_tola) - Number(yesterdayGold.price_per_tola)
      : 0
    const goldChangePercent = yesterdayGold
      ? ((goldChange / Number(yesterdayGold.price_per_tola)) * 100)
      : 0

    const silverChange = yesterdaySilver
      ? Number(todaySilver.silver_per_tola) - Number(yesterdaySilver.silver_per_tola)
      : 0
    const silverChangePercent = yesterdaySilver
      ? ((silverChange / Number(yesterdaySilver.silver_per_tola)) * 100)
      : 0

    return NextResponse.json({
      gold: {
        price_tola: Number(todayGold.price_per_tola),
        price_10g: Number(todayGold.price_per_10g),
        price_ounce: Number(todayGold.price_per_ounce),
        date: todayGold.date,
        change_amount: Math.round(goldChange),
        change_percent: Number(goldChangePercent.toFixed(2)),
      },
      silver: {
        tola: Number(todaySilver.silver_per_tola),
        gram10: Number(todaySilver.silver_per_10g),
        ounce: Number(todaySilver.silver_per_ounce),
        date: todaySilver.date,
        change_amount: Math.round(silverChange),
        change_percent: Number(silverChangePercent.toFixed(2)),
      },
    })
  } catch (error) {
    console.error('Error fetching prices:', error)
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 })
  }
}
