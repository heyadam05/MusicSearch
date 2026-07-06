import styles from './MusicCardSkeleton.module.css'

export function MusicCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.cover} />
      <div className={styles.lines}>
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  )
}
