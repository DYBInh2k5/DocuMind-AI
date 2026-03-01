'use client';

import { useState } from 'react';

type SearchResponse = {
  answer?: string;
  sources?: Array<{ id: string; title: string; file_name: string }>;
  matches?: number;
  error?: string;
};

export function AskAssistant() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<Array<{ id: string; title: string; file_name: string }>>([]);
  const [matches, setMatches] = useState<number | null>(null);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: trimmed }),
      });

      const data = (await response.json()) as SearchResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setAnswer(data.answer || 'No answer generated.');
      setSources(data.sources || []);
      setMatches(typeof data.matches === 'number' ? data.matches : null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setAnswer(null);
      setSources([]);
      setMatches(null);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Ask AI Assistant</h2>
      <div className="flex gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          placeholder="Ask a question about your documents..."
          className="flex-1 rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      {answer && (
        <div className="mt-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          {matches !== null && (
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">{matches} semantic matches found</p>
          )}
          <p className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{answer}</p>
          {sources.length > 0 && (
            <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Sources
              </p>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {sources.map((source) => (
                  <li key={source.id}>• {source.title} ({source.file_name})</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
