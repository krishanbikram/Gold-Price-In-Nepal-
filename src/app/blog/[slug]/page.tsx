import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, is_published: true },
    select: { title: true, meta_title: true, meta_description: true },
  })

  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || '',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/blog/${params.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, is_published: true },
  })

  if (!post) notFound()

  // Get related posts
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      is_published: true,
      slug: { not: params.slug },
      category: post.category || undefined,
    },
    take: 3,
    orderBy: { published_at: 'desc' },
    select: { title: true, slug: true, category: true },
  })

  // Extract headings for TOC
  const headingRegex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi
  const headings: { level: number; text: string; id: string }[] = []
  let match
  while ((match = headingRegex.exec(post.content || '')) !== null) {
    const text = match[2].replace(/<[^>]*>/g, '')
    headings.push({
      level: parseInt(match[1]),
      text,
      id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    })
  }

  // Add IDs to headings in content
  let contentWithIds = post.content || ''
  headings.forEach((h) => {
    const regex = new RegExp(`<h${h.level}([^>]*)>`, 'i')
    contentWithIds = contentWithIds.replace(regex, `<h${h.level}$1 id="${h.id}">`)
  })

  return (
    <>
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.meta_description,
            datePublished: post.published_at?.toISOString(),
            dateModified: post.updated_at?.toISOString(),
            author: { '@type': 'Organization', name: 'Gold Price Nepal' },
            publisher: { '@type': 'Organization', name: 'Gold Price Nepal' },
          }),
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.NEXT_PUBLIC_SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: `${process.env.NEXT_PUBLIC_SITE_URL}/blog` },
              { '@type': 'ListItem', position: 3, name: post.title },
            ],
          }),
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/" className="hover:text-gold-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-gold-400 transition-colors">Blog</Link>
          <span>›</span>
          <span className="text-slate-500 truncate">{post.title}</span>
        </nav>

        <article>
          {/* Header */}
          <header className="mb-8">
            {post.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gold-500/10 text-gold-400 mb-4">
                {post.category}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>By Gold Price Nepal</span>
              <span>•</span>
              <time>
                {post.published_at?.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            </div>
          </header>

          {/* TOC */}
          {headings.length > 0 && (
            <div className="card-dark p-5 mb-8">
              <h2 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">
                Table of Contents
              </h2>
              <nav className="space-y-1.5">
                {headings.map((h) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className={`block text-sm text-slate-300 hover:text-gold-400 transition-colors ${
                      h.level === 3 ? 'pl-4' : ''
                    }`}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-invert prose-gold max-w-none
              prose-h2:text-xl prose-h2:font-bold prose-h2:font-display prose-h2:text-white prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-lg prose-h3:font-semibold prose-h3:text-slate-200
              prose-p:text-slate-300 prose-p:leading-relaxed
              prose-li:text-slate-300
              prose-a:text-gold-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
            "
            dangerouslySetInnerHTML={{ __html: contentWithIds }}
          />

          {/* Internal Links (SEO) */}
          <div className="mt-8 p-4 bg-navy-950/60 rounded-xl border border-navy-700/50">
            <p className="text-sm text-slate-400">
              📊 Check <Link href="/gold-price-history" className="text-gold-400 hover:underline">historical gold prices</Link> or
              use our <Link href="/gold-rate-calculator" className="text-gold-400 hover:underline">gold price calculator</Link> to
              estimate jewellery costs.
            </p>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold font-display text-white mb-4">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="card-dark p-4 group hover:border-gold-500/30 transition-all"
                >
                  <h3 className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors line-clamp-2">
                    {rp.title}
                  </h3>
                  {rp.category && (
                    <span className="text-xs text-slate-500 mt-2 block">{rp.category}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
