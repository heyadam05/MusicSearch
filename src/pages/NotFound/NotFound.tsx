import { FiArrowLeft, FiDisc, FiHome } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export function NotFound() {
  return (
    <section className={`container ${styles.page}`}>
      <div className={styles.disc}><FiDisc /></div>
      <span className={styles.code}>404</span>
      <h1>Page not found</h1>
      <p>The page you are looking for may have moved, or the beat simply dropped out.</p>
      <div>
        <Link to="/"><FiHome /> Go Home</Link>
        <button type="button" onClick={() => window.history.back()}><FiArrowLeft /> Go Back</button>
      </div>
    </section>
  )
}
