'use client'

import { useEffect, useState } from 'react'
import { formatNumber, formatDateEN, getNepaliDate } from '@/lib/utils'

interface PriceEntry {
  date: string
  price_per_tola: number
  price_per_10g: number
}

export default function AdminPriceHistoryPage() {
  const [prices, setPrices] = useState<PriceEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/prices/history?days=365&type=gold')
      .then((r) => r.json())
      .then((data) => {
        setPrices(data.reverse())
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-white mb-6">Price History</h1>

      <div className="card-dark p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-950/60">
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold rounded-l-lg">Nepali Date (BS)</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold">Date (AD)</th>
                  <th className="text-right px-4 py-3 text-slate-400 font-semibold">24 Carat Gold/Tola</th>
                  <th className="text-right px-4 py-3 text-slate-400 font-semibold">24 Carat Gold/10g</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/50">
                {prices.map((p) => (
                  <tr key={p.date} className="hover:bg-navy-950/30 transition-colors">
                    <td className="px-4 py-3 text-slate-200 font-medium">{getNepaliDate(p.date)}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{formatDateEN(p.date)}</td>
                    <td className="px-4 py-3 text-right text-white font-medium tabular-nums">
                      NPR {formatNumber(p.price_per_tola)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-300 tabular-nums">
                      NPR {formatNumber(p.price_per_10g)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
