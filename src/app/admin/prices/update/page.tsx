'use client'

import { useState } from 'react'
import { formatNumber, getNepaliDate } from '@/lib/utils'

const TOLA_TO_GRAM = 11.6638
const OUNCE_TO_GRAM = 31.1035

export default function UpdatePricePage() {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [nepaliDate, setNepaliDate] = useState(getNepaliDate(today))
  const [price, setPrice] = useState('')
  const [silver, setSilver] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const priceNum = Number(price) || 0
  const silverNum = Number(silver) || 0

  const handleDateChange = (val: string) => {
    setDate(val)
    setNepaliDate(getNepaliDate(val))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          nepali_date: nepaliDate,
          price_per_tola: priceNum,
          silver_per_tola: silverNum,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Price updated! Site will reflect new rates immediately.' })
        setPrice('')
        setSilver('')
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update prices' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    }

    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-white mb-6">Update Today&apos;s Price</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="card-dark p-6 space-y-5">
          {message && (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                message.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-400 font-medium mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full bg-navy-950 border border-navy-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 font-medium mb-2">Nepali Date (BS)</label>
            <input
              type="text"
              value={nepaliDate}
              onChange={(e) => setNepaliDate(e.target.value)}
              placeholder="e.g. २०८१ चैत १ गते"
              className="w-full bg-navy-950 border border-navy-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            />
            <p className="text-[10px] text-slate-500 mt-1">Auto-calculated but can be manually edited if needed.</p>
          </div>

          <div>
            <label className="block text-sm text-slate-400 font-medium mb-2">
              24 Carat Gold per Tola (NPR) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="e.g. 165000"
              className="w-full bg-navy-950 border border-navy-700 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            />
            {priceNum > 0 && (
              <div className="text-xs text-slate-500 mt-1">
                Per 10g: NPR {formatNumber(Math.round((priceNum * 10) / TOLA_TO_GRAM))} | 
                Per Ounce: NPR {formatNumber(Math.round((priceNum * OUNCE_TO_GRAM) / TOLA_TO_GRAM))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-400 font-medium mb-2">
              Silver per Tola (NPR) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={silver}
              onChange={(e) => setSilver(e.target.value)}
              required
              placeholder="e.g. 2000"
              className="w-full bg-navy-950 border border-navy-700 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            />
            {silverNum > 0 && (
              <div className="text-xs text-slate-500 mt-1">
                Per 10g: NPR {formatNumber(Math.round((silverNum * 10) / TOLA_TO_GRAM))} | 
                Per Ounce: NPR {formatNumber(Math.round((silverNum * OUNCE_TO_GRAM) / TOLA_TO_GRAM))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-500 text-navy-950 py-3 rounded-lg font-semibold hover:bg-gold-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Price'}
          </button>
        </div>
      </form>
    </div>
  )
}
