'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatNumber } from '@/lib/utils'
import { SITE_URL } from '@/lib/site'

const TOLA_TO_GRAM = 11.6638
const OUNCE_TO_GRAM = 31.1035

export default function GoldCalculatorPage() {
  const [weight, setWeight] = useState<string>('1')
  const [unit, setUnit] = useState<'tola' | 'gram' | 'ounce'>('tola')
  const [purity, setPurity] = useState<'24k' | '18k'>('24k')
  const [makingCharge, setMakingCharge] = useState<string>('12')

  const { data: prices } = useQuery({
    queryKey: ['prices-today'],
    queryFn: async () => {
      const res = await fetch('/api/prices/today')
      return res.json()
    },
  })

  const goldPrice = prices?.gold
  if (!goldPrice) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full mx-auto" />
      </div>
    )
  }

  // Get base price per tola based on purity
  const basePricePerTola = purity === '24k'
    ? goldPrice.price_tola
    : goldPrice.price_tola * (18 / 24) // 18K approximation

  // Convert weight to tola for calculation
  const weightInTola = unit === 'tola'
    ? Number(weight)
    : unit === 'gram'
    ? Number(weight) / TOLA_TO_GRAM
    : (Number(weight) * OUNCE_TO_GRAM) / TOLA_TO_GRAM

  const goldValue = weightInTola * basePricePerTola
  const makingChargeAmount = goldValue * (Number(makingCharge) / 100)
  const totalEstimate = goldValue + makingChargeAmount

  // Buy/sell spread
  const buyPrice = totalEstimate
  const sellPrice = goldValue * 0.97 // ~3% below gold value

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Gold Calculator' },
            ],
          }),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-2">
            Gold Price Calculator Nepal
          </h1>
          <p className="text-slate-400">Calculate gold value based on weight, purity, and today&apos;s rate</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="card-dark gold-border-top p-6 sm:p-8">
            {/* Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Weight */}
              <div>
                <label className="block text-sm text-slate-400 font-medium mb-2">Weight</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full bg-navy-950 border border-navy-700 rounded-lg px-4 py-3 text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm text-slate-400 font-medium mb-2">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as 'tola' | 'gram' | 'ounce')}
                  className="w-full bg-navy-950 border border-navy-700 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                >
                  <option value="tola">Tola</option>
                  <option value="gram">Gram</option>
                  <option value="ounce">Troy Ounce</option>
                </select>
              </div>

              {/* Purity */}
              <div>
                <label className="block text-sm text-slate-400 font-medium mb-2">Purity</label>
                <select
                  value={purity}
                  onChange={(e) => setPurity(e.target.value as '24k' | '18k')}
                  className="w-full bg-navy-950 border border-navy-700 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                >
                  <option value="24k">24K (24 Carat Gold)</option>
                  <option value="18k">18K</option>
                </select>
              </div>
            </div>

            {/* Making Charge */}
            <div className="mb-8">
              <label className="block text-sm text-slate-400 font-medium mb-2">
                Making Charge: {makingCharge}%
              </label>
              <input
                type="range"
                min="0"
                max="25"
                value={makingCharge}
                onChange={(e) => setMakingCharge(e.target.value)}
                className="w-full accent-gold-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0%</span>
                <span>25%</span>
              </div>
            </div>

            {/* Results */}
            <div className="bg-navy-950/60 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Gold Value</span>
                <span className="text-xl font-bold text-white tabular-nums">
                  NPR {formatNumber(Math.round(goldValue))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Making Charge ({makingCharge}%)</span>
                <span className="text-lg text-slate-300 tabular-nums">
                  + NPR {formatNumber(Math.round(makingChargeAmount))}
                </span>
              </div>
              <div className="border-t border-navy-700 pt-4 flex items-center justify-between">
                <span className="text-gold-400 font-semibold">Estimated Total</span>
                <span className="text-2xl font-bold text-gold-400 tabular-nums">
                  NPR {formatNumber(Math.round(totalEstimate))}
                </span>
              </div>
            </div>

            {/* Buy/Sell Spread */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-navy-950/60 rounded-xl p-4 text-center">
                <div className="text-xs text-slate-400 mb-1">Estimated Buy Price</div>
                <div className="text-lg font-bold text-green-400 tabular-nums">
                  NPR {formatNumber(Math.round(buyPrice))}
                </div>
                <div className="text-xs text-slate-500">Including making charges</div>
              </div>
              <div className="bg-navy-950/60 rounded-xl p-4 text-center">
                <div className="text-xs text-slate-400 mb-1">Estimated Sell Price</div>
                <div className="text-lg font-bold text-red-400 tabular-nums">
                  NPR {formatNumber(Math.round(sellPrice))}
                </div>
                <div className="text-xs text-slate-500">~3% below gold value</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-4 text-center">
              * Estimates only. Actual prices may vary by jeweller. Making charges range 8-20% depending on design complexity.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
