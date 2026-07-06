import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { MusicTrack } from '../types/music'
import { FavoritesContext } from './favoritesContext'

const STORAGE_KEY = 'music-search-favorites'

function isMusicTrack(value: unknown): value is MusicTrack {
  if (!value || typeof value !== 'object') return false
  const track = value as Partial<MusicTrack>
  return typeof track.id === 'number' && typeof track.title === 'string' &&
    typeof track.artist === 'string' && typeof track.album === 'string' &&
    typeof track.artwork === 'string' && typeof track.durationMs === 'number'
}

function readFavorites(): MusicTrack[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(parsed)) return []
    const seen = new Set<number>()
    return parsed.filter((track): track is MusicTrack => {
      if (!isMusicTrack(track) || seen.has(track.id)) return false
      seen.add(track.id)
      return true
    })
  } catch {
    return []
  }
}

function persist(favorites: MusicTrack[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  } catch {
    return
  }
}

export function FavoritesProvider({ children }: PropsWithChildren) {
  const [favorites, setFavorites] = useState<MusicTrack[]>(readFavorites)

  useEffect(() => {
    const syncFavorites = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setFavorites(readFavorites())
    }
    window.addEventListener('storage', syncFavorites)
    return () => window.removeEventListener('storage', syncFavorites)
  }, [])

  const isFavorite = useCallback(
    (trackId: number) => favorites.some((track) => track.id === trackId),
    [favorites],
  )

  const toggleFavorite = useCallback((track: MusicTrack) => {
    const exists = favorites.some((item) => item.id === track.id)
    const next = exists ? favorites.filter((item) => item.id !== track.id) : [track, ...favorites]
    persist(next)
    setFavorites(next)
    return !exists
  }, [favorites])

  const addMany = useCallback((tracks: MusicTrack[]) => {
    const ids = new Set(favorites.map((track) => track.id))
    const additions = tracks.filter((track) => {
      if (ids.has(track.id)) return false
      ids.add(track.id)
      return true
    })
    const next = [...additions, ...favorites]
    persist(next)
    setFavorites(next)
    return additions.length
  }, [favorites])

  const clearFavorites = useCallback(() => {
    persist([])
    setFavorites([])
  }, [])

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, addMany, clearFavorites }),
    [addMany, clearFavorites, favorites, isFavorite, toggleFavorite],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
