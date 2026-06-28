import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import Link from 'next/link'
import { getVideo, getVideos } from '@/lib/api'
import { VideoPlayer } from '@/components/video/VideoPlayer'
import { VideoCard } from '@/components/video/VideoCard'
import { ShareButton } from '@/components/video/ShareButton'
import { Header } from '@/components/layout/Header'
import { formatViews, formatDate, truncate } from '@/lib/utils'

export const revalidate = 300

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const video = await getVideo(slug, { next: { revalidate: 300 } })
    return {
      title: video.title,
      description: truncate(video.description ?? '', 160),
      openGraph: {
        title: video.title,
        description: truncate(video.description ?? '', 160),
        images: [{ url: video.thumbnail, width: 1280, height: 720, alt: video.title }],
        type: 'video.other',
      },
      twitter: {
        card: 'summary_large_image',
        title: video.title,
        images: [video.thumbnail],
      },
    }
  } catch {
    return { title: 'Vídeo não encontrado' }
  }
}

export default async function VideoPage({ params }: PageProps) {
  const { slug } = await params

  const [video, relatedRes] = await Promise.allSettled([
    getVideo(slug, { next: { revalidate: 300 } }),
    getVideos({ per_page: 8, type: 'horizontal' }, { next: { revalidate: 300 } }),
  ])

  if (video.status === 'rejected') notFound()

  const videoData = video.value
  const related = relatedRes.status === 'fulfilled'
    ? relatedRes.value.data.filter((v) => v.id !== videoData.id).slice(0, 6)
    : []

  return (
    <>
      {videoData.json_ld && (
        <Script
          id="video-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoData.json_ld) }}
        />
      )}

      <Header showBack title="" />

      <div className="container-mobile">
        <div className="-mx-4">
          <VideoPlayer video={videoData} />
        </div>

        <div className="pt-4 pb-2">
          <h1 className="text-base font-bold text-text leading-snug">{videoData.title}</h1>
          <div className="flex items-center gap-3 mt-2 text-text-muted text-sm">
            <span>{formatViews(videoData.views.youtube)} views</span>
            <span>·</span>
            <span>{formatDate(videoData.published_at)}</span>
            {videoData.likes > 0 && (
              <>
                <span>·</span>
                <span>👍 {formatViews(videoData.likes)}</span>
              </>
            )}
          </div>
          {videoData.category && (
            <span className="inline-block mt-2 text-2xs font-bold uppercase tracking-widest text-primary">
              {videoData.category.replace(/-/g, ' ')}
            </span>
          )}
        </div>

        <div className="flex gap-2 py-3 border-y border-border">
          <a
            href={`https://www.youtube.com/watch?v=${videoData.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-bg-elevated text-text-secondary text-sm font-medium active:bg-bg-overlay"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-500">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube
          </a>
          <ShareButton title={videoData.title} videoId={videoData.id} />
        </div>

        {videoData.description && (
          <details className="py-3 border-b border-border group">
            <summary className="text-sm font-medium text-text-secondary cursor-pointer list-none flex items-center justify-between">
              Descrição
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 transition-transform group-open:rotate-180">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed whitespace-pre-line">
              {videoData.description}
            </p>
          </details>
        )}

        {related.length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-bold text-text mb-3 accent-line">Mais vídeos</h2>
            <div className="flex flex-col gap-2">
              {related.map((v) => (
                <VideoCard key={v.id} video={v} variant="horizontal" />
              ))}
            </div>
          </section>
        )}

        <div className="h-4" />
      </div>
    </>
  )
}
