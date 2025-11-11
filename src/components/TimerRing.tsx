/**
 * Timer Ring Component
 * 
 * Displays a circular countdown timer with:
 * - Smooth stroke animation
 * - Color transitions based on time remaining
 * - Warning sound at 10 seconds
 * - Pulse animation when critical
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTimer } from '@/hooks/useTimer';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface TimerRingProps {
  duration: number;
  startTimeUTC: string | null;
  onTimeout: () => void;
}

export const TimerRing = ({ duration, startTimeUTC, onTimeout }: TimerRingProps) => {
  const { timeRemaining, progress, colorClass } = useTimer({
    duration,
    startTimeUTC,
    onTimeout
  });
  const { playWarning } = useSoundEffects();
  
  // Track if warning has been played to avoid duplicates
  const warningPlayedRef = useRef(false);

  /**
   * Play warning sound at 10 seconds remaining
   * Uses ref to prevent duplicate sounds on re-renders
   */
  useEffect(() => {
    if (timeRemaining === 10 && !warningPlayedRef.current) {
      playWarning();
      warningPlayedRef.current = true;
    }
    
    // Reset warning flag when timer restarts
    if (timeRemaining === duration) {
      warningPlayedRef.current = false;
    }
  }, [timeRemaining, duration, playWarning]);

  // SVG circle calculations for smooth animation
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Enable pulsing animation in critical time (last 10 seconds)
  const isPulsing = timeRemaining <= 10;

  return (
    <div className="relative" role="timer" aria-label={`${timeRemaining} seconds remaining`}>
      <svg width="120" height="120" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth="8"
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          className={colorClass}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "linear" }}
          style={{
            strokeDasharray: circumference
          }}
        />
      </svg>

      {/* Time text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={isPulsing ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: isPulsing ? Infinity : 0 }}
      >
        <span 
          className={`text-3xl font-bold ${isPulsing ? 'text-red-500' : 'text-foreground'}`}
          aria-hidden="true"
        >
          {timeRemaining}
        </span>
      </motion.div>

      {/* Accessibility live region */}
      {timeRemaining <= 10 && timeRemaining > 0 && (
        <div className="sr-only" role="alert" aria-live="assertive">
          {timeRemaining} seconds remaining
        </div>
      )}
    </div>
  );
};
