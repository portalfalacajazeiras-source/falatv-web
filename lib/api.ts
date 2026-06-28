// ─────────────────────────────────────────────────────────────────────────────
// FalaTV — API Client
// Consome a REST API WordPress em /wp-json/ftv/v1/
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Video,
  Playlist,
  PlaylistVideo,
  LiveStatus,
  SiteStatus,
  VideoFilters,
  ApiListResponse,
  ApiSingleResponse,
  AnalyticsEvent,
} from './types'

const API_URL = process.env.NEXT_PUBLIC_WP_API_URL ?? ''

// ─────────────────────────────────────────────────────────────────────────────
// HTTP helper
// ─────────────────────────────────────────────────────────────────────────────

class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string = 'api_error',
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new ApiError(
      body?.error?.message ?? `HTTP ${response.status}`,
      response.status,
      body?.error?.code,
    )
  }

  return response.json() as Promise<T>
}

// ─────────────────────────────────────────────────────────────────────────────
// Videos
// ─────────────────────────────────────────────────────────────────────────────

export async function getVideos(
  filters: VideoFilters = {},
  fetchOptions: RequestInit = {},
): Promise<ApiListResponse<Video>> {
  const params = new URLSearchParams()

  if (filters.type)     params.set('type', filters.type)
  if (filters.status)   params.set('status', filters.status)
  if (filters.featured) params.set('featured', '1')
  if (filters.category) params.set('category', filters.category)
  if (filters.search)   params.set('search', filters.search)
  if (filters.cursor)   params.set('cursor', filters.cursor)
  if (filters.per_page) params.set('per_page', String(filters.per_page))
  if (filters.order)    params.set('order', filters.order)

  const qs = params.toString()

  return fetchApi<ApiListResponse<Video>>(
    `/videos${qs ? `?${qs}` : ''}`,
    fetchOptions,
  )
}

export async function getVideo(
  youtubeId: string,
  fetchOptions: RequestInit = {},
): Promise<Video> {
  const res = await fetchApi<ApiSingleResponse<Video>>(
    `/videos/${youtubeId}`,
    fetchOptions,
  )
  return res.data
}

export async function getShorts(
  cursor?: string,
  fetchOptions: RequestInit = {},
): Promise<ApiListResponse<Video>> {
  return getVideos(
    { type: 'short', per_page: 10, cursor },
    fetchOptions,
  )
}

export async function getFeaturedVideos(
  fetchOptions: RequestInit = {},
): Promise<Video[]> {
  const res = await getVideos({ featured: true, per_page: 5 }, fetchOptions)
  return res.data
}

// ─────────────────────────────────────────────────────────────────────────────
// Playlists
// ─────────────────────────────────────────────────────────────────────────────

export async function getPlaylists(
  fetchOptions: RequestInit = {},
): Promise<Playlist[]> {
  const res = await fetchApi<{ data: Playlist[]; meta: { total: number } }>(
    '/playlists',
    fetchOptions,
  )
  return res.data
}

export async function getPlaylistVideos(
  playlistId: string,
  fetchOptions: RequestInit = {},
): Promise<{ playlist: Playlist; videos: PlaylistVideo[] }> {
  const res = await fetchApi<{
    data: PlaylistVideo[]
    meta: { total: number; playlist: Playlist }
  }>(`/playlists/${playlistId}/videos`, fetchOptions)

  return {
    playlist: res.meta.playlist,
    videos: res.data,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Live
// ─────────────────────────────────────────────────────────────────────────────

export async function getLiveStatus(
  fetchOptions: RequestInit = {},
): Promise<LiveStatus> {
  const res = await fetchApi<ApiSingleResponse<LiveStatus>>('/live', fetchOptions)
  return res.data
}

// ─────────────────────────────────────────────────────────────────────────────
// Status
// ─────────────────────────────────────────────────────────────────────────────

export async function getSiteStatus(
  fetchOptions: RequestInit = {},
): Promise<SiteStatus> {
  const res = await fetchApi<ApiSingleResponse<SiteStatus>>('/status', fetchOptions)
  return res.data
}

// ─────────────────────────────────────────────────────────────────────────────
// Analytics (client-side only)
// ─────────────────────────────────────────────────────────────────────────────

export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    await fetch(`${API_URL}/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      keepalive: true, // Garante envio mesmo se o usuário navegar
    })
  } catch {
    // Analytics não deve quebrar a UX — falha silenciosa
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

export { ApiError }
