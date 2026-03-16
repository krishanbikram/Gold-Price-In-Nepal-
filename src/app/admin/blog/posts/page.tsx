'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  slug: string
  category: string | null
  is_published: boolean
  published_at: string | null
}

export default function AdminBlogPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch all posts (including drafts) - for now using the public API
    fetch('/api/blog/posts?limit=100')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.posts || [])
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-display text-white">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 bg-gold-500 text-navy-950 rounded-lg text-sm font-semibold hover:bg-gold-400 transition-colors"
        >
          + New Post
        </Link>
      </div>

      <div className="card-dark p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No blog posts yet.</p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 bg-navy-950/60 rounded-lg border border-navy-700/50"
              >
                <div>
                  <h3 className="text-sm font-semibold text-white">{post.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    {post.category && (
                      <span className="text-xs text-gold-400">{post.category}</span>
                    )}
                    <span className={`text-xs ${post.is_published ? 'text-green-400' : 'text-slate-500'}`}>
                      {post.is_published ? '● Published' : '○ Draft'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs text-slate-400 hover:text-gold-400 transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/blog/edit/${post.id}`}
                    className="text-xs text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
