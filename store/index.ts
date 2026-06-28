'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Video } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// Player Store — estado do player de vídeo
// ─────────────────────────────────────────────────────────────────────────────

interface PlayerState {
  activeVideoId: string | null
  isPlaying: boolean
  setActiveVideo: (id: string | null) => void
  setPlaying: (playing: boolean) => void
  reset: () => void
}

export const usePlayerStore = create<PlayerState>()((set) => ({
  activeVideoId: null,
  isPlaying: false,
  setActiveVideo: (id) => set({ activeVideoId: id, isPlaying: Boolean(id) }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  reset: () => set({ activeVideoId: null, isPlaying: false }),
}))

// ─────────────────────────────────────────────────────────────────────────────
// UI Store — estado de interface
// ─────────────────────────────────────────────────────────────────────────────

interface UIState {
  searchOpen: boolean
  searchQuery: string
  setSearchOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
}

export const useUIStore = create<UIState>()((set) => ({
  searchOpen: false,
  searchQuery: '',
  setSearchOpen: (open) => set({ searchOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))

// ─────────────────────────────────────────────────────────────────────────────
// History Store — "Continue assistindo" persistido
// ─────────────────────────────────────────────────────────────────────────────

interface HistoryItem {
  videoId: string
  title: string
  thumbnail: string
  progressSeconds: number
  durationSeconds: number
  watchedAt: string
}

interface HistoryState {
  items: HistoryItem[]
  addItem: (item: Omit<HistoryItem, 'watchedAt'>) => void
  updateProgress: (videoId: string, progressSeconds: number) => void
  removeItem: (videoId: string) => void
  clear: () => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.filter((i) => i.videoId !== item.videoId)
          return {
            items: [{ ...item, watchedAt: new Date().toISOString() }, ...existing].slice(0, 20),
          }
        }),

      updateProgress: (videoId, progressSeconds) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.videoId === videoId ? { ...i, progressSeconds } : i,
          ),
        })),

      removeItem: (videoId) =>
        set((state) => ({
          items: state.items.filter((i) => i.videoId !== videoId),
        })),

      clear: () => set({ items: [] }),
    }),
    { name: 'falatv-history' },
  ),
)
