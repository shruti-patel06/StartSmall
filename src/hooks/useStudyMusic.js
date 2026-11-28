import { useState, useEffect, useCallback, useRef } from 'react';
import { startMusic, stopMusic, setMusicVolume } from '../services/musicService';

/**
 * Manages study music lifecycle tied to the focus session.
 * @param {object} opts
 * @param {string} opts.musicType - 'off'|'brown_noise'|'lofi'|'binaural'
 * @param {boolean} opts.autoStart - start music when hook mounts
 */
export function useStudyMusic({ musicType = 'off', autoStart = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const startedRef = useRef(false);

  const play = useCallback(
    (overrideType) => {
      const targetType = overrideType ?? musicType;
      if (targetType === 'off') return;
      startMusic(targetType, isMuted ? 0 : volume);
      setIsPlaying(true);
      startedRef.current = true;
    },
    [musicType, volume, isMuted]
  );

  const stop = useCallback(() => {
    stopMusic();
    setIsPlaying(false);
    startedRef.current = false;
  }, []);

  const switchMode = useCallback(
    (nextType) => {
      if (nextType === 'off') {
        stop();
        return;
      }
      if (isPlaying || startedRef.current) {
        startMusic(nextType, isMuted ? 0 : volume);
        setIsPlaying(true);
        startedRef.current = true;
      }
    },
    [isPlaying, isMuted, volume, stop]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      setMusicVolume(next ? 0 : volume);
      return next;
    });
  }, [volume]);

  const changeVolume = useCallback(
    (newVolume) => {
      const clamped = Math.max(0, Math.min(1, newVolume));
      setVolume(clamped);
      if (!isMuted) setMusicVolume(clamped);
    },
    [isMuted]
  );

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && musicType !== 'off') {
      play();
    }
    return () => {
      if (startedRef.current) stopMusic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stop music when component unmounts
  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, []);

  return {
    isPlaying,
    volume,
    isMuted,
    play,
    stop,
    switchMode,
    toggleMute,
    changeVolume,
    isEnabled: musicType !== 'off',
  };
}
