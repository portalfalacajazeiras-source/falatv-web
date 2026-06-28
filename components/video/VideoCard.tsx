'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn, formatViews, formatRelativeDate, getThumbnail } from '@/lib/utils'
import type { Video } from '@/lib/types'

interface VideoCardProps {
  video: Video
  variant?: 'default' | 'horizontal' | 'compact'
  className?: string
  priority?: boolean
}

export function VideoCard({
  video,
  variant = 'default',
  className,
  priority = false,
}: VideoCardProps) {
  const thumbnail = getThumbnail(video)
  const isLive = video.status === 'live'
  const isShort = video.type === 'short'

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/videos/${video.id}`}
        className={cn(
          'flex gap-3 p-3 rounded-xl active:bg-bg-surface transition-colors',
          className,
        )}
      >
        {/* Thumbnail */}
        <div className="relative flex-shrink-0 w-32 rounded-lg overflow-hidden bg-bg-elevated">
          <Image
            src={thumbnail}
            alt={video.title}
            width={128}
            height={72}
            className="object-cover w-full h-full"
            priority={priority}
          />
          {video.duration_fmt && (
            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-2xs font-mono px-1 rounded">
              {video.duration_fmt}
            </span>
          )}
          {isLive && (
            <span className="badge-live absolute top-1 left-1">AO VIVO</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-text line-clamp-2 leading-snug">
            {video.title}
          </h3>
          <p className="text-text-muted text-xs mt-1">
            {formatViews(video.views.youtube)} visualizações
            {video.published_at && ` · ${formatRelativeDate(video.published_at)}`}
          </p>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={`/videos/${video.id}`} className={cn('block', className)}>
        <div className="relative aspect-video-thumb rounded-lg overflow-hidden bg-bg-elevated">
          <Image
            src={thumbnail}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 45vw, 200px"
            priority={priority}
          />
          {video.duration_fmt && !isShort && (
            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-2xs font-mono px-1 rounded">
              {video.duration_fmt}
            </span>
          )}
          {isLive && (
            <span className="badge-live absolute top-1 left-1">AO VIVO</span>
          )}
        </div>
        <p className="text-xs font-medium text-text line-clamp-2 mt-1.5 leading-snug">
          {video.title}
        </p>
      </Link>
    )
  }

  // Default card — vertical com thumbnail grande
  return (
    <Link href={`/videos/${video.id}`} className={cn('block group', className)}>
      {/* Thumbnail */}
      <div className="relative aspect-video-thumb rounded-xl overflow-hidden bg-bg-elevated">
        <Image
          src={thumbnail}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-300 group-active:scale-105"
          sizes="(max-width: 640px) 100vw, 640px"
          priority={priority}
        />

        {/* Overlay gradiente */}
        <div className="absolute inset-0 thumb-overlay opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Duração */}
        {video.duration_fmt && !isShort && (
          <span className="absolute bottom-2 right-2 bg-black/85 text-white text-2xs font-mono px-1.5 py-0.5 rounded">
            {video.duration_fmt}
          </span>
        )}

        {/* Badge LIVE */}
        {isLive && (
          <span className="badge-live absolute top-2 left-2">AO VIVO</span>
        )}

        {/* Badge destaque */}
        {video.featured && (
          <span className="absolute top-2 right-2 bg-primary text-white text-2xs font-bold px-1.5 py-0.5 rounded">
            ★ DESTAQUE
          </span>
        )}
      </div>

      {/* Metadados */}
      <div className="mt-2.5 px-0.5">
        <h3 className="text-sm font-semibold text-text line-clamp-2 leading-snug">
          {video.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-text-muted text-xs">
            {formatViews(video.views.youtube)} views
          </span>
          {video.published_at && (
            <>
              <span className="text-bg-overlay text-xs">·</span>
              <span className="text-text-muted text-xs">
                {formatRelativeDate(video.published_at)}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
