import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const monthAgo = new Date(now)
    monthAgo.setDate(monthAgo.getDate() - 30)
    const yearAgo = new Date(now)
    yearAgo.setFullYear(yearAgo.getFullYear() - 1)

    // Get latest price
    const latest = await prisma.goldPrice.findFirst({
      orderBy: { date: 'desc' },
    })

    // Get price from ~7 days ago
    const weekOld = await prisma.goldPrice.findFirst({
      where: { date: { lte: weekAgo } },
      orderBy: { date: 'desc' },
    })

    // Get price from ~30 days ago
    const monthOld = await prisma.goldPrice.findFirst({
      where: { date: { lte: monthAgo } },
      orderBy: { date: 'desc' },
    })

    // Get 52-week high and low
    const yearHigh = await prisma.goldPrice.findFirst({
      where: { date: { gte: yearAgo } },
      orderBy: { price_per_tola: 'desc' },
    })

    const yearLow = await prisma.goldPrice.findFirst({
      where: { date: { gte: yearAgo } },
      orderBy: { price_per_tola: 'asc' },
    })

    if (!latest) {
      return NextResponse.json({ error: 'No data available' }, { status: 404 })
    }

    const latestPrice = Number(latest.price_per_tola)
    const weekChange = weekOld ? latestPrice - Number(weekOld.price_per_tola) : 0
    const monthChange = monthOld ? latestPrice - Number(monthOld.price_per_tola) : 0

    return NextResponse.json({
      week_change: Math.round(weekChange),
      week_change_percent: weekOld
        ? Number(((weekChange / Number(weekOld.price_per_tola)) * 100).toFixed(2))
        : 0,
      month_change: Math.round(monthChange),
      month_change_percent: monthOld
        ? Number(((monthChange / Number(monthOld.price_per_tola)) * 100).toFixed(2))
        : 0,
      year_high: yearHigh ? Number(yearHigh.price_per_tola) : 0,
      year_high_date: yearHigh?.date || null,
      year_low: yearLow ? Number(yearLow.price_per_tola) : 0,
      year_low_date: yearLow?.date || null,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
