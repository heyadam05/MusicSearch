export interface ItunesTrackResult {
  wrapperType?: string
  kind?: string
  trackId?: number
  collectionId?: number
  artistId?: number
  trackName?: string
  collectionName?: string
  artistName?: string
  artworkUrl100?: string
  previewUrl?: string
  trackTimeMillis?: number
  releaseDate?: string
  primaryGenreName?: string
  trackExplicitness?: string
  trackNumber?: number
  discNumber?: number
  copyright?: string
  trackCount?: number
  collectionExplicitness?: string
}

export interface ItunesSearchResponse {
  resultCount: number
  results: ItunesTrackResult[]
}

export interface MusicTrack {
  type: 'song' | 'video'
  id: number
  albumId: number | null
  artistId: number | null
  title: string
  album: string
  artist: string
  artwork: string
  previewUrl: string | null
  durationMs: number
  releaseDate: string
  genre: string
  explicit: boolean
  trackNumber?: number
  discNumber?: number
}

export interface MusicAlbum {
  id: number
  artistId: number | null
  title: string
  artist: string
  artwork: string
  releaseDate: string
  genre: string
  copyright: string
  trackCount: number
  explicit: boolean
  tracks: MusicTrack[]
}

export interface MusicAlbumSummary {
  type: 'album'
  id: number
  artistId: number | null
  title: string
  artist: string
  artwork: string
  releaseDate: string
  genre: string
  trackCount: number
  explicit: boolean
}

export interface MusicCatalog {
  songs: MusicTrack[]
  albums: MusicAlbumSummary[]
  videos: MusicTrack[]
}

export type SearchMediaType = keyof MusicCatalog
export type SearchSort = 'relevance' | 'title' | 'artist' | 'newest' | 'oldest'
