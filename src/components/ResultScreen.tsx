import { motion } from 'framer-motion';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { QuizResult } from '@/types/quiz';
import { Button } from './ui/button';
import { ConfettiBurst } from './ConfettiBurst';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ResultScreenProps {
  result: QuizResult;
  onRetry: () => void;
  onBackToSubjects: () => void;
}

export const ResultScreen = ({ result, onRetry, onBackToSubjects }: ResultScreenProps) => {
  const percentage = Math.round((result.score / result.total) * 100);
  const isHighScore = result.score >= 4;

  // ✅ Converts numeric option index ("0"–"3") → "A", "B", "C", "D"
  const indexToLetter = (idx: string | null) =>
    idx ? `Option ${String.fromCharCode(65 + Number(idx))}` : '—';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto px-6 sm:px-8"
    >
      <ConfettiBurst trigger={isHighScore} />

      <div className="bg-card rounded-[20px] p-8 sm:p-10 shadow-2xl border border-border/50 text-foreground">
        {/* ===================== HEADER ===================== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-display font-bold mb-3 tracking-tight">
            Quiz Complete!
          </h2>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          >
            <div className="text-7xl font-extrabold mb-1 bg-gradient-blue bg-clip-text text-transparent">
              {result.score}/{result.total}
            </div>
            <p className="text-lg text-muted-foreground font-medium">
              {percentage}% Correct · {isHighScore ? 'Excellent!' : 'Keep going!'}
            </p>
          </motion.div>
        </motion.div>

        {/* ===================== REVIEW SECTION ===================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6 mb-8"
        >
          <h3 className="text-2xl font-semibold mb-4">Question Review</h3>

          {result.details.map((detail, index) => {
            const isCorrect = detail.correct;

            return (
              <motion.div
                key={detail.questionId}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`rounded-2xl p-6 border-2 leading-relaxed ${
                  isCorrect
                    ? 'border-success/50 bg-success/5'
                    : 'border-destructive/50 bg-destructive/5'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    ) : (
                      <XCircle className="w-6 h-6 text-destructive" />
                    )}
                  </div>

                  {/* Question Content */}
                  <div className="flex-1 space-y-2">
                    {/* Question */}
                    <div className="text-lg font-medium text-foreground leading-relaxed break-words whitespace-pre-wrap">
                      {detail.questionTextLatex.includes('\\') ? (
                        <InlineMath math={detail.questionTextLatex} />
                      ) : (
                        <span>{detail.questionTextLatex}</span>
                      )}
                    </div>

                    {/* Answers */}
                    <div className="text-sm sm:text-base text-muted-foreground space-y-1.5">
                      {!isCorrect && (
                        <>
                          <p>
                            <span className="font-semibold text-foreground">Your answer:</span>{' '}
                            {detail.selectedOptionId !== null
                              ? indexToLetter(detail.selectedOptionId)
                              : 'No answer (timeout)'}
                          </p>
                          <p className="text-success font-semibold">
                            Correct answer: {detail.correctOptionId}
                          </p>
                        </>
                      )}
                      {isCorrect && (
                        <p className="text-success font-semibold">
                          Correct answer: {detail.correctOptionId}
                        </p>
                      )}
                      <p className="text-foreground/80 mt-2 italic leading-snug">
                        {detail.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ===================== ACTION BUTTONS ===================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            onClick={onRetry}
            className="flex-1 h-12 text-lg font-semibold bg-gradient-blue hover:opacity-90"
          >
            Retry Subject
          </Button>

          <Button
            onClick={onBackToSubjects}
            variant="outline"
            className="flex-1 h-12 text-lg font-semibold border-2 border-primary-blue text-primary-blue hover:bg-primary-blue/10"
          >
            Back to Subjects
          </Button>
        </motion.div>
      </div>

      {/* Accessibility */}
      <div className="sr-only" role="alert" aria-live="assertive">
        Final score: {result.score} out of {result.total}
      </div>
    </motion.div>
  );
};
