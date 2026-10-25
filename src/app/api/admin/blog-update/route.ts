import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import blogUpdates from '@/data/blog-updates.json'

// One-time content refresh for the two existing blog posts
// (full articles, featured images, internal links, fresh meta).
// Admin-session protected. Remove this route and
// src/data/blog-updates.json after the update is verified.
export const dynamic = 'force-dynamic'
export const maxDuration = 60

interface BlogUpdate {
  slug: string
  content: string
  meta_title: string
  meta_description: string
  focus_keyword: string
  tags: string[]
  featured_image_url: string
  published_at: string
}

async function runUpdate() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const updates = blogUpdates as BlogUpdate[]
  const results: { slug: string; ok: boolean; title?: string }[] = []

  for (const u of updates) {
    const post = await prisma.blogPost.update({
      where: { slug: u.slug },
      data: {
        content: u.content,
        meta_title: u.meta_title,
        meta_description: u.meta_description,
        focus_keyword: u.focus_keyword,
        tags: u.tags,
        featured_image_url: u.featured_image_url,
        is_published: true,
        published_at: new Date(u.published_at),
      },
      select: { title: true },
    })
    results.push({ slug: u.slug, ok: true, title: post.title })
    revalidatePath(`/blog/${u.slug}`)
  }

  revalidatePath('/')
  revalidatePath('/blog')

  return NextResponse.json({ success: true, updated: results })
}

export async function POST(_request: NextRequest) {
  return runUpdate()
}

// GET is supported so the one-time update can be triggered by
// simply opening the URL in the signed-in admin browser.
export async function GET() {
  return runUpdate()
}
