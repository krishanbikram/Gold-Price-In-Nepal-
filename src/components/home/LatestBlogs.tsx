import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export async function LatestBlogs() {
  const posts = await prisma.blogPost.findMany({
    where: { is_published: true },
    orderBy: { published_at: 'desc' },
    take: 3,
    select: {
      title: true,
      slug: true,
      meta_description: true,
      category: true,
      featured_image_url: true,
      published_at: true,
    },
  })

  if (posts.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            Gold & Jewellery Insights
          </h2>
          <p className="text-sm text-slate-400 mt-1">Latest articles and guides</p>
        </div>
        <Link
          href="/blog"
          className="text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="card-dark group hover:border-gold-500/30 transition-all duration-200 overflow-hidden"
          >
            {post.featured_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="h-44 w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-44 bg-gradient-to-br from-navy-800 to-navy-950 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                <span className="text-4xl">📰</span>
              </div>
            )}

            <div className="p-5">
              {post.category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-500/10 text-gold-400 mb-3">
                  {post.category}
                </span>
              )}
              <h3 className="text-base font-semibold text-white group-hover:text-gold-400 transition-colors line-clamp-2 mb-2">
                {post.title}
              </h3>
              {post.meta_description && (
                <p className="text-sm text-slate-400 line-clamp-2">
                  {post.meta_description}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : ''}
                </span>
                <span className="text-xs text-gold-400 font-medium group-hover:underline">
                  Read More →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
