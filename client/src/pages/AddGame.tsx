import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { games, lists } from '../lib/api';

export default function AddGame() {
  const { id } = useParams<{ id: string }>();
  const listId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');

  const { data: results = [], isFetching } = useQuery({
    queryKey: ['games', 'search', submitted],
    queryFn: () => games.search(submitted),
    enabled: submitted.length > 0,
  });

  const { mutate: addGame, isPending } = useMutation({
    mutationFn: (igdbGameId: number) => lists.addGame(listId, igdbGameId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists', listId] });
      navigate(`/profile/collections/${listId}`);
    },
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(query.trim());
  }

  return (
    <div>
      <h2>Add game</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search games..."
        />
        <button type="submit">Search</button>
      </form>
      {isFetching && <p>Searching...</p>}
      {!isFetching && submitted && results.length === 0 && <p>No results.</p>}
      <ul>
        {results.map((game) => (
          <li key={game.id}>
            {game.cover?.url && <img src={game.cover.url} alt={game.name} />}
            <strong>{game.name}</strong>
            <button type="button" disabled={isPending} onClick={() => addGame(game.id)}>
              Add
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => navigate(`/profile/collections/${listId}`)}>
        Cancel
      </button>
    </div>
  );
}
