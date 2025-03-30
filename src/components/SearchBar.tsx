import React, { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import type { Citysuggestion } from '../types';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Citysuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        const selected = suggestions[selectedIndex];
        handleSelectCity(selected);
      } else if (query.trim()) {
        handleSearch(query.trim());
      }
    }
  };

  const handleSelectCity = (suggestion: Citysuggestion) => {
    const cityName = suggestion.state 
      ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
      : `${suggestion.name}, ${suggestion.country}`;
    setQuery(cityName);
    setShowSuggestions(false);
    handleSearch(cityName);
  };

  const handleSearch = (searchQuery: string) => {
    onSearch(searchQuery);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative w-full max-w-xl" ref={suggestionsRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
          setSelectedIndex(-1);
        }}
        onKeyDown={handleKeyPress}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Enter city name..."
        className="w-full px-4 py-3 pl-12 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute w-full mt-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden z-10">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.name}-${suggestion.lat}-${suggestion.lon}`}
              onClick={() => handleSelectCity(suggestion)}
              className={`w-full px-4 py-2 text-left text-white hover:bg-white/20 transition-colors ${
                index === selectedIndex ? 'bg-white/20' : ''
              }`}
            >
              {suggestion.state 
                ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
                : `${suggestion.name}, ${suggestion.country}`}
            </button>
          ))}
        </div>
      )}
      
      <button
        onClick={() => query.trim() && handleSearch(query.trim())}
        disabled={isLoading || !query.trim()}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
};