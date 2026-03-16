import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const TOLA_TO_GRAM = 11.6638
const OUNCE_TO_GRAM = 31.1035

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { date, price_per_tola, silver_per_tola, nepali_date } = body

    if (!date || !price_per_tola || !silver_per_tola) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const hallmark = Number(price_per_tola)
    const silver = Number(silver_per_tola)

    // Auto-calculate derived values
    const price_per_10g = Number(((hallmark * 10) / TOLA_TO_GRAM).toFixed(2))
    const price_per_ounce = Number(((hallmark * OUNCE_TO_GRAM) / TOLA_TO_GRAM).toFixed(2))
    const silver_per_10g = Number(((silver * 10) / TOLA_TO_GRAM).toFixed(2))
    const silver_per_ounce = Number(((silver * OUNCE_TO_GRAM) / TOLA_TO_GRAM).toFixed(2))

    // Upsert gold price
    await prisma.goldPrice.upsert({
      where: { date: new Date(date) },
      update: {
        price_per_tola: hallmark,
        price_per_10g,
        price_per_ounce,
        nepali_date,
        updated_at: new Date(),
      },
      create: {
        date: new Date(date),
        price_per_tola: hallmark,
        price_per_10g,
        price_per_ounce,
        nepali_date,
      },
    })

    // Upsert silver price
    await prisma.silverPrice.upsert({
      where: { date: new Date(date) },
      update: {
        silver_per_tola: silver,
        silver_per_10g,
        silver_per_ounce,
        nepali_date,
        updated_at: new Date(),
      },
      create: {
        date: new Date(date),
        silver_per_tola: silver,
        silver_per_10g,
        silver_per_ounce,
        nepali_date,
      },
    })

    // Revalidate cached pages
    revalidatePath('/')
    revalidatePath('/gold-price-history')
    revalidatePath('/silver-price-nepal')

    return NextResponse.json({ success: true, message: 'Prices updated successfully' })
  } catch (error) {
    console.error('Error updating prices:', error)
    return NextResponse.json({ error: 'Failed to update prices' }, { status: 500 })
  }
}
