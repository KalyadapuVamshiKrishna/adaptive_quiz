// src/pages/TerminatedPage.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertOctagon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TerminatedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-radial p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card p-10 rounded-2xl shadow-2xl text-center border border-destructive/40 max-w-md"
      >
        <AlertOctagon className="w-14 h-14 text-destructive mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-destructive mb-2">
          Quiz Terminated
        </h2>
        <p className="text-muted-foreground mb-6">
          You switched tabs or minimized the window. The quiz has been terminated for fairness.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="w-full h-12 text-lg bg-gradient-blue text-white font-semibold"
        >
          Go Back to Subjects
        </Button>
      </motion.div>
    </div>
  );
};
