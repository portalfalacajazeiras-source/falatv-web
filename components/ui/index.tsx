import { cn } from '@/lib/utils'

// ─── Spinner ──────────────────────────────────────────────────────────────────

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }

  return (
    <div
      className={cn(
        'border-2 border-bg-elevated border-t-primary rounded-full animate-spin',
        sizes[size],
        className,
      )}
      aria-label="Carregando…"
      role="status"
    />
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'live' | 'short' | 'horizontal'
  className?: string
}

const badgeVariants = {
  default:    'bg-bg-elevated text-text-secondary',
  primary:    'bg-primary text-white',
  live:       'bg-live text-white',
  short:      'bg-purple-600 text-white',
  horizontal: 'bg-bg-overlay text-text-secondary',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'type-badge',
        badgeVariants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton', className)} />
}

// ─── VideoCardSkeleton ────────────────────────────────────────────────────────

export function VideoCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="w-full aspect-video-thumb rounded-xl" />
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-3 w-1/2 rounded" />
    </div>
  )
}
