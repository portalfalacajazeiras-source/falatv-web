'use client'

import { useState, useTransition } from 'react'
import { Header } from '@/components/layout/Header'
import { VideoCard } from '@/components/video/VideoCard'
import { Spinner, VideoCardSkeleton } from '@/components/ui/index'
import { getVideos } from '@/lib/api'
import type { Video } from '@/lib/types'

export default function BuscaPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Video[]>([])
  const [total, setTotal] = useState(0)
  const [searched, setSearched] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSearch = (q: string) => {
    if (!q.trim()) return

    startTransition(async () => {
      const res = await getVideos({ search: q.trim(), per_page: 20 })
      setResults(res.data)
      setTotal(res.meta.total)
      setSearched(true)
    })
  }

  return (
    <>
      <Header title="Buscar" showLogo />

      <div className="container-mobile py-4">
        {/* Campo de busca */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1 relative">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder="Buscar vídeos…"
              className="w-full pl-9 pr-4 py-3 rounded-xl bg-bg-surface text-text placeholder:text-text-muted text-sm border border-border focus:border-primary focus:outline-none"
              autoFocus
            />
          </div>
          <button
            onClick={() => handleSearch(query)}
            disabled={!query.trim() || isPending}
            className="btn-primary px-4 disabled:opacity-50"
          >
            {isPending ? <Spinner size="sm" /> : 'Buscar'}
          </button>
        </div>

        {/* Resultados */}
        {isPending ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => <VideoCardSkeleton key={i} />)}
          </div>
        ) : searched ? (
          <>
            <p className="text-text-muted text-sm mb-4">
              {total > 0
                ? `${total} resultado${total > 1 ? 's' : ''} para "${query}"`
                : `Nenhum resultado para "${query}"`}
            </p>
            <div className="flex flex-col gap-5">
              {results.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-text-muted">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-16 h-16 mx-auto mb-4 opacity-30">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <p className="font-medium">Busque por título ou assunto</p>
            <p className="text-sm mt-1">Ex: "eleições", "cajazeiras", "live"</p>
          </div>
        )}
      </div>
    </>
  )
}
