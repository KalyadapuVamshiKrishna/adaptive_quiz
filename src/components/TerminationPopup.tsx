// src/components/TerminationPopup.tsx
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TerminationPopup = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-card rounded-2xl p-10 shadow-2xl text-center max-w-md mx-auto border border-destructive/40"
      >
        <XCircle className="w-14 h-14 text-destructive mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-destructive mb-2">
          Quiz Terminated
        </h2>
        <p className="text-muted-foreground mb-6">
          Your quiz has been terminated due to window switching or tab change.
        </p>

        <Button
          onClick={() => navigate("/terminated")}
          className="w-full h-12 bg-destructive hover:bg-destructive/80 text-white text-lg font-semibold"
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};
