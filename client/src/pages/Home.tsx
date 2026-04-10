import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { games as gamesApi } from '../lib/api';

function coverUrl(url: string): string {
  // IGDB returns protocol-relative URLs at thumbnail size; upgrade to t_cover_big
  return `https:${url.replace('t_thumb', 't_cover_big')}`;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');

  const { data, isFetching, isError } = useQuery({
    queryKey: ['games', 'search', query],
    queryFn: () => gamesApi.search(query),
    enabled: query.length > 0,
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQuery(input.trim());
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search games..."
          className="flex-1 border rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={isFetching}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
        >
          {isFetching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {isError && <p className="text-red-500 mb-4">Search failed. Please try again.</p>}

      <ul className="flex flex-col gap-4">
        {data?.map((game) => (
          <li key={game.id} className="flex gap-4 items-start">
            {game.cover ? (
              <img
                src={coverUrl(game.cover.url)}
                alt={game.name}
                width={90}
                className="rounded shrink-0"
              />
            ) : (
              <div className="w-22.5 h-30 bg-gray-200 rounded shrink-0" />
            )}
            <div>
              <p className="font-semibold">
                {game.name}
                {game.first_release_date && (
                  <span className="ml-2 text-gray-400 font-normal text-sm">
                    ({new Date(game.first_release_date * 1000).getFullYear()})
                  </span>
                )}
                {game.rating != null && (
                  <span className="ml-2 text-sm font-normal">{game.rating.toFixed(0)}/100</span>
                )}
              </p>
              {game.genres && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {game.genres.map((g) => g.name).join(', ')}
                </p>
              )}
              {game.summary && (
                <p className="text-sm text-gray-700 mt-1 line-clamp-3">{game.summary}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
