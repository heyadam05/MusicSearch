import { createContext, useContext } from 'react'
import type { MusicTrack } from '../types/music'

export interface AudioPlayerValue {
  currentTrack: MusicTrack | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  error: string | null
  hasPrevious: boolean
  hasNext: boolean
  playTrack: (track: MusicTrack, queue?: MusicTrack[]) => Promise<void>
  togglePlayback: () => Promise<void>
  playPrevious: () => Promise<void>
  playNext: () => Promise<void>
  seek: (time: number) => void
  setVolume: (volume: number) => void
  closePlayer: () => void
}

export const AudioPlayerContext = createContext<AudioPlayerValue | null>(null)

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext)
  if (!context) throw new Error('useAudioPlayer must be used inside AudioPlayerProvider')
  return context
}
