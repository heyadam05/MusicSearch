import axios from 'axios'

interface AppleChartEntry {
  'im:artist': {
    label: string
  }
}

interface AppleFeedResponse {
  feed: {
    entry: AppleChartEntry[]
  }
}

const TRENDING_URL = 'https://itunes.apple.com/us/rss/topsongs/limit=25/json'

export async function getTrendingSearches(signal?: AbortSignal): Promise<string[]> {
  const { data } = await axios.get<AppleFeedResponse>(TRENDING_URL, {
    signal,
    timeout: 12_000,
  })

  const artists = data.feed.entry.flatMap((entry) =>
    entry['im:artist'].label.split(/,|&| feat\.?/i).map((artist) => artist.trim()),
  )

  return [...new Set(artists.filter(Boolean))].slice(0, 6)
}
