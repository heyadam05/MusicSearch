import {
  FiCode,
  FiGithub,
  FiHeart,
  FiMusic,
  FiPlay,
  FiSearch,
  FiZap,
} from 'react-icons/fi'
import { SiAxios, SiFramer, SiReact, SiReactrouter, SiTypescript, SiVite } from 'react-icons/si'
import { Link } from 'react-router-dom'
import styles from './About.module.css'
import { socialLinks } from '../../config/socialLinks'

const technologies = [
  { icon: <SiReact />, name: 'React', text: 'Component-based user interfaces.' },
  { icon: <SiTypescript />, name: 'TypeScript', text: 'Typed code with safer refactoring.' },
  { icon: <SiReactrouter />, name: 'React Router', text: 'Declarative client-side routing.' },
  { icon: <SiAxios />, name: 'Axios', text: 'Reliable HTTP requests and cancellation.' },
  { icon: <SiFramer />, name: 'Framer Motion', text: 'Production-ready animations.' },
  { icon: <SiVite />, name: 'Vite', text: 'Fast development and optimized builds.' },
]

export function About() {
  return (
    <section className={`container ${styles.page}`}>
      <div className={styles.hero}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>About</span>
          <h1>About <strong>Music Search</strong></h1>
          <div className={styles.rule} />
          <p>
            Music Search is a modern web application that lets you discover songs,
            albums and artists using the iTunes Search API. Listen to 30-second
            previews, explore complete albums and save favorites for later.
          </p>
          <div className={styles.actions}>
            <Link to="/search"><FiMusic /> Start Searching</Link>
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noreferrer">
                <FiGithub /> View on GitHub
              </a>
            )}
          </div>
        </div>

        <div className={styles.illustration} aria-hidden="true">
          <div className={styles.orbit}><FiMusic /></div>
          <div className={styles.headphones}>
            <span />
            <i />
            <b />
          </div>
          <div className={styles.searchBubble}><FiSearch /> Search for music…</div>
          <div className={styles.preview}>
            <div><span>0:15</span><span>0:30</span></div>
            <i />
            <FiPlay />
          </div>
        </div>
      </div>

      <section className={styles.technology} aria-labelledby="technology-heading">
        <h2 id="technology-heading">Built with modern technologies</h2>
        <div className={styles.techGrid}>
          {technologies.map((technology) => (
            <article key={technology.name}>
              <span>{technology.icon}</span>
              <h3>{technology.name}</h3>
              <p>{technology.text}</p>
            </article>
          ))}
        </div>
      </section>

      <div className={styles.highlights}>
        <article>
          <span><FiMusic /></span>
          <div>
            <h2>Powered by iTunes API</h2>
            <p>Music data, album artwork and previews come from Apple’s public catalog.</p>
          </div>
        </article>
        <article>
          <span className={styles.pink}><FiHeart /></span>
          <div>
            <h2>Made with passion</h2>
            <p>A portfolio project built to combine music, thoughtful UI and clean code.</p>
          </div>
        </article>
        <article>
          <span><FiCode /></span>
          <div>
            <h2>Open source ready</h2>
            <p>Structured components, typed data and a maintainable feature architecture.</p>
          </div>
        </article>
      </div>

      <div className={styles.note}>
        <FiZap />
        <p>Tip: press <kbd>/</kbd> anywhere in the app to jump straight to music search.</p>
      </div>
    </section>
  )
}
