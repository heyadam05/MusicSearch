import {
  FiAlertCircle,
  FiPause,
  FiPlay,
  FiSkipBack,
  FiSkipForward,
  FiVolume1,
  FiVolume2,
  FiX,
} from 'react-icons/fi'
import { useAudioPlayer } from '../../context/audioPlayerContext'
import styles from './AudioPlayer.module.css'

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`
}

export function AudioPlayer() {
  const player = useAudioPlayer()
  if (!player.currentTrack) return null

  const { currentTrack } = player

  return (
    <aside className={styles.player} aria-label="Now playing">
      <div className={styles.track}>
        <img src={currentTrack.artwork} alt="" />
        <div>
          <strong title={currentTrack.title}>{currentTrack.title}</strong>
          <span>{currentTrack.artist}</span>
        </div>
      </div>

      <div className={styles.transport}>
        <div className={styles.buttons}>
          <button
            type="button"
            onClick={() => void player.playPrevious()}
            disabled={!player.hasPrevious}
            aria-label="Previous song"
          >
            <FiSkipBack />
          </button>
          <button
            className={styles.mainButton}
            type="button"
            onClick={() => void player.togglePlayback()}
            aria-label={player.isPlaying ? 'Pause' : 'Play'}
          >
            {player.isPlaying ? <FiPause /> : <FiPlay />}
          </button>
          <button
            type="button"
            onClick={() => void player.playNext()}
            disabled={!player.hasNext}
            aria-label="Next song"
          >
            <FiSkipForward />
          </button>
        </div>
        <div className={styles.progress}>
          <span>{formatTime(player.currentTime)}</span>
          <label>
            <span className={styles.srOnly}>Playback position</span>
            <input
              type="range"
              min="0"
              max={player.duration || 30}
              step="0.1"
              value={Math.min(player.currentTime, player.duration || 30)}
              onChange={(event) => player.seek(Number(event.target.value))}
              style={{ '--progress': `${(player.currentTime / (player.duration || 30)) * 100}%` } as React.CSSProperties}
            />
          </label>
          <span>{formatTime(player.duration)}</span>
        </div>
      </div>

      <div className={styles.options}>
        {player.error && (
          <span className={styles.error} title={player.error} aria-label={player.error}>
            <FiAlertCircle />
          </span>
        )}
        {player.volume === 0 ? <FiVolume1 aria-hidden="true" /> : <FiVolume2 aria-hidden="true" />}
        <label className={styles.volume}>
          <span className={styles.srOnly}>Volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={player.volume}
            onChange={(event) => player.setVolume(Number(event.target.value))}
            style={{ '--progress': `${player.volume * 100}%` } as React.CSSProperties}
          />
        </label>
        <button type="button" onClick={player.closePlayer} aria-label="Close player"><FiX /></button>
      </div>
    </aside>
  )
}
