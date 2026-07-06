import axios from 'axios'
import { useEffect, useState } from 'react'
import { searchMusicCatalog } from '../services/musicService'
import type { MusicCatalog } from '../types/music'

interface MusicSearchState {
  completedQuery: string
  catalog: MusicCatalog
  error: string | null
}

const emptyCatalog: MusicCatalog = { songs: [], albums: [], videos: [] }

const initialState: MusicSearchState = {
  completedQuery: '',
  catalog: emptyCatalog,
  error: null,
}

export function useMusicSearch(query: string) {
  const [state, setState] = useState(initialState)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    const normalizedQuery = query.trim()
    if (!normalizedQuery) return

    const controller = new AbortController()

    searchMusicCatalog(normalizedQuery, controller.signal)
      .then((catalog) => setState({ completedQuery: normalizedQuery, catalog, error: null }))
      .catch((error: unknown) => {
        if (axios.isCancel(error)) return
        setState({
          completedQuery: normalizedQuery,
          catalog: emptyCatalog,
          error: 'Something went wrong while searching. Please try again.',
        })
      })

    return () => controller.abort()
  }, [query, retryKey])

  const normalizedQuery = query.trim()
  const isCurrent = state.completedQuery === normalizedQuery

  return {
    catalog: isCurrent ? state.catalog : emptyCatalog,
    error: isCurrent ? state.error : null,
    isLoading: Boolean(normalizedQuery) && !isCurrent,
    retry: () => {
      setState((current) => ({ ...current, completedQuery: '' }))
      setRetryKey((key) => key + 1)
    },
  }
}
