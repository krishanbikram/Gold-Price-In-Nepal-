'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatNumber } from '@/lib/utils'

export default function AdminDashboardPage() {
  const [prices, setPrices] = useState<{
    gold: { price_tola: number; date: string; change_amount: number }
    silver: { tola: number; date: string; change_amount: number }
  } | null>(null)

  useEffect(() => {
    fetch('/api/prices/today')
      .then((r) => r.json())
      .then(setPrices)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-white mb-6">Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card-dark p-5">
          <div className="text-xs text-slate-400 mb-1">24 Carat Gold Today</div>
          <div className="text-2xl font-bold text-gold-400 tabular-nums">
            {prices ? `NPR ${formatNumber(prices.gold.price_tola)}` : '—'}
          </div>
          {prices && (
            <div className={`text-xs mt-1 ${prices.gold.change_amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {prices.gold.change_amount >= 0 ? '▲' : '▼'} {formatNumber(Math.abs(prices.gold.change_amount))}
            </div>
          )}
        </div>

        <div className="card-dark p-5">
          <div className="text-xs text-slate-400 mb-1">Silver Today</div>
          <div className="text-2xl font-bold text-silver tabular-nums">
            {prices ? `NPR ${formatNumber(prices.silver.tola)}` : '—'}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/prices/update"
          className="card-dark p-6 hover:border-gold-500/30 transition-colors group"
        >
          <div className="text-2xl mb-2">💰</div>
          <h2 className="text-lg font-semibold text-white group-hover:text-gold-400 transition-colors">
            Update Today&apos;s Price
          </h2>
          <p className="text-sm text-slate-400 mt-1">Set gold and silver prices for today</p>
        </Link>
        <Link
          href="/admin/blog/new"
          className="card-dark p-6 hover:border-gold-500/30 transition-colors group"
        >
          <div className="text-2xl mb-2">✏️</div>
          <h2 className="text-lg font-semibold text-white group-hover:text-gold-400 transition-colors">
            Write Blog Post
          </h2>
          <p className="text-sm text-slate-400 mt-1">Create a new article or guide</p>
        </Link>
      </div>
    </div>
  )
}
