import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPlaylists } from '@/lib/api'
import { Header } from '@/components/layout/Header'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Playlists',
  description: 'Playlists do canal Fala Cajazeiras.',
}

export default async function PlaylistsPage() {
  const playlists = await getPlaylists({ next: { revalidate: 300 } }).catch(() => [])

  return (
    <>
      <Header title="Playlists" showLogo />

      <div className="container-mobile py-4">
        {playlists.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-medium">Nenhuma playlist disponível.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlists/${playlist.id}`}
                className="flex gap-3 p-3 rounded-xl bg-bg-surface active:bg-bg-elevated transition-colors"
              >
                {/* Thumbnail */}
                <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-bg-elevated">
                  {playlist.thumbnail ? (
                    <Image
                      src={playlist.thumbnail}
                      alt={playlist.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="m9 9 6 3-6 3V9z" />
                      </svg>
                    </div>
                  )}
                  {/* Contagem de vídeos */}
                  <div className="absolute inset-0 flex items-end">
                    <div className="w-full bg-black/70 text-white text-xs text-center py-0.5 font-mono">
                      {playlist.video_count} vídeos
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-text line-clamp-2 leading-snug">
                    {playlist.title}
                  </h2>
                  {playlist.description && (
                    <p className="text-text-muted text-xs mt-1 line-clamp-2">
                      {playlist.description}
                    </p>
                  )}
                </div>

                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-text-muted flex-shrink-0 self-center">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
