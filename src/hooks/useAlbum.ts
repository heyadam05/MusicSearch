import axios from 'axios'
import { useEffect, useState } from 'react'
import { getAlbum } from '../services/musicService'
import type { MusicAlbum } from '../types/music'

interface AlbumState {
  completedId: number | null
  album: MusicAlbum | null
  error: string | null
}

export function useAlbum(albumId: number | null) {
  const [state, setState] = useState<AlbumState>({
    completedId: null,
    album: null,
    error: null,
  })
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    if (albumId === null) return
    const controller = new AbortController()

    getAlbum(albumId, controller.signal)
      .then((album) => setState({ completedId: albumId, album, error: null }))
      .catch((error: unknown) => {
        if (axios.isCancel(error)) return
        setState({
          completedId: albumId,
          album: null,
          error: 'The album could not be loaded. Please try again.',
        })
      })

    return () => controller.abort()
  }, [albumId, retryKey])

  const isCurrent = state.completedId === albumId

  return {
    album: isCurrent ? state.album : null,
    error: isCurrent ? state.error : null,
    isLoading: albumId !== null && !isCurrent,
    retry: () => {
      setState((current) => ({ ...current, completedId: null }))
      setRetryKey((key) => key + 1)
    },
  }
}
