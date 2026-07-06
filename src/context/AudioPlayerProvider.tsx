import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { MusicTrack } from '../types/music'
import { AudioPlayerContext } from './audioPlayerContext'

export function AudioPlayerProvider({ children }: PropsWithChildren) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const queueRef = useRef<MusicTrack[]>([])
  const currentTrackRef = useRef<MusicTrack | null>(null)
  const [queue, setQueue] = useState<MusicTrack[]>([])
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(30)
  const [volume, setVolumeState] = useState(0.8)
  const [error, setError] = useState<string | null>(null)

  const findCurrentIndex = useCallback(() => {
    const id = currentTrackRef.current?.id
    return id ? queueRef.current.findIndex((track) => track.id === id) : -1
  }, [])

  const loadAndPlay = useCallback(async (track: MusicTrack) => {
    const audio = audioRef.current
    if (!audio) return
    if (!track.previewUrl) {
      setError('A preview is not available for this song.')
      return
    }

    setError(null)
    currentTrackRef.current = track
    setCurrentTrack(track)

    if (audio.src !== track.previewUrl) {
      audio.src = track.previewUrl
      audio.currentTime = 0
      setCurrentTime(0)
    }

    try {
      await audio.play()
    } catch {
      setIsPlaying(false)
      setError('The preview could not be played. Please try another song.')
    }
  }, [])

  const playNext = useCallback(async () => {
    const index = findCurrentIndex()
    const next = queueRef.current.slice(index + 1).find((track) => track.previewUrl)
    if (next) await loadAndPlay(next)
  }, [findCurrentIndex, loadAndPlay])

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.volume = 0.8
    audioRef.current = audio

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 30)
    const handleEnded = () => {
      setIsPlaying(false)
      void playNext()
    }
    const handleError = () => {
      setIsPlaying(false)
      setError('The preview could not be loaded.')
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleDuration)
    audio.addEventListener('durationchange', handleDuration)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.pause()
      audioRef.current = null
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleDuration)
      audio.removeEventListener('durationchange', handleDuration)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [playNext])

  const value = useMemo(() => {
    const currentIndex = currentTrack ? queue.findIndex((track) => track.id === currentTrack.id) : -1
    const playableBefore = queue.slice(0, currentIndex).some((track) => track.previewUrl)
    const playableAfter = queue.slice(currentIndex + 1).some((track) => track.previewUrl)

    return {
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      error,
      hasPrevious: playableBefore,
      hasNext: playableAfter,
      playTrack: async (track: MusicTrack, queue: MusicTrack[] = []) => {
        if (queue.length) {
          queueRef.current = queue
          setQueue(queue)
        } else if (!queueRef.current.some((item) => item.id === track.id)) {
          queueRef.current = [track]
          setQueue([track])
        }

        if (currentTrackRef.current?.id === track.id) {
          const audio = audioRef.current
          if (!audio) return
          if (audio.paused) await loadAndPlay(track)
          else audio.pause()
          return
        }

        await loadAndPlay(track)
      },
      togglePlayback: async () => {
        const audio = audioRef.current
        if (!audio) return
        if (!currentTrackRef.current) return
        if (audio.paused) await loadAndPlay(currentTrackRef.current)
        else audio.pause()
      },
      playPrevious: async () => {
        const index = findCurrentIndex()
        const previous = queueRef.current.slice(0, index).reverse().find((track) => track.previewUrl)
        if (previous) await loadAndPlay(previous)
      },
      playNext,
      seek: (time: number) => {
        const audio = audioRef.current
        if (!audio) return
        if (!Number.isFinite(time)) return
        audio.currentTime = Math.max(0, Math.min(time, duration))
        setCurrentTime(audio.currentTime)
      },
      setVolume: (nextVolume: number) => {
        const safeVolume = Math.max(0, Math.min(nextVolume, 1))
        if (audioRef.current) audioRef.current.volume = safeVolume
        setVolumeState(safeVolume)
      },
      closePlayer: () => {
        const audio = audioRef.current
        if (audio) {
          audio.pause()
          audio.removeAttribute('src')
          audio.load()
        }
        currentTrackRef.current = null
        queueRef.current = []
        setQueue([])
        setCurrentTrack(null)
        setCurrentTime(0)
        setError(null)
      },
    }
  }, [currentTime, currentTrack, duration, error, findCurrentIndex, isPlaying, loadAndPlay, playNext, queue, volume])

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>
}
