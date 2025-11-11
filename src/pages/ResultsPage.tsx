import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/store/quizStore';
import { ResultScreen } from '@/components/ResultScreen';
import { QuizResult } from '@/types/quiz';

export const ResultsPage = () => {
  const navigate = useNavigate();
  const { questionHistory, userScore, selectedSubjectId, resetQuiz } = useQuizStore();

  const result: QuizResult = {
    score: userScore,
    total: questionHistory.length,
    details: questionHistory
  };

  const handleRetry = () => {
    if (selectedSubjectId) {
      navigate(`/quiz/${selectedSubjectId}`);
    }
  };

  const handleBackToSubjects = () => {
    resetQuiz();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-radial">
      <div className="container mx-auto px-4 py-16">
      <ResultScreen 
        result={result} 
        onRetry={handleRetry}
        onBackToSubjects={handleBackToSubjects}
        />
      </div>
    </div>
  );
};
