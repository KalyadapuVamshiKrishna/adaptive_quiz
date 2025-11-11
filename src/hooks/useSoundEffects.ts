/**
 * Sound Effects Hook
 * 
 * Custom hook that provides a clean interface for playing sound effects
 * throughout the application. Handles user preferences and muting.
 */

import { useState, useCallback } from 'react';
import {
  playSuccessSound,
  playErrorSound,
  playWarningSound,
  playTimeoutSound,
  playClickSound
} from '@/utils/soundEffects';

/**
 * Hook return type definition
 */
interface UseSoundEffectsReturn {
  /** Plays success sound effect */
  playSuccess: () => void;
  /** Plays error sound effect */
  playError: () => void;
  /** Plays warning sound effect */
  playWarning: () => void;
  /** Plays timeout sound effect */
  playTimeout: () => void;
  /** Plays click sound effect */
  playClick: () => void;
  /** Current mute state */
  isMuted: boolean;
  /** Toggle mute on/off */
  toggleMute: () => void;
}

/**
 * Custom hook for managing sound effects in the quiz application
 * 
 * @returns Object containing sound effect functions and mute controls
 * 
 * @example
 * ```tsx
 * const { playSuccess, playError, isMuted, toggleMute } = useSoundEffects();
 * 
 * // Play sound on correct answer
 * if (isCorrect) {
 *   playSuccess();
 * }
 * ```
 */
export const useSoundEffects = (): UseSoundEffectsReturn => {
  // Track mute state - could be persisted to localStorage
  const [isMuted, setIsMuted] = useState(false);

  /**
   * Wrapper function that respects mute state
   */
  const playIfNotMuted = useCallback((soundFn: () => void) => {
    if (!isMuted) {
      soundFn();
    }
  }, [isMuted]);

  /**
   * Play success sound (correct answer)
   */
  const playSuccess = useCallback(() => {
    playIfNotMuted(playSuccessSound);
  }, [playIfNotMuted]);

  /**
   * Play error sound (incorrect answer)
   */
  const playError = useCallback(() => {
    playIfNotMuted(playErrorSound);
  }, [playIfNotMuted]);

  /**
   * Play warning sound (timer alert)
   */
  const playWarning = useCallback(() => {
    playIfNotMuted(playWarningSound);
  }, [playIfNotMuted]);

  /**
   * Play timeout sound (time expired)
   */
  const playTimeout = useCallback(() => {
    playIfNotMuted(playTimeoutSound);
  }, [playIfNotMuted]);

  /**
   * Play click sound (UI interaction)
   */
  const playClick = useCallback(() => {
    playIfNotMuted(playClickSound);
  }, [playIfNotMuted]);

  /**
   * Toggle mute state
   */
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return {
    playSuccess,
    playError,
    playWarning,
    playTimeout,
    playClick,
    isMuted,
    toggleMute
  };
};
