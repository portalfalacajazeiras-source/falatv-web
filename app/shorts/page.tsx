'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useShortsInfinite } from '@/hooks/useVideos'
import { Spinner } from '@/components/ui/index'
import { formatViews } from '@/lib/utils'
import { trackEvent } from '@/lib/api'
import type { Video } from '@/lib/types'

export default function ShortsPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useShortsInfinite()

  const allShorts = data?.pages.flatMap((p) => p.data) ?? []

  return (
    <div className="fixed inset-0 bg-black">
      {/* Header flutuante */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-safe">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <Link href="/" className="text-white/80 active:text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <span className="text-white font-bold text-base">Shorts</span>
          <div className="w-6" /> {/* Spacer */}
        </div>
      </div>

      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <ShortsScroller
          shorts={allShorts}
          hasMore={hasNextPage}
          loadMore={() => fetchNextPage()}
          isLoadingMore={isFetchingNextPage}
        />
      )}
    </div>
  )
}

// ─── Shorts Scroller — snap scroll vertical ───────────────────────────────────

interface ShortsScrollerProps {
  shorts: Video[]
  hasMore: boolean | undefined
  loadMore: () => void
  isLoadingMore: boolean
}

function ShortsScroller({ shorts, hasMore, loadMore, isLoadingMore }: ShortsScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Detecta qual Short está visível para carregar mais
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const index = Math.round(container.scrollTop / window.innerHeight)
      setActiveIndex(index)

      // Carrega mais quando estiver nos últimos 3 vídeos
      if (index >= shorts.length - 3 && hasMore && !isLoadingMore) {
        loadMore()
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [shorts.length, hasMore, isLoadingMore, loadMore])

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-scroll snap-y-mandatory no-scrollbar"
    >
      {shorts.map((short, index) => (
        <ShortItem
          key={short.id}
          short={short}
          isActive={index === activeIndex}
        />
      ))}

      {/* Indicador de carregamento no final */}
      {isLoadingMore && (
        <div className="h-screen flex items-center justify-center snap-start">
          <Spinner size="lg" />
        </div>
      )}

      {!hasMore && shorts.length > 0 && (
        <div className="h-32 flex items-center justify-center snap-start">
          <p className="text-white/50 text-sm">Todos os Shorts vistos!</p>
        </div>
      )}
    </div>
  )
}

// ─── Short Item — tela cheia ──────────────────────────────────────────────────

interface ShortItemProps {
  short: Video
  isActive: boolean
}

function ShortItem({ short, isActive }: ShortItemProps) {
  const [playerActive, setPlayerActive] = useState(false)

  // Ativa o player quando o Short fica visível
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setPlayerActive(true)
        trackEvent({ video_id: short.id, event_type: 'impression' })
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setPlayerActive(false)
    }
  }, [isActive, short.id])

  return (
    <div className="relative h-screen w-full snap-start flex items-center justify-center bg-black">
      {playerActive ? (
        // Player ativo
        <iframe
          src={`https://www.youtube.com/embed/${short.id}?autoplay=1&loop=1&playlist=${short.id}&rel=0&playsinline=1&modestbranding=1`}
          title={short.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-none"
        />
      ) : (
        // Thumbnail de preview
        <>
          <Image
            src={short.thumbnail}
            alt={short.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/30" />
          <button
            onClick={() => setPlayerActive(true)}
            className="absolute inset-0 flex items-center justify-center"
            aria-label="Assistir short"
          >
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 translate-x-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        </>
      )}

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none">
        <p className="text-white font-semibold text-sm leading-snug line-clamp-3 mb-1">
          {short.title}
        </p>
        <p className="text-white/60 text-xs">
          {formatViews(short.views.youtube)} views
        </p>
      </div>

      {/* Ações laterais */}
      <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5">
        <ShortAction
          icon="like"
          label={formatViews(short.likes)}
          href={`/videos/${short.id}`}
        />
        <ShortAction
          icon="share"
          label="Compartilhar"
          onClick={async () => {
            const url = `${window.location.origin}/videos/${short.id}`
            if (navigator.share) {
              await navigator.share({ title: short.title, url }).catch(() => {})
            }
          }}
        />
        <ShortAction icon="yt" label="YouTube" href={`https://youtube.com/shorts/${short.id}`} external />
      </div>
    </div>
  )
}

// ─── Short Action Button ──────────────────────────────────────────────────────

interface ShortActionProps {
  icon: 'like' | 'share' | 'yt'
  label: string
  href?: string
  external?: boolean
  onClick?: () => void
}

function ShortAction({ icon, label, href, external, onClick }: ShortActionProps) {
  const iconEl = icon === 'like' ? (
    <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  ) : icon === 'share' ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-6 h-6">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )

  const className = "flex flex-col items-center gap-1 text-white text-xs font-medium"

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {iconEl}
        <span>{label}</span>
      </button>
    )
  }

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={className}
    >
      {iconEl}
      <span>{label}</span>
    </a>
  )
}
