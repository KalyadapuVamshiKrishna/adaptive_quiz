import { motion } from 'framer-motion';
import { Subject } from '@/types/quiz';

interface SubjectCardProps {
  subject: Subject;
  onClick: () => void;
  index: number;
}

export const SubjectCard = ({ subject, onClick, index }: SubjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ y: -8, boxShadow: '0 12px 24px rgba(34, 211, 238, 0.2)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative bg-card rounded-[20px] p-8 cursor-pointer overflow-hidden transition-all"
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
      }}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {subject.iconUrl}
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-display font-semibold text-foreground mb-3">
          {subject.name}
        </h3>
        
        {/* Description */}
        <p className="text-muted-foreground text-base leading-relaxed">
          {subject.description}
        </p>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-blue group-hover:w-full transition-all duration-500" />
      </div>
    </motion.div>
  );
};
