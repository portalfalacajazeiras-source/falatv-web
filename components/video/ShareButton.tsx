'use client'

interface ShareButtonProps {
  title: string
  videoId: string
}

export function ShareButton({ title, videoId }: ShareButtonProps) {
  const handleShare = async () => {
    const url = `${window.location.origin}/videos/${videoId}`
    if (navigator.share) {
      try { await navigator.share({ title, url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-bg-elevated text-text-secondary text-sm font-medium active:bg-bg-overlay"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
      Compartilhar
    </button>
  )
}
