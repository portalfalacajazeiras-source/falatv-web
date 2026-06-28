import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getVideos, getLiveStatus } from '@/lib/api'
import { VideoCard } from '@/components/video/VideoCard'
import { Header, LiveBanner } from '@/components/layout/Header'
import { formatViews, formatRelativeDate } from '@/lib/utils'

export const revalidate = 60 // ISR: revalida a cada 60 segundos

export const metadata: Metadata = {
  title: 'Início',
}

export default async function HomePage() {
  // Busca paralela: live status + vídeos em destaque + mais recentes
  const [liveStatus, featuredRes, recentRes] = await Promise.allSettled([
    getLiveStatus({ next: { revalidate: 30 } }),
    getVideos(
      { featured: true, per_page: 3 },
      { next: { revalidate: 60 } },
    ),
    getVideos(
      { per_page: 12, type: 'horizontal' },
      { next: { revalidate: 60 } },
    ),
  ])

  const live = liveStatus.status === 'fulfilled' ? liveStatus.value : null
  const featured = featuredRes.status === 'fulfilled' ? featuredRes.value.data : []
  const recent = recentRes.status === 'fulfilled' ? recentRes.value.data : []

  return (
    <>
      {/* Banner de live */}
      {live?.type === 'live' && live.video && (
        <LiveBanner title={live.video.title} videoId={live.video.id} />
      )}

      <Header showLogo>
        <Link
          href="/busca"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary active:bg-bg-elevated"
          aria-label="Buscar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </Link>
      </Header>

      <div className="container-mobile py-4 space-y-8">

        {/* Hero — vídeo em destaque */}
        {featured.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-text accent-line">
                Em destaque
              </h2>
            </div>
            <HeroVideo video={featured[0]} />

            {/* Destaques secundários */}
            {featured.length > 1 && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                {featured.slice(1).map((video) => (
                  <VideoCard key={video.id} video={video} variant="compact" />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Premiere agendada */}
        {live?.type === 'premiere' && live.video && (
          <section>
            <h2 className="text-base font-bold text-text accent-line mb-3">
              Próxima Premiere
            </h2>
            <Link href="/ao-vivo" className="block bg-bg-surface rounded-xl overflow-hidden">
              <div className="relative aspect-video-thumb">
                <Image
                  src={live.video.thumbnail ?? ''}
                  alt={live.video.title}
                  fill
                  className="object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    EM BREVE
                  </span>
                  <p className="text-white font-semibold text-center px-4 text-sm">
                    {live.video.title}
                  </p>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Últimos vídeos */}
        {recent.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-text accent-line">
                Últimas notícias
              </h2>
              <Link href="/videos" className="text-primary text-sm font-medium">
                Ver todos
              </Link>
            </div>
            <div className="flex flex-col gap-5">
              {recent.map((video, i) => (
                <VideoCard key={video.id} video={video} priority={i < 2} />
              ))}
            </div>
          </section>
        )}

      </div>
    </>
  )
}

// ─── Hero Video ───────────────────────────────────────────────────────────────

function HeroVideo({ video }: { video: Awaited<ReturnType<typeof getVideos>>['data'][0] }) {
  return (
    <Link href={`/videos/${video.id}`} className="block rounded-xl overflow-hidden group">
      <div className="relative aspect-video-thumb bg-bg-elevated">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 640px) 100vw, 640px"
        />
        {/* Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Info no rodapé */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-bold text-sm leading-snug line-clamp-2">
            {video.title}
          </h3>
          <p className="text-white/70 text-xs mt-1">
            {formatViews(video.views.youtube)} views · {formatRelativeDate(video.published_at)}
          </p>
        </div>

        {/* Duração */}
        {video.duration_fmt && (
          <span className="absolute top-2 right-2 bg-black/80 text-white text-2xs font-mono px-1.5 py-0.5 rounded">
            {video.duration_fmt}
          </span>
        )}
      </div>
    </Link>
  )
}
