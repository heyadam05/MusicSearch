import { FiPause, FiPlay } from 'react-icons/fi'
import { useAudioPlayer } from '../../context/audioPlayerContext'
import type { MusicTrack } from '../../types/music'
import { formatDuration } from '../../utils/formatDuration'
import styles from './TrackList.module.css'
import { FavoriteButton } from './FavoriteButton'

interface TrackListProps {
  tracks: MusicTrack[]
}

export function TrackList({ tracks }: TrackListProps) {
  const player = useAudioPlayer()

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <span>#</span>
        <span>Title</span>
        <span>Artist</span>
        <span>Duration</span>
        <span aria-hidden="true" />
      </div>
      <ol className={styles.list}>
        {tracks.map((track, index) => {
          const isPlaying = player.currentTrack?.id === track.id && player.isPlaying
          return (
            <li key={track.id} className={player.currentTrack?.id === track.id ? styles.active : undefined}>
              <span className={styles.number}>{track.trackNumber ?? index + 1}</span>
              <button
                className={styles.play}
                type="button"
                disabled={!track.previewUrl}
                onClick={() => void player.playTrack(track, tracks)}
                aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
              >
                {isPlaying ? <FiPause /> : <FiPlay />}
              </button>
              <div className={styles.title}>
                <strong>{track.title}</strong>
                {track.explicit && <small>Explicit</small>}
              </div>
              <span className={styles.artist}>{track.artist}</span>
              <span className={styles.duration}>{formatDuration(track.durationMs)}</span>
              <FavoriteButton className={styles.favorite} track={track} />
            </li>
          )
        })}
      </ol>
    </div>
  )
}
