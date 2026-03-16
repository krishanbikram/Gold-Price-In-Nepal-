import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title, slug, content, meta_title, meta_description,
      focus_keyword, category, tags, is_published, published_at
    } = body

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        meta_title,
        meta_description,
        focus_keyword,
        category,
        tags: tags || [],
        is_published: is_published || false,
        published_at: published_at ? new Date(published_at) : null,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
