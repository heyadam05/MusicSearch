import type { PropsWithChildren } from 'react'
import { Toaster } from 'react-hot-toast'
import { AudioPlayerProvider } from '../context/AudioPlayerProvider'
import { FavoritesProvider } from '../context/FavoritesProvider'
import { ThemeProvider } from '../context/ThemeProvider'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <AudioPlayerProvider>
        <FavoritesProvider>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                color: 'var(--text)',
                background: 'var(--surface-strong)',
                border: '1px solid var(--border)',
              },
            }}
          />
        </FavoritesProvider>
      </AudioPlayerProvider>
    </ThemeProvider>
  )
}
