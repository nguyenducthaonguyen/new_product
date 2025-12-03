'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Clock, TrendingUp } from 'lucide-react';
import { useSearchHistory } from '@/hooks/use-search-history';

type SearchSuggestionsProps = {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (query: string) => void;
};

// Static popular searches (can be replaced with API call later)
const POPULAR_SEARCHES = [
  'Laptop',
  'Smartphone',
  'Headphones',
  'Camera',
  'Tablet',
];

// Static trending searches (can be replaced with API call later)
const TRENDING_SEARCHES = [
  'Wireless Earbuds',
  'Gaming Mouse',
  'Smart Watch',
];

export function SearchSuggestions({
  query,
  isOpen,
  onClose,
  onSelect,
}: SearchSuggestionsProps) {
  const router = useRouter();
  const { history, addToHistory } = useSearchHistory();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSuggestionClick = (suggestion: string) => {
    addToHistory(suggestion);
    onSelect(suggestion);
    onClose();
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  if (!isOpen) return null;

  const hasQuery = query.trim().length >= 2;
  const hasNoQuery = query.trim().length === 0;
  
  // When no query, show all history, popular, and trending
  // When has query, filter them
  const filteredHistory = hasNoQuery
    ? history
    : history.filter(item => item.toLowerCase().includes(query.toLowerCase()));
  
  const filteredPopular = hasNoQuery
    ? POPULAR_SEARCHES
    : POPULAR_SEARCHES.filter(item => item.toLowerCase().includes(query.toLowerCase()));
  
  const filteredTrending = hasNoQuery
    ? TRENDING_SEARCHES
    : TRENDING_SEARCHES.filter(item => item.toLowerCase().includes(query.toLowerCase()));

  const hasContent =
    filteredHistory.length > 0 ||
    filteredPopular.length > 0 ||
    filteredTrending.length > 0;

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
    >
      {hasContent ? (
        <div className="p-2">
          {/* Recent Searches */}
          {filteredHistory.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                <Clock className="h-3 w-3" />
                Recent Searches
              </div>
              {filteredHistory.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  <span className="flex-1 text-left">{item}</span>
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {filteredPopular.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                <Search className="h-3 w-3" />
                Popular Searches
              </div>
              {filteredPopular.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  <span className="flex-1 text-left">{item}</span>
                </button>
              ))}
            </div>
          )}

          {/* Trending Searches */}
          {filteredTrending.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                <TrendingUp className="h-3 w-3" />
                Trending
              </div>
              {filteredTrending.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className="flex-1 text-left">{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500 text-sm">
          {query.trim().length > 0 && query.trim().length < 2
            ? 'Type at least 2 characters to see filtered suggestions'
            : 'No suggestions available'}
        </div>
      )}
    </div>
  );
}

