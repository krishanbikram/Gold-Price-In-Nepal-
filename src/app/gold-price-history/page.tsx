import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { PriceGraph } from '@/components/home/PriceGraph'
import { HistoryTable } from '@/components/history/HistoryTable'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Gold Price History in Nepal | Daily Rate Archive | GoldPriceNP',
  description:
    'Complete archive of daily Gold Price in Nepal. View 24 Carat Gold rates with interactive charts, Nepali date (BS), date filters, and CSV download. Historical data from FENEGOSIDA.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.goldpricenp.com'}/gold-price-history`,
  },
}

export default async function GoldPriceHistoryPage() {
  const prices = await prisma.goldPrice.findMany({
    select: {
      date: true,
      price_per_tola: true,
      price_per_10g: true,
      nepali_date: true,
    },
    orderBy: { date: 'desc' },
    take: 365,
  })

  const formattedPrices = prices.map((p, i) => {
    const prev = prices[i + 1]
    const change = prev
      ? Number(p.price_per_tola) - Number(prev.price_per_tola)
      : 0

    return {
      date: p.date.toISOString(),
      nepali_date: p.nepali_date,
      price_per_tola: Number(p.price_per_tola),
      price_per_10g: Number(p.price_per_10g),
      change: Math.round(change),
    }
  })

  return (
    <>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.NEXT_PUBLIC_SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Gold Price History' },
            ],
          }),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-2">
            Gold Price History in Nepal
          </h1>
          <p className="text-slate-400">
            Daily archive of 24 Carat Gold rates set by FENEGOSIDA
          </p>
        </div>
      </div>

      {/* Price Chart */}
      <PriceGraph />

      {/* History Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <HistoryTable prices={formattedPrices} />
      </div>
    </>
  )
}
