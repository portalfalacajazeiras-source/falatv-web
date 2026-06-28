'use client'

import {
  useQuery,
  useInfiniteQuery,
  type UseQueryOptions,
  type InfiniteData,
} from '@tanstack/react-query'
import {
  getVideos,
  getVideo,
  getShorts,
  getPlaylists,
  getLiveStatus,
  getSiteStatus,
  trackEvent,
} from '@/lib/api'
import type { Video, VideoFilters, ApiListResponse, AnalyticsEvent } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// Query Keys
// ─────────────────────────────────────────────────────────────────────────────

export const queryKeys = {
  videos: (filters?: VideoFilters) => ['videos', filters] as const,
  video: (id: string) => ['video', id] as const,
  shorts: () => ['shorts'] as const,
  playlists: () => ['playlists'] as const,
  live: () => ['live'] as const,
  status: () => ['status'] as const,
}

// ─────────────────────────────────────────────────────────────────────────────
// Vídeos
// ─────────────────────────────────────────────────────────────────────────────

// Lista de vídeos com infinite scroll (cursor pagination)
export function useVideosInfinite(filters: Omit<VideoFilters, 'cursor'> = {}) {
  return useInfiniteQuery<
    ApiListResponse<Video>,
    Error,
    InfiniteData<ApiListResponse<Video>>,
    ReturnType<typeof queryKeys.videos>,
    string | undefined
  >({
    queryKey: queryKeys.videos(filters),
    queryFn: ({ pageParam }) =>
      getVideos({ ...filters, cursor: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.has_more ? (lastPage.meta.next_cursor ?? undefined) : undefined,
    staleTime: 60 * 1000, // 60 segundos
  })
}

// Vídeo individual
export function useVideo(youtubeId: string) {
  return useQuery({
    queryKey: queryKeys.video(youtubeId),
    queryFn: () => getVideo(youtubeId),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: Boolean(youtubeId),
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Shorts — infinite scroll vertical
// ─────────────────────────────────────────────────────────────────────────────

export function useShortsInfinite() {
  return useInfiniteQuery<
    ApiListResponse<Video>,
    Error,
    InfiniteData<ApiListResponse<Video>>,
    ReturnType<typeof queryKeys.shorts>,
    string | undefined
  >({
    queryKey: queryKeys.shorts(),
    queryFn: ({ pageParam }) => getShorts(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.has_more ? (lastPage.meta.next_cursor ?? undefined) : undefined,
    staleTime: 2 * 60 * 1000,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Playlists
// ─────────────────────────────────────────────────────────────────────────────

export function usePlaylists() {
  return useQuery({
    queryKey: queryKeys.playlists(),
    queryFn: getPlaylists,
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Live — polling a cada 30 segundos
// ─────────────────────────────────────────────────────────────────────────────

export function useLiveStatus() {
  return useQuery({
    queryKey: queryKeys.live(),
    queryFn: getLiveStatus,
    refetchInterval: 30 * 1000, // Polling 30s
    staleTime: 0,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Status do site
// ─────────────────────────────────────────────────────────────────────────────

export function useSiteStatus() {
  return useQuery({
    queryKey: queryKeys.status(),
    queryFn: getSiteStatus,
    staleTime: 5 * 60 * 1000,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Analytics
// ─────────────────────────────────────────────────────────────────────────────

export function useTrackEvent() {
  return (event: AnalyticsEvent) => {
    trackEvent(event)
  }
}
