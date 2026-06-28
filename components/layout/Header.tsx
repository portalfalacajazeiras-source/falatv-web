import Link from 'next/link'
import { cn } from '@/lib/utils'

interface HeaderProps {
  title?: string
  showLogo?: boolean
  showBack?: boolean
  className?: string
  children?: React.ReactNode
}

export function Header({
  title,
  showLogo = false,
  showBack = false,
  className,
  children,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 bg-bg/90 backdrop-blur-md border-b border-border-subtle',
        className,
      )}
    >
      <div className="container-mobile h-14 flex items-center gap-3">
        {showBack && (
          <Link
            href="javascript:history.back()"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary active:bg-bg-elevated"
            aria-label="Voltar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
        )}

        {showLogo && (
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-tight">
              Fala<span className="text-primary">TV</span>
            </span>
          </Link>
        )}

        {title && (
          <h1 className="text-base font-bold text-text flex-1 truncate">
            {title}
          </h1>
        )}

        {children && (
          <div className="flex items-center gap-2 ml-auto">
            {children}
          </div>
        )}
      </div>
    </header>
  )
}

// ─── LiveBanner — exibido no topo quando há uma live ativa ───────────────────

interface LiveBannerProps {
  title: string
  videoId: string
}

export function LiveBanner({ title, videoId }: LiveBannerProps) {
  return (
    <Link
      href={`/ao-vivo`}
      className="block bg-live/10 border-b border-live/30 py-2.5 px-4"
    >
      <div className="container-mobile flex items-center gap-2.5 max-w-screen-sm mx-auto">
        <span className="badge-live flex-shrink-0">AO VIVO</span>
        <p className="text-sm font-medium text-text truncate">{title}</p>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 flex-shrink-0 text-text-secondary ml-auto">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </Link>
  )
}
