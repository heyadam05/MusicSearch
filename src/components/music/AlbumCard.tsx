import { FiDisc, FiHeart } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import type { MusicAlbumSummary } from '../../types/music'
import styles from './AlbumCard.module.css'

interface AlbumCardProps {
  album: MusicAlbumSummary
}

export function AlbumCard({ album }: AlbumCardProps) {
  const year = album.releaseDate ? new Date(album.releaseDate).getFullYear() : '—'

  return (
    <article className={styles.card}>
      <Link to={`/album/${album.id}`} aria-label={`View album ${album.title}`}>
        <div className={styles.cover}>
          <img src={album.artwork} alt={`${album.title} cover`} loading="lazy" />
          <span><FiDisc /></span>
        </div>
        <div className={styles.info}>
          <h3 title={album.title}>{album.title}</h3>
          <p>{album.artist}</p>
          <div>
            <span>{album.trackCount} tracks</span>
            <span>•</span>
            <span>{year}</span>
            <span>•</span>
            <span>{album.genre}</span>
          </div>
        </div>
      </Link>
      <span className={styles.decoration} aria-hidden="true"><FiHeart /></span>
    </article>
  )
}
