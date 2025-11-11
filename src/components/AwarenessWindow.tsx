/**
 * Awareness Window Component (with Timer + Safe Math Rendering + Stable Countdown)
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { RatingScale } from './RatingScale';
import { TimerRing } from './TimerRing';

interface AwarenessWindowProps {
  flashcard?: {
    id: string;
    subtopicName: string;
    question: string;
    answer: string;
  };
  onSubmit: (rating: number) => void;
}

export const AwarenessWindow = ({ flashcard, onSubmit }: AwarenessWindowProps) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [startTime, setStartTime] = useState<string | null>(null);
  const { playClick, playTimeout } = useSoundEffects();

  // Reset timer each time a new flashcard appears
  useEffect(() => {
    if (flashcard?.id) {
      setTimeLeft(30);
      setStartTime(new Date().toISOString());
      setSelectedRating(null);
    }
  }, [flashcard?.id]);

  // Timer countdown logic
  useEffect(() => {
    if (!flashcard || selectedRating !== null) return;

    if (timeLeft <= 0) {
      playTimeout();
      onSubmit(3); // auto-submit neutral rating
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, flashcard, selectedRating]);

  // Rating selection
  const handleRatingSelect = (rating: number) => {
    playClick();
    setSelectedRating(rating);
    setTimeout(() => onSubmit(rating), 400);
  };

  // Fallback if flashcard is undefined
  if (!flashcard) {
    return (
      <div className="flex justify-center items-center h-[400px] text-muted-foreground">
        Loading concept...
      </div>
    );
  }

  // Clean math syntax for KaTeX (remove leading/trailing $)
  const cleanedAnswer = flashcard.answer
    ?.replace(/^\$+|\$+$/g, '')
    ?.trim();

  const isFormula = cleanedAnswer?.match(/[=+\-*/^]|\\frac|\\sqrt|\\dfrac|\\left|\\right/);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-card rounded-[20px] p-10 shadow-2xl border border-border/50 relative">
        {/* Header + Timer */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="text-center flex-1">
            <h2 className="text-3xl font-display font-bold text-foreground mb-1">
              Concept Awareness
            </h2>
            <p className="text-muted-foreground">
              Rate your familiarity with this concept (1–5)
            </p>
          </div>

          {startTime && (
            <div className="flex-shrink-0">
              <TimerRing
                duration={30}
                startTimeUTC={startTime}
                onTimeout={() => {
                  playTimeout();
                  onSubmit(3);
                }}
              />
            </div>
          )}
        </motion.div>

        {/* Flashcard Display */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background/50 rounded-xl p-8 mb-8 border border-accent-cyan/20"
        >
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center leading-snug">
            {flashcard.subtopicName || 'Concept'}
          </h3>

          <div className="text-center space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {flashcard.question}
            </p>

            {isFormula ? (
              <div className="flex justify-center my-6">
                <div className="max-w-full overflow-x-auto px-4 text-center">
                  <BlockMath
                    math={cleanedAnswer}
                    errorColor="#dc2626"
                    renderError={(error) => (
                      <span className="text-destructive text-sm">{error.name}</span>
                    )}
                  />
                </div>
              </div>
            ) : (
              <p className="text-foreground text-lg leading-relaxed whitespace-pre-wrap">
                {flashcard.answer}
              </p>
            )}
          </div>
        </motion.div>

        {/* Rating Scale */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <RatingScale
            onSelect={handleRatingSelect}
            selectedRating={selectedRating}
          />
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-8 text-sm text-text-helper"
        >
          <span>1 = Never seen</span>
          <span>3 = Somewhat familiar</span>
          <span>5 = Expert</span>
        </motion.div>

        {/* Fallback text countdown */}
        <p className="text-xs text-muted-foreground text-center mt-3">
          Auto-submitting in {timeLeft}s
        </p>
      </div>

      {/* Accessibility */}
      <div className="sr-only" role="status" aria-live="polite">
        Rate your familiarity with {flashcard.subtopicName}
      </div>
    </motion.div>
  );
};
