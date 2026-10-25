import Link from 'next/link'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/', label: "Today's Gold Price" },
  { href: '/gold-price-history', label: 'Price History' },
  { href: '/silver-price-nepal', label: 'Silver Price' },
  { href: '/gold-rate-calculator', label: 'Calculator' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

const resources = [
  { href: '/blog/how-to-check-gold-purity-nepal', label: 'Gold Purity Guide' },
  { href: '/blog/current-trends-nepal-gold-market', label: 'Gold Market Trends' },
  { href: '/blog', label: 'All Gold Guides' },
]

export function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-navy-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center">
                <span className="text-navy-950 font-bold text-lg font-display">G</span>
              </div>
              <div>
                <span className="text-lg font-bold font-display text-white">Gold Price</span>
                <span className="text-lg font-bold font-display text-gold-500"> Nepal</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Nepal&apos;s Most Accurate Gold Price Tracker. Daily rates sourced from FENEGOSIDA.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-gold-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2.5">
              {resources.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-gold-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">Disclaimer</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Prices are for reference only. Actual buying/selling prices may vary by jeweller.
              Making charges and taxes are additional.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-navy-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Gold Price Nepal. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
