import { FiHeart } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useFavorites } from '../../context/favoritesContext'
import type { MusicTrack } from '../../types/music'
import styles from './FavoriteButton.module.css'

interface FavoriteButtonProps {
  track: MusicTrack
  className?: string
}

export function FavoriteButton({ track, className = '' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(track.id)

  return (
    <button
      className={`${styles.button} ${active ? styles.active : ''} ${className}`}
      type="button"
      aria-label={active ? `Remove ${track.title} from favorites` : `Add ${track.title} to favorites`}
      aria-pressed={active}
      title={active ? 'Remove from favorites' : 'Add to favorites'}
      onClick={() => {
        const added = toggleFavorite(track)
        if (added) toast.success(`${track.title} added to favorites`)
        else toast(`${track.title} removed from favorites`)
      }}
    >
      <FiHeart />
    </button>
  )
}
