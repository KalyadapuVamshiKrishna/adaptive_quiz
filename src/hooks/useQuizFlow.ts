/**
 * Quiz Flow Hook (Session-Based Integration - Final)
 *
 * Handles complete adaptive quiz flow using backend session state.
 *  - Awareness → Question → Feedback → Next Concept
 *  - Backend endpoints:
 *      /api/quizzes/start
 *      /api/quizzes/awareness/next
 *      /api/quizzes/flashcards/:id/questions/by-rating
 *      /api/quizzes/questions/submit
 */

import { useQuizStore, setSessionState } from '@/store/quizStore';
import { QuestionResult } from '@/types/quiz';
import { toast } from '@/hooks/use-toast';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import {
  startQuizSession,
  getNextAwarenessCard,
  fetchQuestionByRating,
  submitAnswer,

} from '@/api/quizApi';

export const useQuizFlow = () => {
  const store = useQuizStore();
  const { playSuccess, playError, playTimeout } = useSoundEffects();

  /** 🟢 Start new quiz session */
  const startQuiz = async (topicId: string) => {
    try {
      store.selectSubject(topicId);
      store.setFlowStatus('loading');

      const data = await startQuizSession(topicId); // ✅ correct API call

      if (data.status === 'AWARENESS_CARD') {
        // Store session in Zustand
        store.setSessionState(data.sessionState);

        // Store concept/flashcard
        const flashcard = data.flashcard;
        store.setConcepts([
          {
            id: flashcard.id,
            name: data.subtopicName,
            explanation: flashcard.answer,
            formulaLatex: flashcard.question,
          },
        ]);

        store.setCurrentConcept({
          id: flashcard.id,
          name: data.subtopicName,
          explanation: flashcard.answer,
          formulaLatex: flashcard.question,
        });

        store.setFlowStatus('awareness');
      } else {
        toast({
          title: 'No flashcards found',
          description: 'This topic has no available concepts.',
          variant: 'destructive',
        });
        store.setFlowStatus('idle');
      }
    } catch (error) {
      console.error('❌ Error starting quiz:', error);
      toast({
        title: 'Failed to start quiz',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      store.setFlowStatus('idle');
    }
  };

  /** 🟡 Submit awareness rating → fetch adaptive question */
  const submitAwarenessRating = async (rating: number) => {
    const { currentConcept } = store;
    if (!currentConcept) return;

    try {
      store.setFlowStatus('loading');
      store.setAwarenessRating(rating);

      const question = await fetchQuestionByRating(currentConcept.id, rating);

      if (question.status === 'QUESTION_PRESENTED') {
        store.setCurrentQuestion(
          {
            id: question.questionId,
            conceptId: question.flashcardId,
            textLatex: question.text,
            options: question.options.map((opt: string, i: number) => ({
              id: `${i}`,
              text: opt,
            })),
            difficulty: question.difficulty?.toLowerCase() || 'medium',
          },
          new Date().toISOString()
        );
      } else {
        toast({
          title: 'No question found',
          description: 'No suitable question for this awareness rating.',
          variant: 'destructive',
        });
        store.setFlowStatus('awareness');
      }
    } catch (error) {
      console.error('❌ Error fetching question:', error);
      toast({
        title: 'Error fetching question',
        description: 'Please retry your awareness submission.',
        variant: 'destructive',
      });
      store.setFlowStatus('awareness');
    }
  };

 /** 🔵 Submit answer → handle feedback → next concept */
const submitQuestionAnswer = async (selectedOptionId: string | null) => {
  const { currentQuestion, sessionState } = store as any;
  if (!currentQuestion || !sessionState) {
    console.warn('⚠️ Missing currentQuestion or sessionState in store.');
    return;
  }

  try {
    const resultData = await submitAnswer(
      currentQuestion.id,
      selectedOptionId || '',
      sessionState
    );

    const result: QuestionResult = {
      questionId: currentQuestion.id,
      questionTextLatex: currentQuestion.textLatex,
      selectedOptionId,
      correctOptionId: resultData.correctOption,
      explanation: resultData.explanation,
      correct: resultData.correct,
    };

    store.setFeedback(result);

    // ✅ Unified feedback + auto-transition logic
    const delay = selectedOptionId === null ? 1000 : 2000; // shorter delay for timeout

    if (selectedOptionId === null) {
      playTimeout();
      toast({
        title: "Time's up!",
        description: 'Moving to next concept...',
        variant: 'destructive',
      });
    } else if (result.correct) {
      playSuccess();
      toast({
        title: 'Correct!',
        description: 'Excellent recall!',
        className: 'bg-success/10 border-success',
      });
    } else {
      playError();
      toast({
        title: 'Incorrect',
        description: 'Review the concept and try again later.',
        variant: 'destructive',
      });
    }

    // Wait for animation duration before switching screens
    await new Promise((r) => setTimeout(r, delay));

    // Record answer & reset state
    store.submitAnswer(selectedOptionId, result);
    store.clearFeedback();

    // Update backend session state
    store.setSessionState(resultData.sessionState);

    // 🔁 Automatically load next awareness flashcard
    store.setFlowStatus('loading');
    const nextCard = await getNextAwarenessCard(resultData.sessionState);

    if (nextCard.status === 'AWARENESS_CARD') {
      store.setCurrentConcept({
        id: nextCard.flashcard.id,
        name: nextCard.subtopicName,
        explanation: nextCard.flashcard.answer,
        formulaLatex: nextCard.flashcard.question,
      });
      store.setFlowStatus('awareness');
    } else {
      store.setFlowStatus('reviewing');
    }
  } catch (error) {
    console.error('❌ Error submitting answer:', error);
    toast({
      title: 'Error submitting answer',
      description: 'Please try again.',
      variant: 'destructive',
    });
  }
};

/** 🔴 Timer expiration handler */
const handleTimeout = async () => {
  await submitQuestionAnswer(null);
};


  return {
    startQuiz,
    submitAwarenessRating,
    submitQuestionAnswer,
    handleTimeout,
  };
};
