import { Link, useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lists } from '../lib/api';

export default function CollectionDetail() {
  const { id } = useParams<{ id: string }>();
  const listId = Number(id);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['lists', listId],
    queryFn: () => lists.getById(listId),
  });

  const { mutate: removeGame } = useMutation({
    mutationFn: (igdbGameId: number) => lists.removeGame(listId, igdbGameId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists', listId] });
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error || !data) return <p>Collection not found.</p>;

  return (
    <div>
      <div>
        <h2>{data.name}</h2>
        {data.description && <p>{data.description}</p>}
        <span>{data.isPublic ? 'Public' : 'Private'}</span>
      </div>
      <div>
        <Link to="add">Add game</Link>
      </div>
      {data.games.length === 0 && <p>No games yet.</p>}
      <ul>
        {data.games.map((game) => (
          <li key={game.id}>
            {game.cover?.url && <img src={game.cover.url} alt={game.name} />}
            <strong>{game.name}</strong>
            <button type="button" onClick={() => removeGame(game.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
