import { FiGithub, FiLinkedin, FiMusic } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'
import styles from './Footer.module.css'
import { socialLinks } from '../../config/socialLinks'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.content}`}>
        <div>
          <NavLink className={styles.brand} to="/">
            <FiMusic aria-hidden="true" />
            Music Search
          </NavLink>
          <p>Your music. Your discovery. Your way.</p>
        </div>
        <div className={styles.center}>
          <nav aria-label="Footer navigation">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/search">Search</NavLink>
            <NavLink to="/favorites">Favorites</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
          <small>© {new Date().getFullYear()} Music Search. All rights reserved.</small>
        </div>
        <div className={styles.socials}>
          {socialLinks.github && (
            <a href={socialLinks.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <FiGithub />
            </a>
          )}
          {socialLinks.linkedIn && (
            <a href={socialLinks.linkedIn} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <FiLinkedin />
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
