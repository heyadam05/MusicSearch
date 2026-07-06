import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { AudioPlayer } from '../components/music/AudioPlayer'

export function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Music Search — Discover your favorite music',
      '/search': 'Search — Music Search',
      '/favorites': 'Favorites — Music Search',
      '/about': 'About — Music Search',
    }
    const basePath = location.pathname.startsWith('/album/') ? '/album' : location.pathname
    document.title = basePath === '/album' ? 'Album — Music Search' : (titles[basePath] ?? 'Page not found — Music Search')
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping = target?.matches('input, textarea, select, [contenteditable="true"]')
      if (event.key !== '/' || isTyping || event.ctrlKey || event.metaKey || event.altKey) return
      event.preventDefault()
      if (location.pathname === '/search') {
        document.getElementById('music-search')?.focus()
      } else {
        void navigate('/search')
        window.setTimeout(() => document.getElementById('music-search')?.focus(), 0)
      }
    }
    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [location.pathname, navigate])

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
      <AudioPlayer />
    </div>
  )
}
