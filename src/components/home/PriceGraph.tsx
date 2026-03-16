'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatNumber, formatDateShort } from '@/lib/utils'

const TIME_RANGES = [
  { label: '7D', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
  { label: 'ALL', days: 3650 },
]

interface PriceData {
  date: string
  price_per_tola: number
  
}

interface SilverPriceData {
  date: string
  silver_per_tola: number
}

export function PriceGraph() {
  const [selectedRange, setSelectedRange] = useState(30)
  const [viewType, setViewType] = useState<'gold' | 'silver'>('gold')

  const { data: goldData, isLoading: goldLoading } = useQuery<PriceData[]>({
    queryKey: ['price-history', 'gold', selectedRange],
    queryFn: async () => {
      const res = await fetch(`/api/prices/history?days=${selectedRange}&type=gold`)
      return res.json()
    },
  })

  const { data: silverData, isLoading: silverLoading } = useQuery<SilverPriceData[]>({
    queryKey: ['price-history', 'silver', selectedRange],
    queryFn: async () => {
      const res = await fetch(`/api/prices/history?days=${selectedRange}&type=silver`)
      return res.json()
    },
    enabled: viewType === 'silver',
  })

  const isLoading = viewType === 'gold' ? goldLoading : silverLoading
  const chartData = viewType === 'gold' ? goldData : silverData

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card-dark p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold font-display text-white">
              {viewType === 'gold' ? 'Gold' : 'Silver'} Price History in Nepal
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Interactive chart showing price trends over time
            </p>
          </div>

          {/* Gold / Silver toggle */}
          <div className="flex items-center bg-navy-950 rounded-lg p-1 border border-navy-700">
            <button
              onClick={() => setViewType('gold')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewType === 'gold'
                  ? 'bg-gold-500 text-navy-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gold
            </button>
            <button
              onClick={() => setViewType('silver')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewType === 'silver'
                  ? 'bg-slate-400 text-navy-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Silver
            </button>
          </div>
        </div>

        {/* Time Range Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {TIME_RANGES.map((range) => (
            <button
              key={range.days}
              onClick={() => setSelectedRange(range.days)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedRange === range.days
                  ? 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/20'
                  : 'bg-navy-950 text-slate-400 hover:text-white border border-navy-700'
              }`}
            >
              {range.label}
            </button>
          ))}


        </div>

        {/* Chart */}
        <div className="h-[350px] sm:h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" />
            </div>
          ) : chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {viewType === 'gold' ? (
                <AreaChart data={chartData as PriceData[]}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => formatDateShort(v)}
                    stroke="#64748B"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    domain={['dataMin - 1000', 'dataMax + 1000']}
                    tickFormatter={(v) => `₨${(v / 1000).toFixed(0)}K`}
                    stroke="#64748B"
                    fontSize={12}
                    tickLine={false}
                    width={65}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '0.75rem',
                      fontSize: '0.875rem',
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [
                      `NPR ${formatNumber(Number(value))}`,
                      '24 Carat Gold',
                    ]}
                    labelFormatter={(label) => formatDateShort(label)}
                  />
                  <Legend
                    formatter={() => '24 Carat Gold'}
                  />
                  <Area
                    type="monotone"
                    dataKey="price_per_tola"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fill="url(#goldGradient)"
                    dot={false}
                  />
                </AreaChart>
              ) : (
                <AreaChart data={chartData as SilverPriceData[]}>
                  <defs>
                    <linearGradient id="silverGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => formatDateShort(v)}
                    stroke="#64748B"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    domain={['dataMin - 50', 'dataMax + 50']}
                    tickFormatter={(v) => `₨${formatNumber(v)}`}
                    stroke="#64748B"
                    fontSize={12}
                    tickLine={false}
                    width={75}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '0.75rem',
                      fontSize: '0.875rem',
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`NPR ${formatNumber(Number(value))}`, 'Silver']}
                    labelFormatter={(label) => formatDateShort(label)}
                  />
                  <Area
                    type="monotone"
                    dataKey="silver_per_tola"
                    stroke="#94A3B8"
                    strokeWidth={2}
                    fill="url(#silverGradient)"
                    dot={false}
                    activeDot={{ r: 5, stroke: '#94A3B8', strokeWidth: 2, fill: '#1E293B' }}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              No price data available for this range.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
