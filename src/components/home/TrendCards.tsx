'use client'

import { useQuery } from '@tanstack/react-query'
import { formatNumber, formatDateShort } from '@/lib/utils'

interface Stats {
  week_change: number
  week_change_percent: number
  month_change: number
  month_change_percent: number
  year_high: number
  year_high_date: string | null
  year_low: number
  year_low_date: string | null
}

export function TrendCards() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['price-stats'],
    queryFn: async () => {
      const res = await fetch('/api/prices/stats')
      return res.json()
    },
  })

  if (isLoading || !stats) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card-dark p-5 animate-pulse">
              <div className="h-4 bg-navy-700 rounded w-24 mb-3" />
              <div className="h-7 bg-navy-700 rounded w-32 mb-2" />
              <div className="h-3 bg-navy-700 rounded w-16" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  const cards = [
    {
      label: 'This Week Change',
      icon: '📊',
      value: stats.week_change,
      percent: stats.week_change_percent,
    },
    {
      label: 'This Month Change',
      icon: '📈',
      value: stats.month_change,
      percent: stats.month_change_percent,
    },
    {
      label: '52 Week High',
      icon: '🏆',
      value: stats.year_high,
      date: stats.year_high_date,
      isHighLow: true,
    },
    {
      label: '52 Week Low',
      icon: '📉',
      value: stats.year_low,
      date: stats.year_low_date,
      isHighLow: true,
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl font-bold font-display text-white mb-4">Price Trends</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stagger-children">
        {cards.map((card) => {
          const isUp = (card.value || 0) >= 0
          return (
            <div key={card.label} className="card-dark p-5 hover:border-gold-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{card.icon}</span>
                <span className="text-xs text-slate-400 font-medium">{card.label}</span>
              </div>

              {card.isHighLow ? (
                <>
                  <div className="text-xl font-bold text-white tabular-nums">
                    NPR {formatNumber(card.value)}
                  </div>
                  {card.date && (
                    <div className="text-xs text-slate-500 mt-1">
                      {formatDateShort(card.date)}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className={`text-xl font-bold tabular-nums ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                    {isUp ? '+' : ''}{formatNumber(card.value)} NPR
                  </div>
                  <div className={`text-xs font-medium mt-1 ${isUp ? 'text-green-400/70' : 'text-red-400/70'}`}>
                    {isUp ? '▲' : '▼'} {Math.abs(card.percent || 0).toFixed(2)}%
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
