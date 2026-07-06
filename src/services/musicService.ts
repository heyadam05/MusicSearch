import { api } from './api'
import type {
  ItunesSearchResponse,
  ItunesTrackResult,
  MusicAlbum,
  MusicAlbumSummary,
  MusicCatalog,
  MusicTrack,
} from '../types/music'

const FALLBACK_ARTWORK =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="100%25" height="100%25" fill="%23111d2f"/%3E%3Cpath d="M190 70v125a39 39 0 1 1-18-33V98l-66 14v98a39 39 0 1 1-18-33V95z" fill="%233b82f6"/%3E%3C/svg%3E'

function toLargeArtwork(url?: string) {
  return url ? url.replace('100x100bb', '400x400bb') : FALLBACK_ARTWORK
}

function mapTrack(result: ItunesTrackResult): MusicTrack | null {
  if (!result.trackId || !result.trackName || !result.artistName) return null

  return {
    type: result.kind === 'music-video' ? 'video' : 'song',
    id: result.trackId,
    albumId: result.collectionId ?? null,
    artistId: result.artistId ?? null,
    title: result.trackName,
    album: result.collectionName ?? 'Unknown album',
    artist: result.artistName,
    artwork: toLargeArtwork(result.artworkUrl100),
    previewUrl: result.previewUrl ?? null,
    durationMs: result.trackTimeMillis ?? 0,
    releaseDate: result.releaseDate ?? '',
    genre: result.primaryGenreName ?? 'Music',
    explicit: result.trackExplicitness === 'explicit',
    trackNumber: result.trackNumber,
    discNumber: result.discNumber,
  }
}

function mapAlbum(result: ItunesTrackResult): MusicAlbumSummary | null {
  if (!result.collectionId || !result.collectionName || !result.artistName) return null

  return {
    type: 'album',
    id: result.collectionId,
    artistId: result.artistId ?? null,
    title: result.collectionName,
    artist: result.artistName,
    artwork: toLargeArtwork(result.artworkUrl100),
    releaseDate: result.releaseDate ?? '',
    genre: result.primaryGenreName ?? 'Music',
    trackCount: result.trackCount ?? 0,
    explicit: result.collectionExplicitness === 'explicit',
  }
}

export async function getAlbum(albumId: number, signal?: AbortSignal): Promise<MusicAlbum | null> {
  const { data } = await api.get<ItunesSearchResponse>('/lookup', {
    params: { id: albumId, entity: 'song' },
    signal,
  })

  const collection = data.results.find((result) => result.wrapperType === 'collection')
  if (!collection?.collectionId || !collection.collectionName || !collection.artistName) return null

  const tracks = data.results
    .filter((result) => result.wrapperType === 'track' && result.collectionId === collection.collectionId)
    .map(mapTrack)
    .filter((track): track is MusicTrack => track !== null)
    .sort((a, b) => (a.discNumber ?? 1) - (b.discNumber ?? 1) || (a.trackNumber ?? 0) - (b.trackNumber ?? 0))

  return {
    id: collection.collectionId,
    artistId: collection.artistId ?? null,
    title: collection.collectionName,
    artist: collection.artistName,
    artwork: toLargeArtwork(collection.artworkUrl100).replace('400x400bb', '700x700bb'),
    releaseDate: collection.releaseDate ?? '',
    genre: collection.primaryGenreName ?? 'Music',
    copyright: collection.copyright ?? 'Copyright information unavailable',
    trackCount: collection.trackCount ?? tracks.length,
    explicit: collection.collectionExplicitness === 'explicit',
    tracks,
  }
}

async function searchEntity(
  term: string,
  entity: 'song' | 'album' | 'musicVideo',
  limit: number,
  signal?: AbortSignal,
) {
  return api.get<ItunesSearchResponse>('/search', {
    params: { term, media: 'music', entity, limit, country: 'US' },
    signal,
  })
}

export async function searchMusicCatalog(term: string, signal?: AbortSignal): Promise<MusicCatalog> {
  const [songsResponse, albumsResponse, videosResponse] = await Promise.all([
    searchEntity(term, 'song', 120, signal),
    searchEntity(term, 'album', 60, signal),
    searchEntity(term, 'musicVideo', 60, signal),
  ])

  return {
    songs: songsResponse.data.results
      .map(mapTrack)
      .filter((track): track is MusicTrack => track !== null),
    albums: albumsResponse.data.results
      .map(mapAlbum)
      .filter((album): album is MusicAlbumSummary => album !== null),
    videos: videosResponse.data.results
      .map(mapTrack)
      .filter((track): track is MusicTrack => track !== null),
  }
}
