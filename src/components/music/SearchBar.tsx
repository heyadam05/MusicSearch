import { useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import styles from './SearchBar.module.css'

interface SearchBarProps {
  initialValue: string
  isLoading?: boolean
  onSearch: (query: string) => void
}

export function SearchBar({ initialValue, isLoading = false, onSearch }: SearchBarProps) {
  const [value, setValue] = useState(initialValue)

  return (
    <form
      className={styles.form}
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        onSearch(value)
      }}
    >
      <FiSearch aria-hidden="true" />
      <label className={styles.srOnly} htmlFor="music-search">Search music</label>
      <input
        id="music-search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search for songs, artists, albums..."
        autoComplete="off"
      />
      {value && (
        <button
          className={styles.clear}
          type="button"
          aria-label="Clear search"
          onClick={() => setValue('')}
        >
          <FiX />
        </button>
      )}
      <button className={styles.submit} type="submit" disabled={!value.trim() || isLoading}>
        {isLoading ? 'Searching…' : 'Search'}
      </button>
    </form>
  )
}
