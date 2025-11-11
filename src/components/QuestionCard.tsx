/**
 * Question Card Component (Refactored for Backend Integration)
 *
 * Displays a quiz question with:
 * - Auto-detection of math vs. text question
 * - Multiple choice options (string[] or {id, text}[])
 * - Countdown timer and submission logic
 * - Feedback animations and confetti celebration
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Question } from '@/types/quiz';
import { TimerRing } from './TimerRing';
import { ConfettiBurst } from './ConfettiBurst';
import { Button } from './ui/button';

interface QuestionCardProps {
  question: Question;
  timeStartedUTC: string | null;
  correctOptionId?: string;
  isCorrect?: boolean;
  showFeedback?: boolean;
  onSubmit: (selectedOptionId: string | null) => void;
  onTimeout: () => void;
}

export const QuestionCard = ({
  question,
  timeStartedUTC,
  correctOptionId,
  isCorrect,
  showFeedback = false,
  onSubmit,
  onTimeout,
}: QuestionCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset when a new question is loaded
  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
  }, [question.id]);

  /** Determine if question text contains math syntax */
  const isMath = !!question.textLatex?.match(/[=+\-*/^]|\\frac|\\sqrt/);

  /** Submit handler */
  const handleSubmit = () => {
    if (selectedOption && !isSubmitted) {
      setIsSubmitted(true);
      onSubmit(selectedOption);
    }
  };

  // Normalize options (supports both backend string[] and frontend {id, text}[])
  const normalizedOptions = (() => {
    const opts = question.options as unknown[];
    if (!Array.isArray(opts) || opts.length === 0) return [] as { id: string; text: string }[];

    if (typeof opts[0] === 'string') {
      return opts.map((t, i) => ({
        id: `${i}`,
        text: String(t),
      }));
    }

    return opts as { id: string; text: string }[];
  })();

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{
        opacity: 1,
        x: 0,
        ...(showFeedback && !isCorrect && { x: [0, -8, 8, -8, 8, 0] }), // shake on wrong answer
      }}
      exit={{ opacity: 0, x: -100 }}
      transition={{
        duration: showFeedback && !isCorrect ? 0.4 : 0.25,
        delay: 0.1,
      }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Confetti on correct answer */}
      <ConfettiBurst trigger={showFeedback && isCorrect === true} />

      <div
        className={`
          bg-card rounded-[20px] p-10 shadow-2xl border-2 transition-all duration-300
          ${
            showFeedback && isCorrect === true
              ? 'border-success shadow-[0_0_30px_rgba(74,222,128,0.4)]'
              : showFeedback && isCorrect === false
              ? 'border-destructive shadow-[0_0_30px_rgba(220,38,38,0.4)]'
              : 'border-border/50'
          }
        `}
      >
        {/* Header with difficulty + timer */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary-blue/20 text-primary-blue mb-4">
              {question.difficulty?.toUpperCase() || 'MEDIUM'}
            </span>
          </div>

          <TimerRing duration={60} startTimeUTC={timeStartedUTC} onTimeout={onTimeout} />
        </div>

        {/* Question text */}
      <div className="mb-8 text-center">
  <h3
    className="text-xl font-semibold text-foreground leading-relaxed tracking-wide
               whitespace-pre-wrap break-words text-balance mx-auto max-w-2xl"
  >
    {isMath ? (
      <InlineMath math={question.textLatex} />
    ) : (
      question.textLatex
    )}
  </h3>
</div>


        {/* Answer Options */}
        <div className="space-y-3 mb-8" role="radiogroup" aria-label="Answer options">
          <AnimatePresence>
            {normalizedOptions.map((option, index) => {
              const isSelected = selectedOption === option.id;
              const isCorrectOption = showFeedback && option.id === correctOptionId;
              const isWrongSelection = showFeedback && isSelected && !isCorrect;

              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => !isSubmitted && setSelectedOption(option.id)}
                  disabled={isSubmitted}
                  className={`
                    w-full text-left p-4 rounded-xl border-2 transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-offset-2
                    ${isCorrectOption
                      ? 'border-success bg-success/20 shadow-[0_0_20px_rgba(74,222,128,0.4)]'
                      : isWrongSelection
                      ? 'border-destructive bg-destructive/20 shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                      : isSelected
                      ? 'border-accent-cyan bg-accent-cyan/10 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                      : 'border-border bg-background/30 hover:border-primary-blue hover:bg-primary-blue/5'}
                    ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Option ${index + 1}: ${option.text}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Circle indicator */}
                    <div
                      className={`
                        w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                        ${isCorrectOption
                          ? 'border-success'
                          : isWrongSelection
                          ? 'border-destructive'
                          : isSelected
                          ? 'border-accent-cyan'
                          : 'border-muted-foreground'}
                      `}
                    >
                      {(isSelected || isCorrectOption) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`w-3 h-3 rounded-full ${
                            isCorrectOption
                              ? 'bg-success'
                              : isWrongSelection
                              ? 'bg-destructive'
                              : 'bg-accent-cyan'
                          }`}
                        />
                      )}
                    </div>

                    {/* Option text */}
                    <span className="text-foreground font-medium">{option.text}</span>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Button
            onClick={handleSubmit}
            disabled={!selectedOption || isSubmitted}
            className="w-full h-12 text-lg font-semibold bg-gradient-blue hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitted ? 'Submitted...' : 'Submit Answer'}
          </Button>
        </motion.div>
      </div>

      {/* Accessibility */}
      <div className="sr-only" role="status" aria-live="polite">
        Question ready: {isMath ? 'Math question' : 'Text question'}
      </div>
    </motion.div>
  );
};
