import { FiArrowLeft, FiCalendar, FiClock, FiDisc, FiHeart, FiList, FiPlay } from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'
import { TrackList } from '../../components/music/TrackList'
import { useAudioPlayer } from '../../context/audioPlayerContext'
import { useAlbum } from '../../hooks/useAlbum'
import { formatDuration } from '../../utils/formatDuration'
import styles from './Album.module.css'
import { useFavorites } from '../../context/favoritesContext'
import { toast } from 'react-hot-toast'

function formatDate(value: string) {
  if (!value) return 'Unknown'
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function Album() {
  const { albumId: albumIdParam } = useParams()
  const parsedId = Number(albumIdParam)
  const albumId = Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null
  const { album, isLoading, error, retry } = useAlbum(albumId)
  const player = useAudioPlayer()
  const { addMany } = useFavorites()

  if (albumId === null) {
    return (
      <section className={`container ${styles.state}`}>
        <FiDisc />
        <h1>Album not found</h1>
        <p>The album address is not valid.</p>
        <Link to="/search">Back to search</Link>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className={`container ${styles.loading}`} aria-label="Loading album">
        <div />
        <div><i /><i /><i /><i /></div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={`container ${styles.state}`} role="alert">
        <FiDisc />
        <h1>Something went wrong</h1>
        <p>{error}</p>
        <button type="button" onClick={retry}>Try again</button>
      </section>
    )
  }

  if (!album) {
    return (
      <section className={`container ${styles.state}`}>
        <FiDisc />
        <h1>Album not found</h1>
        <p>It may no longer be available in the iTunes catalog.</p>
        <Link to="/search">Back to search</Link>
      </section>
    )
  }

  const playableTracks = album.tracks.filter((track) => track.previewUrl)
  const totalDuration = album.tracks.reduce((total, track) => total + track.durationMs, 0)

  return (
    <section className={`container ${styles.page}`}>
      <Link className={styles.back} to="/search"><FiArrowLeft /> Back to search</Link>

      <div className={styles.hero}>
        <div className={styles.cover}>
          <img src={album.artwork} alt={`${album.title} cover`} />
          {playableTracks.length > 0 && (
            <button
              type="button"
              aria-label={`Play ${album.title}`}
              onClick={() => void player.playTrack(playableTracks[0], album.tracks)}
            >
              <FiPlay />
            </button>
          )}
        </div>

        <div className={styles.info}>
          <span className={styles.eyebrow}>Album</span>
          <h1>{album.title}</h1>
          <h2>{album.artist}</h2>
          <p className={styles.summary}>
            {album.genre} <i /> {new Date(album.releaseDate).getFullYear()} <i />
            {album.trackCount} songs <i /> {formatDuration(totalDuration)}
          </p>
          <div className={styles.actions}>
            <button
              className={styles.primary}
              type="button"
              disabled={playableTracks.length === 0}
              onClick={() => void player.playTrack(playableTracks[0], album.tracks)}
            >
              <FiPlay /> Play Album
            </button>
            <button
              type="button"
              onClick={() => {
                const added = addMany(album.tracks)
                if (added) toast.success(`${added} ${added === 1 ? 'song' : 'songs'} added to favorites`)
                else toast('All album tracks are already in favorites')
              }}
            >
              <FiHeart /> Add to Favorites
            </button>
          </div>
        </div>

        <dl className={styles.metadata}>
          <div><dt><FiCalendar /> Release Date</dt><dd>{formatDate(album.releaseDate)}</dd></div>
          <div><dt><FiDisc /> Genre</dt><dd>{album.genre}</dd></div>
          <div><dt><FiList /> Track Count</dt><dd>{album.tracks.length}</dd></div>
          <div><dt><FiClock /> Total Length</dt><dd>{formatDuration(totalDuration)}</dd></div>
          <div className={styles.copyright}><dt>©</dt><dd>{album.copyright}</dd></div>
        </dl>
      </div>

      <div className={styles.trackHeader}>
        <h2>Tracks</h2>
        <span>{album.tracks.length} songs, {formatDuration(totalDuration)}</span>
      </div>
      {album.tracks.length > 0 ? (
        <TrackList tracks={album.tracks} />
      ) : (
        <div className={styles.empty}>No tracks are available for this album.</div>
      )}
    </section>
  )
}
