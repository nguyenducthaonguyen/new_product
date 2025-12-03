'use client';

import { useEffect, useRef } from 'react';
import { useSearchHistory } from '@/hooks/use-search-history';

type SearchPageClientProps = {
  searchQuery: string;
};

export function SearchPageClient({ searchQuery }: SearchPageClientProps) {
  const { addToHistory } = useSearchHistory();
  const hasSavedRef = useRef<string>('');

  // Save search query to history when page loads (only once per query)
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    
    // Only save if query is not empty and hasn't been saved yet
    if (trimmedQuery && trimmedQuery.length > 0 && hasSavedRef.current !== trimmedQuery) {
      hasSavedRef.current = trimmedQuery;
      addToHistory(trimmedQuery);
    }
  }, [searchQuery, addToHistory]);

  return null; // This component only handles side effects
}

