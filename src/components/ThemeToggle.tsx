import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      className={`fixed top-4 right-4 p-3 rounded-full ${
        isDark 
          ? 'bg-white/10 hover:bg-white/20' 
          : 'bg-white/60 hover:bg-white/80'
      } transition-colors backdrop-blur-sm`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.5 }}
      >
        {isDark ? (
          <Sun className="text-white" size={24} />
        ) : (
          <Moon className="text-gray-800" size={24} />
        )}
      </motion.div>
    </motion.button>
  );
};