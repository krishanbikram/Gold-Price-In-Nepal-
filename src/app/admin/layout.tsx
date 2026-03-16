'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [status, router, pathname])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!session) return null

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/prices/update', label: 'Update Prices', icon: '💰' },
    { href: '/admin/prices/history', label: 'Price History', icon: '📈' },
    { href: '/admin/blog/posts', label: 'Blog Posts', icon: '📝' },
    { href: '/admin/blog/new', label: 'New Post', icon: '✏️' },
  ]

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Admin Nav */}
      <nav className="bg-navy-900 border-b border-navy-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center">
                <span className="text-navy-950 font-bold text-sm">G</span>
              </div>
              <span className="text-sm font-bold text-white">Admin</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-gold-500/10 text-gold-400'
                      : 'text-slate-400 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-slate-400 hover:text-gold-400">
              View Site →
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  )
}
