import { create } from 'zustand';
import { QuizStore } from '@/types/quiz';

export const useQuizStore = create<QuizStore>((set) => ({
  flowStatus: 'idle',
  selectedSubjectId: null,
  concepts: [],
  currentConcept: null,
  currentQuestion: null,
  currentFeedback: null,
  userScore: 0,
  questionHistory: [],
  isA11ySpeaking: false,
  awarenessRating: null,
  timeStartedUTC: null,
  sessionState: null, // ✅ Added this

  setFlowStatus: (status) => set({ flowStatus: status }),

  setSessionState: (state) => set({ sessionState: state }), // ✅ Added this

  selectSubject: (subjectId) =>
    set({
      selectedSubjectId: subjectId,
      flowStatus: 'loading',
    }),

  setConcepts: (concepts) => set({ concepts }),

  setCurrentConcept: (concept) =>
    set({
      currentConcept: concept,
      awarenessRating: null,
      flowStatus: concept ? 'awareness' : 'reviewing',
    }),

  setCurrentQuestion: (question, timeStarted) =>
    set({
      currentQuestion: question,
      timeStartedUTC: timeStarted || new Date().toISOString(),
      flowStatus: question ? 'questioning' : 'reviewing',
    }),

  setAwarenessRating: (rating) => set({ awarenessRating: rating }),

  setFeedback: (feedback) => set({ currentFeedback: feedback }),

  clearFeedback: () => set({ currentFeedback: null }),

  submitAnswer: (selectedOptionId, result) =>
    set((state) => ({
      questionHistory: [...state.questionHistory, result],
      userScore: result.correct ? state.userScore + 1 : state.userScore,
      currentQuestion: null,
      currentFeedback: null,
      timeStartedUTC: null,
    })),

  resetQuiz: () =>
    set({
      flowStatus: 'idle',
      selectedSubjectId: null,
      concepts: [],
      currentConcept: null,
      currentQuestion: null,
      currentFeedback: null,
      userScore: 0,
      questionHistory: [],
      awarenessRating: null,
      timeStartedUTC: null,
      sessionState: null, // ✅ Reset session
    }),

  setA11ySpeaking: (speaking) => set({ isA11ySpeaking: speaking }),
}));
