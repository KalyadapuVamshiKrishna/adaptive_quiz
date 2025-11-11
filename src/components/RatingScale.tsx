import { motion } from 'framer-motion';

interface RatingScaleProps {
  onSelect: (rating: number) => void;
  selectedRating: number | null;
}

export const RatingScale = ({ onSelect, selectedRating }: RatingScaleProps) => {
  const ratings = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center justify-center gap-4" role="radiogroup" aria-label="Familiarity rating">
      {ratings.map((rating) => {
        const isSelected = selectedRating === rating;
        
        return (
          <motion.button
            key={rating}
            onClick={() => onSelect(rating)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 1.2 }}
            animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`
              relative w-14 h-14 rounded-full font-semibold text-lg
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-offset-2 focus:ring-offset-background
              ${isSelected 
                ? 'bg-gradient-blue text-white shadow-[0_0_30px_rgba(34,211,238,0.6)]' 
                : 'bg-primary-blue/80 text-white hover:bg-primary-blue shadow-[0_0_15px_rgba(37,99,235,0.3)]'
              }
            `}
            aria-label={`Rate familiarity ${rating} out of 5`}
            aria-checked={isSelected}
            role="radio"
          >
            {rating}
            
            {/* Outer glow on hover */}
            {!isSelected && (
              <motion.div 
                className="absolute inset-0 rounded-full bg-accent-cyan/20 -z-10"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.3, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
