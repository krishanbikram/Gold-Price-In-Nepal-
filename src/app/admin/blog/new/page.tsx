'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    content: '',
    meta_title: '',
    meta_description: '',
    focus_keyword: '',
    category: '',
    tags: '',
    is_published: false,
  })

  const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          slug,
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
          published_at: form.is_published ? new Date().toISOString() : null,
        }),
      })

      if (res.ok) {
        router.push('/admin/blog/posts')
      }
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-white mb-6">New Blog Post</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
        <div className="card-dark p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 font-medium mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full bg-navy-950 border border-navy-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              placeholder="Article title"
            />
            {slug && <div className="text-xs text-slate-500 mt-1">Slug: /blog/{slug}</div>}
          </div>

          <div>
            <label className="block text-sm text-slate-400 font-medium mb-2">Content (HTML)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={15}
              className="w-full bg-navy-950 border border-navy-700 rounded-lg px-4 py-3 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              placeholder="<h2>Introduction</h2><p>Your content here...</p>"
            />
          </div>
        </div>

        {/* SEO fields */}
        <div className="card-dark p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gold-400 uppercase tracking-wider">SEO Settings</h2>

          <div>
            <label className="block text-sm text-slate-400 font-medium mb-2">
              Meta Title ({form.meta_title.length}/60)
            </label>
            <input
              type="text"
              value={form.meta_title}
              onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
              maxLength={60}
              className="w-full bg-navy-950 border border-navy-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 font-medium mb-2">
              Meta Description ({form.meta_description.length}/160)
            </label>
            <textarea
              value={form.meta_description}
              onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
              maxLength={160}
              rows={2}
              className="w-full bg-navy-950 border border-navy-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 font-medium mb-2">Focus Keyword</label>
              <input
                type="text"
                value={form.focus_keyword}
                onChange={(e) => setForm({ ...form, focus_keyword: e.target.value })}
                className="w-full bg-navy-950 border border-navy-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 font-medium mb-2">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-navy-950 border border-navy-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                placeholder="Guide, Investment, Education"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 font-medium mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full bg-navy-950 border border-navy-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              placeholder="gold, nepal, investment"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            onClick={() => setForm({ ...form, is_published: true })}
            className="px-6 py-3 bg-gold-500 text-navy-950 rounded-lg font-semibold hover:bg-gold-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
          <button
            type="submit"
            disabled={loading}
            onClick={() => setForm({ ...form, is_published: false })}
            className="px-6 py-3 bg-navy-900 text-slate-300 rounded-lg font-semibold border border-navy-700 hover:bg-navy-800 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
        </div>
      </form>
    </div>
  )
}
