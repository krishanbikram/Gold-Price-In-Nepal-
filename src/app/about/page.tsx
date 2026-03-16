import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About GoldPriceNP | Nepal Gold & Silver Price Tracker',
  description: 'Learn about GoldPriceNP.com — Nepal\'s most accurate gold and silver price tracker. Check Suna Ko Bhaau, data source (FENEGOSIDA), our mission, and what we offer.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.goldpricenp.com'}/about`,
  },
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-6">
        About Gold Price Nepal
      </h1>

      <div className="space-y-8 text-slate-300 leading-relaxed">
        <div className="card-dark p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-3">Our Mission</h2>
          <p>
            Gold Price Nepal is dedicated to providing the most accurate, up-to-date gold and silver
            prices in Nepal. We track daily rates set by FENEGOSIDA (Federation of Nepal Gold & Silver
            Dealers Association) and present them in a clean, easy-to-understand format.
          </p>
        </div>

        <div className="card-dark p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-3">Data Source</h2>
          <p className="mb-3">
            All gold and silver prices displayed on this website are sourced from FENEGOSIDA — the
            official federation that sets daily bullion rates in Nepal. FENEGOSIDA determines prices
            based on:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400">
            <li>International gold prices from the London Bullion Market Association (LBMA)</li>
            <li>USD/NPR exchange rate set by Nepal Rastra Bank</li>
            <li>Import duties and taxes applicable in Nepal</li>
            <li>Local market supply and demand dynamics</li>
          </ul>
        </div>

        <div className="card-dark p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-3">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Daily Price Updates', desc: '24 Carat Gold rates updated every working day' },
              { title: 'Historical Data', desc: 'Complete archive of past gold prices with interactive charts' },
              { title: 'Silver Prices', desc: 'Daily silver (Chandi) rates alongside gold prices' },
              { title: 'Price Calculator', desc: 'Convert between tola, gram, and ounce with making charge estimates' },
              { title: 'Price Trends', desc: 'Weekly, monthly, and yearly trend analysis with statistics' },
              { title: 'Gold Insights', desc: 'Educational articles about gold buying, purity, and investment in Nepal' },
            ].map((item) => (
              <div key={item.title} className="bg-navy-950/60 rounded-lg p-4 border border-navy-700/50">
                <h3 className="text-sm font-semibold text-gold-400 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-dark p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-3">Disclaimer</h2>
          <p className="text-sm text-slate-400">
            The gold and silver prices displayed on this website are for informational and reference
            purposes only. Actual buying and selling prices at jewellery shops may vary due to making
            charges, wastage, taxes, and individual shop premiums. We recommend verifying prices with
            your local jeweller before making any purchase decisions. Gold Price Nepal is not a financial
            advisor and does not provide investment advice.
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-500 mb-4">
            Have questions or suggestions? We&apos;d love to hear from you.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gold-500 text-navy-950 px-6 py-3 rounded-lg font-semibold hover:bg-gold-400 transition-colors"
          >
            ← Back to Today&apos;s Price
          </Link>
        </div>
      </div>
    </div>
  )
}
