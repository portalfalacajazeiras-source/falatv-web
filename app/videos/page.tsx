import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { VideoGrid } from '@/components/video/VideoGrid'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Vídeos',
  description: 'Todos os vídeos do canal Fala Cajazeiras.',
}

export default function VideosPage() {
  return (
    <>
      <Header title="Vídeos" showLogo />

      {/* Filtros por tipo */}
      <div className="sticky top-14 z-30 bg-bg border-b border-border-subtle">
        <TypeFilterTabs />
      </div>

      <div className="container-mobile py-4">
        <VideoGrid filters={{ type: 'horizontal', per_page: 15 }} />
      </div>
    </>
  )
}

// ─── Filtros de tipo (client component futuro) ────────────────────────────────
// Por ora renderiza as tabs estáticas; no v0.5.0 será interativo com searchParams

function TypeFilterTabs() {
  const tabs = [
    { label: 'Todos', href: '/videos' },
    { label: 'Shorts', href: '/shorts' },
    { label: 'Playlists', href: '/playlists' },
  ]

  return (
    <div className="container-mobile flex gap-1 py-2 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <a
          key={tab.href}
          href={tab.href}
          className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium
                     bg-bg-elevated text-text-secondary
                     first:bg-primary first:text-white"
        >
          {tab.label}
        </a>
      ))}
    </div>
  )
}
