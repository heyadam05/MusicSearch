import { FiCheck, FiX } from 'react-icons/fi'
import type { SearchMediaType } from '../../types/music'
import styles from './SearchFilters.module.css'

interface SearchFiltersProps {
  isOpen: boolean
  mediaType: SearchMediaType
  genre: string
  genres: string[]
  minYear: number
  maxYear: number
  onMediaTypeChange: (type: SearchMediaType) => void
  onGenreChange: (genre: string) => void
  onMinYearChange: (year: number) => void
  onMaxYearChange: (year: number) => void
  onReset: () => void
  onClose: () => void
}

const mediaOptions: Array<{ value: SearchMediaType; label: string }> = [
  { value: 'songs', label: 'Songs' },
  { value: 'albums', label: 'Albums' },
  { value: 'videos', label: 'Music Videos' },
]

export function SearchFilters({
  isOpen,
  mediaType,
  genre,
  genres,
  minYear,
  maxYear,
  onMediaTypeChange,
  onGenreChange,
  onMinYearChange,
  onMaxYearChange,
  onReset,
  onClose,
}: SearchFiltersProps) {
  return (
    <aside className={`${styles.panel} ${isOpen ? styles.open : ''}`} aria-label="Search filters">
      <header>
        <h2>Filters</h2>
        <button type="button" onClick={onReset}>Reset</button>
        <button className={styles.close} type="button" onClick={onClose} aria-label="Close filters">
          <FiX />
        </button>
      </header>

      <fieldset>
        <legend>Type</legend>
        {mediaOptions.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name="media-type"
              value={option.value}
              checked={mediaType === option.value}
              onChange={() => onMediaTypeChange(option.value)}
            />
            <span className={styles.check}><FiCheck /></span>
            {option.label}
          </label>
        ))}
      </fieldset>

      <div className={styles.group}>
        <label htmlFor="genre-filter">Genre</label>
        <select id="genre-filter" value={genre} onChange={(event) => onGenreChange(event.target.value)}>
          <option value="all">All genres</option>
          {genres.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>

      <fieldset className={styles.years}>
        <legend>Release Year</legend>
        <div>
          <label>
            <span>From</span>
            <input
              type="number"
              min="1900"
              max={maxYear}
              value={minYear}
              onChange={(event) => onMinYearChange(Number(event.target.value))}
            />
          </label>
          <label>
            <span>To</span>
            <input
              type="number"
              min={minYear}
              max={new Date().getFullYear()}
              value={maxYear}
              onChange={(event) => onMaxYearChange(Number(event.target.value))}
            />
          </label>
        </div>
      </fieldset>
    </aside>
  )
}
