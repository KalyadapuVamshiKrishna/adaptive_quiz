// Core type definitions for the quiz application

export interface Subject {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
}

export interface Concept {
  id: string;
  name: string;
  formulaLatex: string;
  explanation: string;
}

export interface Question {
  id: string;
  conceptId: string;
  textLatex: string;
  options: { id: string; text: string }[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuestionResult {
  questionId: string;
  questionTextLatex: string;
  selectedOptionId: string | null;
  correctOptionId: string;
  explanation: string;
  correct: boolean;
}

export interface QuizResult {
  score: number;
  total: number;
  details: QuestionResult[];
}

export type FlowStatus = 'idle' | 'loading' | 'awareness' | 'questioning' | 'reviewing';

export interface QuizStore {
  flowStatus: 'idle' | 'loading' | 'awareness' | 'questioning' | 'reviewing';
  selectedSubjectId: string | null;
  concepts: any[];
  currentConcept: any | null;
  currentQuestion: any | null;
  currentFeedback: any | null;
  userScore: number;
  questionHistory: any[];
  isA11ySpeaking: boolean;
  awarenessRating: number | null;
  timeStartedUTC: string | null;

  // ✅ Add session state and its setter
  sessionState: any | null;
  setSessionState: (state: any) => void;

  // existing methods
  setFlowStatus: (status: QuizStore['flowStatus']) => void;
  selectSubject: (subjectId: string) => void;
  setConcepts: (concepts: any[]) => void;
  setCurrentConcept: (concept: any) => void;
  setCurrentQuestion: (question: any, timeStarted?: string) => void;
  setAwarenessRating: (rating: number) => void;
  setFeedback: (feedback: any) => void;
  clearFeedback: () => void;
  submitAnswer: (selectedOptionId: string | null, result: any) => void;
  resetQuiz: () => void;
  setA11ySpeaking: (speaking: boolean) => void;
}

