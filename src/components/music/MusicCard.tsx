import { FiPause, FiPlay } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAudioPlayer } from '../../context/audioPlayerContext'
import type { MusicTrack } from '../../types/music'
import { formatDuration } from '../../utils/formatDuration'
import styles from './MusicCard.module.css'
import { FavoriteButton } from './FavoriteButton'

interface MusicCardProps {
  track: MusicTrack
  queue: MusicTrack[]
  favoriteEnabled?: boolean
}

export function MusicCard({ track, queue, favoriteEnabled = true }: MusicCardProps) {
  const player = useAudioPlayer()
  const isPlaying = player.currentTrack?.id === track.id && player.isPlaying

  const year = track.releaseDate ? new Date(track.releaseDate).getFullYear() : '—'
  const content = (
    <>
      <img src={track.artwork} alt={`${track.album} cover`} loading="lazy" />
      <div className={styles.info}>
        <h3 title={track.title}>{track.title}</h3>
        <p>{track.artist}</p>
        <p className={styles.album} title={track.album}>{track.album}</p>
        <div className={styles.meta}>
          <span>{formatDuration(track.durationMs)}</span>
          <span>•</span>
          <span>{year}</span>
          <span>•</span>
          <span>{track.genre}</span>
        </div>
      </div>
    </>
  )

  return (
    <article className={styles.card}>
      {track.albumId ? (
        <Link className={styles.content} to={`/album/${track.albumId}`} aria-label={`View ${track.album}`}>
          {content}
        </Link>
      ) : (
        <div className={styles.content}>{content}</div>
      )}
      <button
        className={styles.play}
        type="button"
        disabled={!track.previewUrl}
        onClick={() => void player.playTrack(track, queue)}
        aria-label={isPlaying ? `Pause ${track.title}` : `Play preview of ${track.title}`}
        title={track.previewUrl ? 'Play 30-second preview' : 'Preview unavailable'}
      >
        {isPlaying ? <FiPause /> : <FiPlay />}
      </button>
      {favoriteEnabled && <FavoriteButton className={styles.favorite} track={track} />}
    </article>
  )
}
