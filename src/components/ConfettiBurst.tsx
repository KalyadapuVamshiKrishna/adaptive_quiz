import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiBurstProps {
  trigger: boolean;
}

export const ConfettiBurst = ({ trigger }: ConfettiBurstProps) => {
  useEffect(() => {
    if (trigger) {
      const duration = 800;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const runAnimation = () => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return;
        }

        const particleCount = 2;
        
        confetti({
          particleCount,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
          colors: ['#2563EB', '#22D3EE', '#60A5FA', '#FFFFFF'],
          gravity: 1,
          scalar: 1.2,
          drift: 0,
          ticks: 200
        });

        requestAnimationFrame(runAnimation);
      };

      runAnimation();
    }
  }, [trigger]);

  return null;
};
