import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Combina classes do Tailwind sem conflitos
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formata views para exibição compacta (1.2k, 3.4M)
export function formatViews(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`
  return String(count)
}

// Formata data relativa para pt-BR
export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return 'agora mesmo'
  if (minutes < 60) return `há ${minutes} min`
  if (hours < 24) return `há ${hours}h`
  if (days < 7) return `há ${days} dia${days > 1 ? 's' : ''}`
  if (weeks < 5) return `há ${weeks} semana${weeks > 1 ? 's' : ''}`
  if (months < 12) return `há ${months} mês${months > 1 ? 'es' : ''}`
  return `há ${years} ano${years > 1 ? 's' : ''}`
}

// Formata data absoluta para pt-BR
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Trunca texto mantendo palavras inteiras
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…'
}

// Slug de URL a partir do YouTube ID
export function videoSlug(youtubeId: string, title: string): string {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)

  return `${youtubeId}`
}

// URL de thumbnail do YouTube com fallback
export function getThumbnail(video: { thumbnail: string; id: string }): string {
  if (video.thumbnail) return video.thumbnail
  return `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
}

// Verifica se é dispositivo mobile pelo user agent
export function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )
}
