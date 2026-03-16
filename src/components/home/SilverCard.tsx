'use client'

import { formatNumber } from '@/lib/utils'

interface SilverData {
  tola: number
  gram10: number
  ounce: number
  date: string
  nepali_date: string | null
  change_amount: number
  change_percent: number
}

export function SilverCard({ silver }: { silver: SilverData }) {
  const isUp = silver.change_amount >= 0
  const changeColor = silver.change_amount === 0 ? 'text-slate-400' : isUp ? 'text-green-400' : 'text-red-400'
  const changeIcon = silver.change_amount === 0 ? '—' : isUp ? '▲' : '▼'
  const changeBg = silver.change_amount === 0 ? 'bg-slate-800/50' : isUp ? 'bg-green-500/10' : 'bg-red-500/10'

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="card-dark border-t-[3px] border-t-slate-400 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Silver header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-slate-600/30 flex items-center justify-center">
                <span className="text-silver text-sm font-bold">Ag</span>
              </div>
              <h2 className="text-xl font-bold font-display text-white">Silver Price Today</h2>
            </div>
            <p className="text-sm text-slate-400">चाँदीको मूल्य</p>
          </div>

          {/* Change indicator */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${changeBg}`}>
            <span className={`text-sm font-semibold ${changeColor}`}>
              {changeIcon} NPR {formatNumber(Math.abs(silver.change_amount))} ({Math.abs(silver.change_percent).toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Silver price grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <SilverPriceBox label="Per Tola" price={silver.tola} />
          <SilverPriceBox label="Per 10 Gram" price={silver.gram10} />
          <SilverPriceBox label="Per Ounce" price={silver.ounce} />
        </div>
      </div>
    </section>
  )
}

function SilverPriceBox({ label, price }: { label: string; price: number }) {
  return (
    <div className="bg-navy-950/60 rounded-xl p-4 border border-navy-700/50 hover:border-slate-500/30 transition-colors">
      <div className="text-xs text-slate-400 font-medium mb-1">{label}</div>
      <div className="text-xl font-bold text-white tabular-nums">
        NPR {formatNumber(price)}
      </div>
    </div>
  )
}
