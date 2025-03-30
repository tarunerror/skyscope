import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, AlertCircle, Cloud, Sun, Moon, CloudRain } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { RecentSearches } from './components/RecentSearches';
import { ThemeToggle } from './components/ThemeToggle';
import type { WeatherData, ForecastData } from './types';

function App() {
  const [city, setCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isDark, setIsDark] = useState(true);

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError('');
    try {
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
      
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`)
      ]);

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('City not found');
      }

      const [weather, forecast] = await Promise.all([
        weatherResponse.json(),
        forecastResponse.json()
      ]);

      setWeatherData(weather);
      setForecastData(forecast);
      setCity(cityName);
      
      setRecentSearches(prev => {
        const newSearches = [cityName, ...prev.filter(s => s !== cityName)].slice(0, 5);
        return newSearches;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (city) {
      fetchWeather(city);
    }
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 20) return 'evening';
    return 'night';
  };

  useEffect(() => {
    const handleResize = () => {
      document.documentElement.style.setProperty(
        '--vh', 
        `${window.innerHeight * 0.01}px`
      );
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      className={`min-h-[100vh] min-h-[calc(var(--vh,1vh)*100)] transition-all duration-700 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
          : 'bg-gradient-to-br from-blue-100 via-blue-300 to-purple-200'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0"
        >
          {isDark ? (
            <>
              <Cloud className="absolute text-white/5 w-64 h-64 -top-20 left-1/4 transform -rotate-12 md:w-96 md:h-96" />
              <Moon className="absolute text-white/5 w-96 h-96 top-1/3 -right-20 transform rotate-45 hidden md:block" />
              <CloudRain className="absolute text-white/5 w-72 h-72 bottom-1/4 -left-20 md:w-80 md:h-80" />
            </>
          ) : (
            <>
              <Sun className="absolute text-yellow-500/20 w-96 h-96 -top-20 left-1/3 md:w-[32rem] md:h-[32rem]" />
              <Cloud className="absolute text-blue-600/20 w-64 h-64 top-1/3 -right-20 transform rotate-12 hidden md:block" />
              <Cloud className="absolute text-blue-600/20 w-72 h-72 bottom-1/4 -left-20 transform -rotate-12" />
            </>
          )}
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.h1 
            className={`text-4xl md:text-5xl font-bold mb-2 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            SkyScope
          </motion.h1>
          <motion.p 
            className={`text-lg md:text-xl mb-8 text-center ${
              isDark ? 'text-white/70' : 'text-gray-900 font-medium'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Good {getTimeOfDay()}! Check the weather anywhere.
          </motion.p>
          
          <SearchBar onSearch={fetchWeather} isLoading={loading} isDark={isDark} />
          
          <RecentSearches searches={recentSearches} onSelect={fetchWeather} isDark={isDark} />

          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                <Loader2 className="animate-spin" />
                <span>Loading weather data...</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`flex items-center gap-2 ${
                  isDark ? 'bg-red-500/10 text-red-300' : 'bg-red-100 text-red-600'
                } px-4 py-2 rounded-lg`}
              >
                <AlertCircle size={20} />
                <span>{error}</span>
              </motion.div>
            )}

            {weatherData && !loading && !error && (
              <>
                <div className="relative w-full max-w-xl">
                  <WeatherCard data={weatherData} isDark={isDark} />
                  <motion.button
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleRefresh}
                    className={`absolute top-4 right-4 p-2 rounded-full ${
                      isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <RefreshCw className={isDark ? 'text-white' : 'text-gray-700'} size={20} />
                  </motion.button>
                </div>
                {forecastData && <ForecastCard data={forecastData} isDark={isDark} />}
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default App;