import { formatNumber } from '@/lib/utils'

interface ComparisonData {
  price_tola: number
  
  silverTola: number
}

const TOLA_TO_GRAM = 11.6638
const OUNCE_TO_GRAM = 31.1035

export function ComparisonTable({ data }: { data: ComparisonData }) {
  const rows = [
    {
      type: '24 Carat Gold',
      perTola: data.price_tola,
      per10g: (data.price_tola * 10) / TOLA_TO_GRAM,
      perGram: data.price_tola / TOLA_TO_GRAM,
      perOunce: (data.price_tola * OUNCE_TO_GRAM) / TOLA_TO_GRAM,
      accent: 'text-gold-400',
    },

    {
      type: 'Silver',
      perTola: data.silverTola,
      per10g: (data.silverTola * 10) / TOLA_TO_GRAM,
      perGram: data.silverTola / TOLA_TO_GRAM,
      perOunce: (data.silverTola * OUNCE_TO_GRAM) / TOLA_TO_GRAM,
      accent: 'text-silver',
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="card-dark p-6 sm:p-8">
        <h2 className="text-2xl font-bold font-display text-white mb-1">
          Gold Rate Comparison
        </h2>
        <p className="text-sm text-slate-400 mb-6">Tola, Gram, and Ounce — auto-calculated</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-950/60">
                <th className="text-left px-4 py-3 text-slate-400 font-semibold rounded-l-lg">Type</th>
                <th className="text-right px-4 py-3 text-slate-400 font-semibold">Per Tola</th>
                <th className="text-right px-4 py-3 text-slate-400 font-semibold">Per 10g</th>
                <th className="text-right px-4 py-3 text-slate-400 font-semibold">Per Gram</th>
                <th className="text-right px-4 py-3 text-slate-400 font-semibold rounded-r-lg">Per Ounce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/50">
              {rows.map((row) => (
                <tr key={row.type} className="hover:bg-navy-950/30 transition-colors">
                  <td className={`px-4 py-4 font-semibold ${row.accent}`}>{row.type}</td>
                  <td className="text-right px-4 py-4 text-white font-medium tabular-nums">
                    NPR {formatNumber(row.perTola)}
                  </td>
                  <td className="text-right px-4 py-4 text-slate-300 tabular-nums">
                    NPR {formatNumber(Math.round(row.per10g))}
                  </td>
                  <td className="text-right px-4 py-4 text-slate-300 tabular-nums">
                    NPR {formatNumber(Math.round(row.perGram))}
                  </td>
                  <td className="text-right px-4 py-4 text-slate-300 tabular-nums">
                    NPR {formatNumber(Math.round(row.perOunce))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-500 mt-4">
          * 1 Tola = 11.6638 grams | 1 Troy Ounce = 31.1035 grams
        </p>
      </div>
    </section>
  )
}
