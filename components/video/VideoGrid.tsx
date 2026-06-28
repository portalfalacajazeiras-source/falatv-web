'use client'

import { useEffect, useRef } from 'react'
import { VideoCard } from './VideoCard'
import { VideoCardSkeleton, Spinner } from '@/components/ui/index'
import { useVideosInfinite } from '@/hooks/useVideos'
import type { VideoFilters } from '@/lib/types'

interface VideoGridProps {
  filters?: VideoFilters
  columns?: 1 | 2
  className?: string
}

export function VideoGrid({ filters = {}, columns = 1, className }: VideoGridProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useVideosInfinite(filters)

  // Intersection Observer para infinite scroll
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Estado de carregamento inicial
  if (isLoading) {
    return (
      <div
        className={
          columns === 2
            ? 'grid grid-cols-2 gap-3'
            : 'flex flex-col gap-4'
        }
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  // Estado de erro
  if (isError) {
    return (
      <div className="text-center py-16 text-text-secondary">
        <p className="text-4xl mb-3">😕</p>
        <p className="font-medium">Não foi possível carregar os vídeos.</p>
        <p className="text-sm mt-1">Verifique sua conexão e tente novamente.</p>
      </div>
    )
  }

  const allVideos = data?.pages.flatMap((page) => page.data) ?? []

  // Estado vazio
  if (allVideos.length === 0) {
    return (
      <div className="text-center py-16 text-text-secondary">
        <p className="text-4xl mb-3">🎬</p>
        <p className="font-medium">Nenhum vídeo encontrado.</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Grid de vídeos */}
      <div
        className={
          columns === 2
            ? 'grid grid-cols-2 gap-3'
            : 'flex flex-col gap-6'
        }
      >
        {allVideos.map((video, index) => (
          <VideoCard
            key={video.id}
            video={video}
            variant={columns === 2 ? 'compact' : 'default'}
            priority={index < 3}
          />
        ))}
      </div>

      {/* Sentinel para infinite scroll */}
      <div ref={sentinelRef} className="py-4 flex justify-center">
        {isFetchingNextPage && <Spinner />}
        {!hasNextPage && allVideos.length > 0 && (
          <p className="text-text-muted text-sm">Todos os vídeos carregados</p>
        )}
      </div>
    </div>
  )
}
