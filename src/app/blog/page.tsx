import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Gold Price Blog Nepal | Suna, Chandi & Jewellery News | GoldPriceNP',
  description: 'Expert articles on Gold Price in Nepal, investment tips, purity guides, and jewellery insights. Stay updated on Suna Ko Bhaau and gold market trends.',
  alternates: {
    canonical: '/blog',
  },
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { is_published: true },
    orderBy: { published_at: 'desc' },
    select: {
      title: true,
      slug: true,
      meta_description: true,
      category: true,
      tags: true,
      featured_image_url: true,
      published_at: true,
    },
  })

  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean))) as string[]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-2">
          Gold & Jewellery Blog
        </h1>
        <p className="text-slate-400">Expert insights on gold prices, investments, and jewellery in Nepal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3 space-y-5">
          {posts.length === 0 ? (
            <div className="card-dark p-12 text-center">
              <p className="text-slate-400">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card-dark p-6 block group hover:border-gold-500/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  {post.featured_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gold-500/20 to-navy-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📰</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {post.category && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gold-500/10 text-gold-400 mb-2">
                        {post.category}
                      </span>
                    )}
                    <h2 className="text-lg font-semibold text-white group-hover:text-gold-400 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.meta_description && (
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{post.meta_description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs text-slate-500">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : ''}
                      </span>
                      <span className="text-xs text-gold-400 font-medium">Read More →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {categories.length > 0 && (
            <div className="card-dark p-5">
              <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat} className="text-sm text-slate-300 hover:text-gold-400 cursor-pointer transition-colors">
                    {cat}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card-dark p-5">
            <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-slate-300 hover:text-gold-400 transition-colors">
                Today&apos;s Gold Price →
              </Link>
              <Link href="/gold-price-history" className="block text-sm text-slate-300 hover:text-gold-400 transition-colors">
                Historical Gold Prices →
              </Link>
              <Link href="/gold-rate-calculator" className="block text-sm text-slate-300 hover:text-gold-400 transition-colors">
                Gold Calculator →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
