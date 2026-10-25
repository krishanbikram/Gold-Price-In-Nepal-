'use client'

import { formatNumber, getNepaliDate, formatDateEN } from '@/lib/utils'

interface GoldData {
  price_tola: number
  
  price_10g: number
  price_ounce: number
  date: string
  nepali_date: string | null
  change_amount: number
  change_percent: number
}

export function HeroGoldCard({ gold }: { gold: GoldData }) {
  const isUp = gold.change_amount >= 0
  const changeColor = gold.change_amount === 0 ? 'text-slate-400' : isUp ? 'text-green-400' : 'text-red-400'
  const changeIcon = gold.change_amount === 0 ? '—' : isUp ? '▲' : '▼'
  const changeBg = gold.change_amount === 0 ? 'bg-slate-800' : isUp ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
  
  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gold-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gold-500/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-gold-400 font-medium text-sm tracking-wider uppercase mb-2">
            Today&apos;s Gold Price in Nepal
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white mb-2">
            Gold Price <span className="gold-gradient-text">Today</span>
          </h1>
          <div className="flex items-center justify-center gap-3">
            <time className="font-semibold text-base sm:text-lg text-gold-400">{gold.nepali_date || getNepaliDate(gold.date)}</time>
            <span className="text-navy-700">|</span>
            <span className="text-slate-500 text-xs font-medium">{formatDateEN(gold.date)}</span>
          </div>
        </div>

        {/* Main Price Card */}
        <div className="max-w-4xl mx-auto">
          <div className="card-dark gold-border-top gold-glow p-6 sm:p-8">
            {/* Top: Featured 24 Carat Gold Price */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gold-500/10 rounded-full px-4 py-1.5 mb-4">
                <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                <span className="text-gold-400 text-xs font-semibold tracking-wider uppercase">24 Carat Gold 24K Gold</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tabular-nums animate-count-up font-display">
                  NPR {formatNumber(gold.price_tola)}
                </span>
                <span className="text-slate-400 text-lg">/tola</span>
              </div>
              <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full border ${changeBg}`}>
                <span className={`text-sm font-semibold ${changeColor}`}>
                  {changeIcon} NPR {formatNumber(Math.abs(gold.change_amount))} ({Math.abs(gold.change_percent).toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* 2x2 Price Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <PriceBox
                label="24 Carat Gold"
                sublabel="Per Tola"
                price={gold.price_tola}
                change={gold.change_amount}
                highlight
              />
              <PriceBox
                label="24 Carat Gold"
                sublabel="Per 10 Gram"
                price={gold.price_10g}
                change={Math.round(gold.change_amount * 10 / 11.6638)}
              />
            </div>

            {/* Source disclaimer */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
              <span>Source: FENEGOSIDA (Federation of Nepal Gold & Silver Dealers Association)</span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Last Updated: Today
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PriceBox({
  label,
  sublabel,
  price,
  change,
  highlight = false,
}: {
  label: string
  sublabel: string
  price: number
  change: number
  highlight?: boolean
}) {
  const isUp = change >= 0
  const changeColor = change === 0 ? 'text-slate-500' : isUp ? 'text-green-400' : 'text-red-400'
  const icon = change === 0 ? '' : isUp ? '▲' : '▼'

  return (
    <div
      className={`rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] ${
        highlight
          ? 'bg-gold-500/10 border border-gold-500/20'
          : 'bg-navy-950/60 border border-navy-700/50'
      }`}
    >
      <div className="text-xs text-slate-400 font-medium">{label}</div>
      <div className="text-[10px] text-slate-500 mb-2">{sublabel}</div>
      <div className="text-lg sm:text-xl font-bold text-white tabular-nums">
        NPR {formatNumber(price)}
      </div>
      <div className={`text-xs font-medium mt-1 ${changeColor}`}>
        {icon} {formatNumber(Math.abs(change))}
      </div>
    </div>
  )
}
