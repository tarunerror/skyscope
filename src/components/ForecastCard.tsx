import React from 'react';
import { motion } from 'framer-motion';
import type { ForecastData } from '../types';

interface ForecastCardProps {
  data: ForecastData;
  isDark: boolean;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ data, isDark }) => {
  const dailyForecasts = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`${
        isDark ? 'bg-white/10' : 'bg-white/80'
      } backdrop-blur-md rounded-xl p-6 text-white shadow-lg w-full max-w-xl mt-6`}
    >
      <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
        5-Day Forecast
      </h3>
      <div className="grid grid-cols-5 gap-4">
        {dailyForecasts.map((forecast, index) => (
          <motion.div
            key={index}
            variants={item}
            className={`${
              isDark 
                ? 'bg-white/5 hover:bg-white/10' 
                : 'bg-white/40 hover:bg-white/60'
            } rounded-lg p-3 text-center transition-colors`}
          >
            <p className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
              {new Date(forecast.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
            <motion.img
              src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
              alt={forecast.weather[0].main}
              className="w-12 h-12 mx-auto"
              whileHover={{ scale: 1.1 }}
            />
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {Math.round(forecast.main.temp)}°C
            </p>
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
              {forecast.weather[0].main}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};