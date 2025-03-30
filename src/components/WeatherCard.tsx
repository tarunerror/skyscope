import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Wind, Thermometer, Compass } from 'lucide-react';
import type { WeatherData } from '../types';

interface WeatherCardProps {
  data: WeatherData;
  isDark: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ data, isDark }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const getWeatherColor = (condition: string) => {
    const colors: Record<string, string> = {
      Clear: 'from-yellow-400 to-orange-400',
      Clouds: 'from-blue-400 to-gray-400',
      Rain: 'from-blue-600 to-blue-400',
      Snow: 'from-blue-100 to-gray-200',
      Thunderstorm: 'from-purple-600 to-blue-600',
      Drizzle: 'from-blue-300 to-gray-400',
      default: 'from-blue-500 to-blue-300'
    };
    return colors[condition] || colors.default;
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`${
        isDark ? 'bg-white/10' : 'bg-white/80'
      } backdrop-blur-md rounded-xl p-6 shadow-lg w-full max-w-xl overflow-hidden relative`}
    >
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-br ${getWeatherColor(data.weather[0].main)} opacity-10`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h2 
              className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              {data.name}
            </motion.h2>
            <motion.p 
              className={`text-xl mt-1 capitalize ${isDark ? 'text-white/70' : 'text-gray-600'}`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {data.weather[0].description}
            </motion.p>
          </div>
          <motion.img
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
            alt={data.weather[0].description}
            className="w-24 h-24"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          />
        </div>
        
        <motion.div 
          className="text-7xl font-bold mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className={isDark ? 'text-white' : 'text-gray-800'}>
            {Math.round(data.main.temp)}°C
          </span>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Thermometer, label: 'Feels like', value: `${Math.round(data.main.feels_like)}°C` },
            { icon: Droplets, label: 'Humidity', value: `${data.main.humidity}%` },
            { icon: Wind, label: 'Wind Speed', value: `${Math.round(data.wind.speed)} km/h` },
            { icon: Compass, label: 'Pressure', value: `${data.main.pressure} hPa` }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`flex items-center gap-2 ${isDark ? 'text-white/80' : 'text-gray-700'}`}
            >
              <item.icon className={isDark ? 'text-blue-400' : 'text-blue-500'} size={20} />
              <div>
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>{item.label}</p>
                <p className="font-semibold">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};