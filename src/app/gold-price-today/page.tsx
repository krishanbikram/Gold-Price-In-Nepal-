import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gold Price Today Nepal | Aajako Suna Ko Bhaau | GoldPriceNP',
  description: 'Today\'s Gold Price in Nepal (Aajako Suna Ko Bhaau). Live 24 Carat Gold rate per Tola updated daily by FENEGOSIDA.',
  alternates: {
    canonical: '/',
  },
}

export default function GoldPriceTodayPage() {
  redirect('/')
}
