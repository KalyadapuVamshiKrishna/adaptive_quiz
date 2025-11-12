import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "@/store/quizStore";
import { useQuizFlow } from "@/hooks/useQuizFlow";
import { AwarenessWindow } from "@/components/AwarenessWindow";
import { QuestionCard } from "@/components/QuestionCard";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { WarningScreen } from "@/components/WarningScreen";
import { TerminationPopup } from "@/components/TerminationPopup";

export const QuizPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(true);
  const [terminated, setTerminated] = useState(false);

  const {
    flowStatus,
    currentConcept,
    currentQuestion,
    currentFeedback,
    timeStartedUTC,
    resetQuiz,
  } = useQuizStore();

  const {
    startQuiz,
    submitAwarenessRating,
    submitQuestionAnswer,
    handleTimeout,
  } = useQuizFlow();

  /** 🟢 Start quiz after user accepts warning */
  const handleStartQuiz = () => {
    setShowWarning(false);
    if (subjectId) startQuiz(subjectId);
  };

  /** 🔵 Navigate to results after quiz completion */
  useEffect(() => {
    if (flowStatus === "reviewing") {
      navigate("/results");
    }
  }, [flowStatus, navigate]);

  /** 🔴 Detect Tab Switch — Show Termination Popup */
  useEffect(() => {
    const handleTabSwitch = () => {
      if (document.hidden && flowStatus !== "idle" && flowStatus !== "reviewing") {
        setTerminated(true);
        resetQuiz();
        toast({
          title: "Quiz Terminated",
          description: "You switched tabs or minimized the window during the quiz.",
          variant: "destructive",
        });
      }
    };

    document.addEventListener("visibilitychange", handleTabSwitch);
    return () => document.removeEventListener("visibilitychange", handleTabSwitch);
  }, [flowStatus, resetQuiz]);

  /** 🟡 Prevent accidental reload/close */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (flowStatus === "awareness" || flowStatus === "questioning") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [flowStatus]);

  /** ⏳ Loading State */
  if (flowStatus === "loading") {
    return (
      <div className="min-h-screen bg-gradient-radial flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-primary-blue animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Loading next concept...</p>
        </motion.div>
      </div>
    );
  }

  /** ⚠️ Warning Screen before quiz starts */
  if (showWarning) {
    return <WarningScreen onStart={handleStartQuiz} />;
  }

  /** 🚫 Termination Popup */
  if (terminated) {
    return <TerminationPopup />;
  }

  /** 🧠 Actual Quiz Flow */
  return (
    <div className="min-h-screen bg-gradient-radial">
      <div className="container mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          {flowStatus === "awareness" && currentConcept && (
            <AwarenessWindow
              key={currentConcept.id}
              flashcard={{
                id: currentConcept.id,
                subtopicName: currentConcept.name,
                question: currentConcept.formulaLatex || "",
                answer: currentConcept.explanation || "",
              }}
              onSubmit={submitAwarenessRating}
            />
          )}

          {flowStatus === "questioning" && currentQuestion && (
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
