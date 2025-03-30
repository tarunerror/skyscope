import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecentSearchesProps {
  searches: string[];
  onSelect: (city: string) => void;
  isDark: boolean;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({ searches, onSelect, isDark }) => {
  if (searches.length === 0) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-xl"
    >
      <div className={`flex items-center gap-2 ${isDark ? 'text-white/70' : 'text-gray-600'} mb-2`}>
        <Clock size={16} />
        <span>Recent Searches</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((city, index) => (
          <motion.button
            key={index}
            variants={item}
            whileHover={{ scale: 1.05 }}
            onClick={() => onSelect(city)}
            className={`flex items-center gap-1 px-3 py-1.5 ${
              isDark 
                ? 'bg-white/10 hover:bg-white/20' 
                : 'bg-white/60 hover:bg-white/80'
            } rounded-full ${
              isDark ? 'text-white' : 'text-gray-700'
            } text-sm transition-colors`}
          >
            <MapPin size={14} />
            {city}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};