import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getLiveStatus } from '@/lib/api'
import { Header } from '@/components/layout/Header'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Ao Vivo',
  description: 'Transmissões ao vivo do canal Fala Cajazeiras.',
}

export default async function AoVivoPage() {
  const live = await getLiveStatus().catch(() => null)

  return (
    <>
      <Header title="Ao Vivo" showLogo />
      <div className="container-mobile py-6">
        {live?.type === 'live' && live.video ? (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden aspect-video-thumb bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${live.video.id}?autoplay=1&rel=0&playsinline=1`}
                title={live.video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-none"
              />
            </div>
            <div className="flex items-start gap-2">
              <span className="badge-live flex-shrink-0 mt-0.5">AO VIVO</span>
              <h1 className="text-base font-bold text-text leading-snug">{live.video.title}</h1>
            </div>
            <a
              href={live.video.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full text-center block py-3"
            >
              Assistir no YouTube
            </a>
          </div>
        ) : live?.type === 'premiere' && live.video ? (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden aspect-video-thumb bg-bg-elevated">
              {live.video.thumbnail && (
                <Image src={live.video.thumbnail} alt={live.video.title} fill className="object-cover opacity-50" />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <span className="bg-primary text-white font-bold px-4 py-1.5 rounded-full">EM BREVE</span>
                {live.scheduled_at && (
                  <p className="text-white text-sm font-medium">{formatDate(live.scheduled_at)}</p>
                )}
              </div>
            </div>
            <h1 className="text-base font-bold text-text">{live.video.title}</h1>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-bg-surface flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-text-muted">
                <circle cx="12" cy="12" r="3" />
                <path d="M6.3 6.3a8 8 0 0 0 0 11.4M17.7 6.3a8 8 0 0 1 0 11.4" />
              </svg>
            </div>
            <h2 className="font-bold text-text mb-1">Nenhuma live no momento</h2>
            <p className="text-text-muted text-sm">Fique ligado nas próximas transmissões.</p>
            <Link href="/videos" className="btn-primary inline-block mt-6 px-6 py-3">
              Ver vídeos recentes
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
