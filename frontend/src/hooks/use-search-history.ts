'use client';

import { useState, useEffect, useCallback } from 'react';

const SEARCH_HISTORY_KEY = 'search-history';
const MAX_HISTORY_ITEMS = 5;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  const addToHistory = useCallback((query: string) => {
    if (!query || query.trim().length === 0) return;
    
    const trimmedQuery = query.trim();
    
    setHistory(prev => {
      // Remove duplicate and add to beginning
      const filtered = prev.filter(item => item.toLowerCase() !== trimmedQuery.toLowerCase());
      const newHistory = [trimmedQuery, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      
      // Save to localStorage
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error('Error saving search history:', error);
      }
      
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
  };
}

