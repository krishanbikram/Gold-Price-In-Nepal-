import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gold Rate Calculator Nepal | Tola, Gram & Ounce | GoldPriceNP',
  description:
    'Free gold rate calculator for Nepal: convert tola, gram and ounce, add making charges and estimate jewellery cost from the live FENEGOSIDA gold price.',
  alternates: { canonical: '/gold-rate-calculator' },
}

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
