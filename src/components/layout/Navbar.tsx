import { useState } from 'react'
import { FiGithub, FiMenu, FiMoon, FiMusic, FiSun, FiX } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'
import { useTheme } from '../../context/themeContext'
import { socialLinks } from '../../config/socialLinks'

const links = [
  { to: '/', label: 'Home' },
  { to: '/search', label: 'Search' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/about', label: 'About' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={styles.header}>
      <nav className={`container ${styles.nav}`} aria-label="Main navigation">
        <NavLink className={styles.brand} to="/" onClick={() => setIsOpen(false)}>
          <span className={styles.brandIcon}><FiMusic aria-hidden="true" /></span>
          <span>Music Search</span>
        </NavLink>

        <button
          className={styles.menuButton}
          type="button"
          aria-expanded={isOpen}
          aria-controls="main-menu"
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        <div id="main-menu" className={`${styles.menu} ${isOpen ? styles.menuOpen : ''}`}>
          <div className={styles.links}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => isActive ? styles.active : undefined}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
                aria-label="Music Search on GitHub"
              >
                <FiGithub />
              </a>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
