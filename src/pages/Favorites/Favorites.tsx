import { FiHeart, FiPlay, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { MusicCard } from '../../components/music/MusicCard'
import { useAudioPlayer } from '../../context/audioPlayerContext'
import { useFavorites } from '../../context/favoritesContext'
import styles from './Favorites.module.css'

export function Favorites() {
  const { favorites, clearFavorites } = useFavorites()
  const player = useAudioPlayer()
  const playableFavorites = favorites.filter((track) => track.previewUrl)

  const clearAll = () => {
    clearFavorites()
    toast('All favorites were cleared')
  }

  return (
    <section className={`container ${styles.page}`}>
      <header className={styles.header}>
        <div>
          <h1>My Favorites</h1>
          <p>Songs you love, all in one place.</p>
        </div>
        {favorites.length > 0 && (
          <div className={styles.actions}>
            <button
              type="button"
              disabled={playableFavorites.length === 0}
              onClick={() => void player.playTrack(playableFavorites[0], favorites)}
            >
              <FiPlay /> Play All
            </button>
            <button className={styles.clear} type="button" onClick={clearAll}>
              <FiTrash2 /> Clear All
            </button>
          </div>
        )}
      </header>

      {favorites.length === 0 ? (
        <div className={styles.empty}>
          <span><FiHeart /></span>
          <h2>No favorites yet.</h2>
          <p>Add songs by clicking the heart icon anywhere in Music Search.</p>
          <Link to="/search">Discover music</Link>
        </div>
      ) : (
        <>
          <div className={styles.count}>{favorites.length} {favorites.length === 1 ? 'song' : 'songs'}</div>
          <div className={styles.grid}>
            {favorites.map((track) => (
              <MusicCard key={track.id} track={track} queue={favorites} />
            ))}
          </div>
          <aside className={styles.tip}>
            <FiHeart />
            <div>
              <strong>Tip</strong>
              <span>Your favorites are saved in this browser and stay here after a refresh.</span>
            </div>
          </aside>
        </>
      )}
    </section>
  )
}
