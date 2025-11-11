import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/store/quizStore';
import { useQuizFlow } from '@/hooks/useQuizFlow';
import { AwarenessWindow } from '@/components/AwarenessWindow';
import { QuestionCard } from '@/components/QuestionCard';
import { Loader2 } from 'lucide-react';

export const QuizPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { 
    flowStatus, 
    currentConcept, 
    currentQuestion,
    currentFeedback,
    timeStartedUTC
  } = useQuizStore();
  
  const { startQuiz, submitAwarenessRating, submitQuestionAnswer, handleTimeout } = useQuizFlow();

  // Start quiz when component mounts
  useEffect(() => {
    if (subjectId && flowStatus === 'idle') {
      startQuiz(subjectId);
    }
  }, [subjectId]);

  // Navigate to results when quiz is complete
  useEffect(() => {
    if (flowStatus === 'reviewing') {
      navigate('/results');
    }
  }, [flowStatus, navigate]);

  // Show loading state
  if (flowStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-radial flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-primary-blue animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Loading next concept...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-radial">
      <div className="container mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          {flowStatus === 'awareness' && currentConcept && (
            <AwarenessWindow
              flashcard={{
                id: currentConcept.id,
                subtopicName: currentConcept.name,
                question: currentConcept.formulaLatex || '',
                answer: currentConcept.explanation || '',
              }}
              onSubmit={submitAwarenessRating}
            />
          )}

          
          {flowStatus === 'questioning' && currentQuestion && (
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              timeStartedUTC={timeStartedUTC}
              correctOptionId={currentFeedback?.correctOptionId}
              isCorrect={currentFeedback?.correct}
              showFeedback={!!currentFeedback}
              onSubmit={submitQuestionAnswer}
              onTimeout={handleTimeout}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
