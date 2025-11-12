// src/components/WarningScreen.tsx
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";

interface WarningScreenProps {
  onStart: () => void;
}

export const WarningScreen = ({ onStart }: WarningScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-radial p-8"
    >
      <div className="max-w-2xl bg-card rounded-2xl shadow-2xl border border-border/40 p-10">
        <div className="flex flex-col items-center mb-6">
          <AlertTriangle className="w-14 h-14 text-yellow-500 mb-4" />
          <h2 className="text-3xl font-bold text-foreground mb-2">Before You Begin</h2>
          <p className="text-muted-foreground text-lg">
            Please read these instructions carefully before starting your quiz.
          </p>
        </div>

        <ul className="text-left text-foreground/90 space-y-3 mb-8">
          <li>• Do not switch tabs, minimize the window, or leave this page.</li>
          <li>• If you do, the quiz will terminate automatically.</li>
          <li>• The timer will continue even if you lose focus.</li>
          <li>• Once you start, the quiz cannot be paused or restarted.</li>
        </ul>

        <Button
          onClick={onStart}
          className="w-full h-12 text-lg font-semibold bg-gradient-blue hover:opacity-90"
        >
          I Understand, Start Quiz
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mt-6">
        This session is monitored. Stay focused and good luck!
      </p>
    </motion.div>
  );
};
