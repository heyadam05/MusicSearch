import axios from 'axios'
import { useEffect, useState } from 'react'
import { getTrendingSearches } from '../services/trendingService'

const FALLBACK_TRENDS = ['Taylor Swift', 'The Weeknd', 'Coldplay', 'Eminem', 'Doja Cat', 'Adele']

export function useTrendingSearches() {
  const [trends, setTrends] = useState<string[]>([])

  useEffect(() => {
    const controller = new AbortController()

    getTrendingSearches(controller.signal)
      .then(setTrends)
      .catch((error: unknown) => {
        if (!axios.isCancel(error)) setTrends(FALLBACK_TRENDS)
      })

    return () => controller.abort()
  }, [])

  return trends
}
