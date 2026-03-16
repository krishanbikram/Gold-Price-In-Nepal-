'use client'

import { useState, useMemo } from 'react'
import { formatNumber, formatDateEN, getNepaliDate } from '@/lib/utils'

interface PriceRow {
  date: string
  nepali_date?: string | null
  price_per_tola: number
  price_per_10g: number
  change: number
}

export function HistoryTable({ prices }: { prices: PriceRow[] }) {
  const [searchDate, setSearchDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 30

  const filtered = useMemo(() => {
    if (!searchDate) return prices
    return prices.filter((p) => {
      const d = new Date(p.date).toISOString().split('T')[0]
      return d >= searchDate
    })
  }, [prices, searchDate])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const downloadCSV = () => {
    const headers = ['Date', '24 Carat Gold/Tola', '24 Carat Gold/10g', 'Daily Change']
    const rows = filtered.map((p) => [
      new Date(p.date).toISOString().split('T')[0],
      p.price_per_tola,
      p.price_per_10g,
      p.change,
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'gold-prices-nepal.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="card-dark p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold font-display text-white">Daily Price Records</h2>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={searchDate}
            onChange={(e) => {
              setSearchDate(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-navy-950 border border-navy-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            placeholder="Filter from date"
          />
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-gold-500 text-navy-950 rounded-lg text-sm font-semibold hover:bg-gold-400 transition-colors"
          >
            ↓ CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy-950/60">
              <th className="text-left px-4 py-3 text-slate-400 font-semibold rounded-l-lg">Date (AD)</th>
              <th className="text-left px-4 py-3 text-slate-400 font-semibold">Nepali Date (BS)</th>
              <th className="text-right px-4 py-3 text-slate-400 font-semibold">24 Carat Gold/Tola</th>
              <th className="text-right px-4 py-3 text-slate-400 font-semibold">24 Carat Gold/10g</th>
              <th className="text-right px-4 py-3 text-slate-400 font-semibold rounded-r-lg">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-700/50">
            {paginated.map((p) => {
              const isUp = p.change > 0
              const isDown = p.change < 0
              return (
                <tr key={p.date} className="hover:bg-navy-950/30 transition-colors">
                  <td className="px-4 py-3 text-slate-300">{formatDateEN(p.date)}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {p.nepali_date || getNepaliDate(p.date)}
                  </td>
                  <td className="px-4 py-3 text-right text-white font-medium tabular-nums">
                    NPR {formatNumber(p.price_per_tola)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-300 tabular-nums">
                    NPR {formatNumber(p.price_per_10g)}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium tabular-nums ${
                    isUp ? 'text-green-400' : isDown ? 'text-red-400' : 'text-slate-500'
                  }`}>
                    {isUp ? '▲' : isDown ? '▼' : '—'} {formatNumber(Math.abs(p.change))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <span className="text-sm text-slate-400">
            Page {currentPage} of {totalPages} ({filtered.length} records)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-navy-950 border border-navy-700 rounded-lg text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-navy-800 transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-navy-950 border border-navy-700 rounded-lg text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-navy-800 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
