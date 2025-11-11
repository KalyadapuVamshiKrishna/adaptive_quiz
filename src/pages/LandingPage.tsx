import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SubjectCard } from '@/components/SubjectCard';
import { useQuizStore } from '@/store/quizStore';
import { fetchTopics } from '@/api/quizApi';

export const LandingPage = () => {
  const navigate = useNavigate();
  const resetQuiz = useQuizStore((state) => state.resetQuiz);
  
  type Topic = {
    id: string;
    name: string;
    description?: string;
  };

  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load topics from backend
  useEffect(() => {
    const loadTopics = async () => {
      try {
        const data = await fetchTopics();
        setTopics(data);
      } catch (err) {
        console.error("Error loading topics:", err);
        setError("Failed to load topics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadTopics();
  }, []);

  const handleSelectSubject = (subjectId: string) => {
    resetQuiz();
    navigate(`/quiz/${subjectId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-radial">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
            Adaptive Quiz Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Test your knowledge with concept-aware questions that adapt to your expertise level
          </p>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="h-1 w-32 mx-auto mt-8 bg-gradient-blue rounded-full"
          />
        </motion.div>

        {/* Topics Grid */}
        {loading && (
          <p className="text-center text-muted-foreground text-lg">Loading topics...</p>
        )}

        {error && (
          <p className="text-center text-red-500 text-lg">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {topics.map((topic, index) => (
              <SubjectCard
                key={topic.id}
                subject={{
                  id: topic.id,
                  name: topic.name,
                  description: "Start learning this topic with adaptive quizzes",
                }}
                onClick={() => handleSelectSubject(topic.id)}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16 text-text-helper"
        >
          <p>Each quiz adapts to your awareness level · 60 seconds per question</p>
        </motion.div>
      </div>
    </div>
  );
};
