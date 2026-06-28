export type VideoType = 'horizontal' | 'short' | 'live' | 'premiere'
export type VideoStatus = 'published' | 'live' | 'upcoming' | 'unlisted'

export interface VideoViews {
  youtube: number
  local: number
}

export interface VideoLive {
  started_at: string | null
  ended_at: string | null
  scheduled_at: string | null
}

export interface VideoJsonLd {
  '@context': string
  '@type': string
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  embedUrl: string
  contentUrl: string
  duration?: string
  keywords?: string
  interactionStatistic?: {
    '@type': string
    interactionType: string
    userInteractionCount: number
  }
}

export interface Video {
  id: string
  title: string
  type: VideoType
  status: VideoStatus
  thumbnail: string
  duration: number
  duration_fmt: string
  views: VideoViews
  likes: number
  published_at: string
  featured: boolean
  category: string
  description?: string
  tags?: string[]
  comments?: number
  live?: VideoLive
  synced_at?: string
  json_ld?: VideoJsonLd
}

export interface Playlist {
  id: string
  title: string
  description: string
  thumbnail: string
  video_count: number
}

export interface PlaylistVideo extends Video {
  position: number
}

export interface LiveVideo {
  id: string
  title: string
  thumbnail: string
  status: VideoStatus
  live_url: string
  started_at: string | null
  scheduled_at: string | null
}

export interface LiveStatus {
  type: 'live' | 'premiere' | null
  video: LiveVideo | null
  scheduled_at: string | null
}

export interface SiteStatus {
  status: string
  version: string
  videos: {
    total: number
    horizontal: number
    short: number
    live: number
    premiere: number
  }
  last_sync: {
    status: string
    synced_at: string
    added: number
  } | null
  timestamp: string
}

export interface ApiMeta {
  total: number
  per_page: number
  has_more: boolean
  next_cursor: string | null
}

export interface ApiListResponse<T> {
  data: T[]
  meta: ApiMeta
}

export interface ApiSingleResponse<T> {
  data: T
}

export interface VideoFilters {
  type?: VideoType
  status?: VideoStatus | 'all'
  featured?: boolean
  category?: string
  search?: string
  cursor?: string
  per_page?: number
  order?: 'asc' | 'desc'
}

export type AnalyticsEventType = 'play' | 'pause' | 'complete' | 'impression' | 'share' | 'seek'

export interface AnalyticsEvent {
  video_id: string
  event_type: AnalyticsEventType
  value?: number
}
