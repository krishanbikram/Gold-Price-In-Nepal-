import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatNumber, getNepaliDate } from '@/lib/utils'
import { PriceGraph } from '@/components/home/PriceGraph'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const silver = await prisma.silverPrice.findFirst({ orderBy: { date: 'desc' } })
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return {
    title: `Silver Price in Nepal Today ${silver?.nepali_date ? silver.nepali_date + ' ' : ''}(${today}) | Chandi Ko Bhaau | GoldPriceNP`,
    description: `Today's Silver Price in Nepal (Chandi Ko Bhaau): NPR ${
      silver ? formatNumber(Number(silver.silver_per_tola)) : ''
    }/tola. Check daily silver rates per 10g, ounce, and tola. Historical price charts from FENEGOSIDA.`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.goldpricenp.com'}/silver-price-nepal`,
    },
  }
}

export default async function SilverPricePage() {
  const silverPrices = await prisma.silverPrice.findMany({
    orderBy: { date: 'desc' },
    take: 2,
  })

  const today = silverPrices[0]
  const yesterday = silverPrices[1]
  const change = yesterday
    ? Number(today?.silver_per_tola) - Number(yesterday.silver_per_tola)
    : 0

  const historyPrices = await prisma.silverPrice.findMany({
    orderBy: { date: 'desc' },
    take: 90,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.NEXT_PUBLIC_SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Silver Price Nepal' },
            ],
          }),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-2">
            Silver Price in Nepal Today
          </h1>
          <p className="text-slate-400">चाँदीको मूल्य — Daily rates from FENEGOSIDA</p>
        </div>

        {/* Main Price Card */}
        {today && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="card-dark border-t-[3px] border-t-slate-400 p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-slate-500/10 rounded-full px-4 py-1.5 mb-4">
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                  <span className="text-silver text-xs font-semibold tracking-wider uppercase">Silver / Chandi</span>
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-white tabular-nums font-display">
                  NPR {formatNumber(Number(today.silver_per_tola))}
                  <span className="text-lg text-slate-400 font-normal ml-2">/tola</span>
                </div>
                <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full ${
                  change >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
                }`}>
                  <span className={`text-sm font-semibold ${
                    change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {change >= 0 ? '▲' : '▼'} NPR {formatNumber(Math.abs(Math.round(change)))}
                  </span>
                </div>
                <p className="mt-4 text-base font-semibold text-slate-200">
                  {today.nepali_date || getNepaliDate(today.date)}
                  <span className="text-slate-500 text-xs font-medium ml-2">
                    {today.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-navy-950/60 rounded-xl p-4 text-center">
                  <div className="text-xs text-slate-400 mb-1">Per Tola</div>
                  <div className="text-lg font-bold text-white tabular-nums">
                    NPR {formatNumber(Number(today.silver_per_tola))}
                  </div>
                </div>
                <div className="bg-navy-950/60 rounded-xl p-4 text-center">
                  <div className="text-xs text-slate-400 mb-1">Per 10 Gram</div>
                  <div className="text-lg font-bold text-white tabular-nums">
                    NPR {formatNumber(Number(today.silver_per_10g))}
                  </div>
                </div>
                <div className="bg-navy-950/60 rounded-xl p-4 text-center">
                  <div className="text-xs text-slate-400 mb-1">Per Ounce</div>
                  <div className="text-lg font-bold text-white tabular-nums">
                    NPR {formatNumber(Number(today.silver_per_ounce))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Price Chart */}
      <PriceGraph />

      {/* History Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="card-dark p-6">
          <h2 className="text-xl font-bold font-display text-white mb-4">Silver Price History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-950/60">
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold rounded-l-lg">Nepali Date (BS)</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold">Date (AD)</th>
                  <th className="text-right px-4 py-3 text-slate-400 font-semibold">Per Tola</th>
                  <th className="text-right px-4 py-3 text-slate-400 font-semibold">Per 10g</th>
                  <th className="text-right px-4 py-3 text-slate-400 font-semibold rounded-r-lg">Per Ounce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/50">
                {historyPrices.map((p) => (
                  <tr key={p.id} className="hover:bg-navy-950/30 transition-colors">
                    <td className="px-4 py-3 text-slate-200 font-medium">
                      {p.nepali_date || getNepaliDate(p.date)}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {p.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-right text-white font-medium tabular-nums">
                      NPR {formatNumber(Number(p.silver_per_tola))}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-300 tabular-nums">
                      NPR {formatNumber(Number(p.silver_per_10g))}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-300 tabular-nums">
                      NPR {formatNumber(Number(p.silver_per_ounce))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
