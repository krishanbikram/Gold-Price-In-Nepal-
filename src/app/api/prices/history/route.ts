import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const type = searchParams.get('type') || 'gold'

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    if (type === 'silver') {
      const prices = await prisma.silverPrice.findMany({
        where: {
          date: { gte: startDate },
        },
        orderBy: { date: 'asc' },
        select: {
          date: true,
          silver_per_tola: true,
          silver_per_10g: true,
        },
      })

      return NextResponse.json(
        prices.map((p) => ({
          date: p.date,
          silver_per_tola: Number(p.silver_per_tola),
          silver_per_10g: Number(p.silver_per_10g),
        }))
      )
    }

    const prices = await prisma.goldPrice.findMany({
      where: {
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
      select: {
        date: true,
        price_per_tola: true,
        
        price_per_10g: true,
        
      },
    })

    return NextResponse.json(
      prices.map((p) => ({
        date: p.date,
        price_per_tola: Number(p.price_per_tola),
        
        price_per_10g: Number(p.price_per_10g),
        
      }))
    )
  } catch (error) {
    console.error('Error fetching price history:', error)
    return NextResponse.json({ error: 'Failed to fetch price history' }, { status: 500 })
  }
}
