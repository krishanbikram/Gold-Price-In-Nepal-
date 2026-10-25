import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { HeroGoldCard } from '@/components/home/HeroGoldCard'
import { SilverCard } from '@/components/home/SilverCard'
import { PriceGraph } from '@/components/home/PriceGraph'
import { ComparisonTable } from '@/components/home/ComparisonTable'
import { TrendCards } from '@/components/home/TrendCards'
import { FAQSection, FAQSchema } from '@/components/home/FAQSection'
import { LatestBlogs } from '@/components/home/LatestBlogs'
import { WhatsAppShare } from '@/components/home/WhatsAppShare'
import { formatNumber, getNepaliDate } from '@/lib/utils'

export const revalidate = 3600 // ISR: revalidate every hour

async function getPriceData() {
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

  const goldChange = yesterdayGold
    ? Number(todayGold?.price_per_tola) - Number(yesterdayGold.price_per_tola)
    : 0
  const silverChange = yesterdaySilver
    ? Number(todaySilver?.silver_per_tola) - Number(yesterdaySilver.silver_per_tola)
    : 0

  return {
    gold: todayGold
      ? {
          price_tola: Number(todayGold.price_per_tola),
          
          price_10g: Number(todayGold.price_per_10g),
          
          price_ounce: Number(todayGold.price_per_ounce),
          date: todayGold.date.toISOString(),
          nepali_date: todayGold.nepali_date,
          change_amount: Math.round(goldChange),
          change_percent: yesterdayGold
            ? Number(((goldChange / Number(yesterdayGold.price_per_tola)) * 100).toFixed(2))
            : 0,
        }
      : null,
    silver: todaySilver
      ? {
          tola: Number(todaySilver.silver_per_tola),
          date: todaySilver.date.toISOString(),
          nepali_date: todaySilver.nepali_date,
          gram10: Number(todaySilver.silver_per_10g),
          ounce: Number(todaySilver.silver_per_ounce),
          change_amount: Math.round(silverChange),
          change_percent: yesterdaySilver
            ? Number(((silverChange / Number(yesterdaySilver.silver_per_tola)) * 100).toFixed(2))
            : 0,
        }
      : null,
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { gold } = await getPriceData()
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return {
    title: `Gold Price in Nepal Today ${gold?.nepali_date || getNepaliDate(gold?.date)} (${today}) | Suna Ko Bhaau | 24 Carat Gold Rate`,
    description: `Today's Gold Price in Nepal: 24 Carat Gold NPR ${
      gold ? formatNumber(gold.price_tola) : ''
    }/tola. Hallmark gold & silver rates updated daily by FENEGOSIDA. Suna Ko Bhaau in Nepali - goldpricenp.com`,
    alternates: {
      canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.goldpricenp.com',
    },
  }
}

export default async function HomePage() {
  const { gold, silver } = await getPriceData()

  if (!gold || !silver) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Gold Price Nepal</h1>
        <p className="text-slate-400">Price data is being loaded. Please check back shortly.</p>
      </div>
    )
  }

  return (
    <>
      <FAQSchema price={gold.price_tola} silverPrice={silver.tola} />

      {/* Hero Gold Price */}
      <HeroGoldCard gold={gold} />

      {/* WhatsApp Share */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center -mt-2 mb-4">
        <WhatsAppShare
          price={gold.price_tola}
          date={gold.date}
        />
      </div>

      {/* Silver Price */}
      <SilverCard silver={silver} />

      {/* Interactive Price Graph */}
      <PriceGraph />

      {/* Comparison Table */}
      <ComparisonTable
        data={{
          price_tola: gold.price_tola,
          
          silverTola: silver.tola,
        }}
      />

      {/* Trend Cards */}
      <TrendCards />

      {/* FAQ Section */}
      <FAQSection price={gold.price_tola} silverPrice={silver.tola} />

      {/* Latest Blog Posts */}
      <LatestBlogs />
    </>
  )
}
