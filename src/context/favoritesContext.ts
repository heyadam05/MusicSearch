import { createContext, useContext } from 'react'
import type { MusicTrack } from '../types/music'

export interface FavoritesValue {
  favorites: MusicTrack[]
  isFavorite: (trackId: number) => boolean
  toggleFavorite: (track: MusicTrack) => boolean
  addMany: (tracks: MusicTrack[]) => number
  clearFavorites: () => void
}

export const FavoritesContext = createContext<FavoritesValue | null>(null)

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used inside FavoritesProvider')
  return context
}
