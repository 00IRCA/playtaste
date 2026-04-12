import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { lists } from '../lib/api';

export default function Profile() {
  const { user } = useAuth();

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ['lists'],
    queryFn: () => lists.getAll(),
  });

  return (
    <div>
      <div>
        {user?.avatarUrl && (
          <img src={user.avatarUrl} alt={user.displayName ?? 'Avatar'} width={80} height={80} />
        )}
        <h1>{user?.displayName ?? 'User'}</h1>
      </div>

      <div>
        <h2>Collections</h2>

        {isLoading && <p>Loading...</p>}

        {!isLoading && collections.length === 0 && <p>No collections yet.</p>}

        <ul>
          {collections.map((collection) => (
            <li key={collection.id}>
              <strong>{collection.name}</strong>
              {collection.description && <p>{collection.description}</p>}
              <span>{collection.isPublic ? 'Public' : 'Private'}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
