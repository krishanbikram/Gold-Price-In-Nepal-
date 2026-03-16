'use client'

import { useState } from 'react'
import { formatNumber } from '@/lib/utils'

interface FAQSectionProps {
  price: number
  silverPrice: number
}

const faqs = (hallmark: number, silver: number) => [
  {
    q: 'What is the gold price in Nepal today?',
    a: `Today's 24 Carat Gold gold price in Nepal is NPR ${formatNumber(hallmark)} per tola. This rate is set by FENEGOSIDA and is updated daily on working days.`,
  },
  {
    q: 'What is 24 Carat Gold?',
    a: '24 Carat Gold is 24 carat (99.9% pure) gold, the highest purity available. This provides the standard reference rate for gold in Nepal.',
  },
  {
    q: 'Who sets the gold price in Nepal?',
    a: 'Gold prices in Nepal are set daily by FENEGOSIDA — the Federation of Nepal Gold & Silver Dealers Association — based on international market rates (London Bullion Market) and the USD/NPR exchange rate set by Nepal Rastra Bank.',
  },
  {
    q: 'How is gold measured in Nepal?',
    a: 'In Nepal, gold is primarily measured in Tola (1 tola = 11.6638 grams). It is also sold per gram and per 10 grams. International markets use Troy Ounce (1 troy oz = 31.1035 grams).',
  },
  {
    q: "What is today's silver price in Nepal?",
    a: `Today's silver (Chandi) price in Nepal is NPR ${formatNumber(silver)} per tola. Silver prices are also set daily by FENEGOSIDA.`,
  },
  {
    q: 'Does gold price change on weekends and holidays?',
    a: 'FENEGOSIDA sets prices on working days (Sunday to Friday in Nepal). On Saturdays and public holidays, the previous working day\'s rate typically applies. Jewellers may add their own premiums.',
  },
  {
    q: "How does international gold price affect Nepal's gold rate?",
    a: 'Nepal\'s gold price is directly influenced by the London Bullion Market Association (LBMA) gold fix price and the USD/NPR exchange rate. When international gold prices rise or the Nepali Rupee weakens against the Dollar, domestic gold prices increase.',
  },
  {
    q: 'Where can I check historical gold prices in Nepal?',
    a: 'You can check historical gold prices on our Gold Price History page, which includes daily rates going back several years with interactive charts and downloadable CSV data.',
  },
]

export function FAQSection({ price, silverPrice }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const items = faqs(price, silverPrice)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold font-display text-white mb-2">
          Frequently Asked Questions About Gold Price in Nepal
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Everything you need to know about gold rates, measurements, and buying gold in Nepal
        </p>

        <div className="space-y-3">
          {items.map((faq, i) => (
            <div
              key={i}
              className="card-dark overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 hover:bg-navy-800/50 transition-colors"
              >
                <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-gold-500 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-slate-300 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Generate FAQ Schema JSON-LD
export function FAQSchema({ price, silverPrice }: FAQSectionProps) {
  const items = faqs(price, silverPrice)
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
