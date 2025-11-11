import { useState, useEffect, useCallback } from 'react';

interface UseTimerOptions {
  duration: number; // in seconds
  onTimeout: () => void;
  startTimeUTC?: string | null;
}

export const useTimer = ({ duration, onTimeout, startTimeUTC }: UseTimerOptions) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!startTimeUTC) {
      setTimeRemaining(duration);
      setIsActive(false);
      return;
    }

    setIsActive(true);
    
    // Calculate accurate time remaining based on server time
    const startTime = new Date(startTimeUTC).getTime();
    const updateTimer = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        setIsActive(false);
        onTimeout();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTimeUTC, duration, onTimeout]);

  const progress = (timeRemaining / duration) * 100;
  
  // Color phases
  let colorClass = 'stroke-primary-blue';
  if (timeRemaining <= 10) {
    colorClass = 'stroke-red-500';
  } else if (timeRemaining <= 30) {
    colorClass = 'stroke-warning';
  }

  return {
    timeRemaining,
    isActive,
    progress,
    colorClass
  };
};
