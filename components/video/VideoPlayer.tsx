'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { cn, getThumbnail } from '@/lib/utils'
import { trackEvent } from '@/lib/api'
import type { Video } from '@/lib/types'

interface VideoPlayerProps {
  video: Video
  autoplay?: boolean
  className?: string
}

export function VideoPlayer({ video, autoplay = false, className }: VideoPlayerProps) {
  const [playerActive, setPlayerActive] = useState(autoplay)

  const thumbnail = getThumbnail(video)

  const handlePlay = useCallback(() => {
    setPlayerActive(true)
    trackEvent({ video_id: video.id, event_type: 'play' })
  }, [video.id])

  // Player ativo — iframe do YouTube
  if (playerActive) {
    return (
      <div className={cn('yt-player-container rounded-xl overflow-hidden', className)}>
        <iframe
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    )
  }

  // Thumbnail com botão de play — carrega o iframe só no clique
  return (
    <div
      className={cn(
        'relative aspect-video-thumb rounded-xl overflow-hidden bg-black cursor-pointer group',
        className,
      )}
      onClick={handlePlay}
      role="button"
      aria-label={`Assistir: ${video.title}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handlePlay()}
    >
      {/* Thumbnail */}
      <Image
        src={thumbnail}
        alt={video.title}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, 640px"
        priority
      />

      {/* Overlay escuro no hover */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

      {/* Botão play */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-200">
          {/* Ícone play */}
          <svg
            viewBox="0 0 24 24"
            fill="white"
            className="w-8 h-8 translate-x-0.5"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Duração */}
      {video.duration_fmt && (
        <span className="absolute bottom-3 right-3 bg-black/85 text-white text-xs font-mono px-2 py-0.5 rounded">
          {video.duration_fmt}
        </span>
      )}

      {/* Badge LIVE */}
      {video.status === 'live' && (
        <span className="badge-live absolute top-3 left-3">AO VIVO</span>
      )}
    </div>
  )
}
