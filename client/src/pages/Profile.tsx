import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { lists } from '../lib/api';

export default function Profile() {
  const { data: collections = [], isLoading } = useQuery({
    queryKey: ['lists'],
    queryFn: () => lists.getAll(),
  });

  return (
    <div>
      <div>
        <h2>Collections</h2>
        <Link to="new">New collection</Link>
      </div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && collections.length === 0 && <p>No collections yet.</p>}
      <ul>
        {collections.map((collection) => (
          <li key={collection.id}>
            <Link to={`collections/${collection.id}`}>
              <strong>{collection.name}</strong>
            </Link>
            {collection.description && <p>{collection.description}</p>}
            <span>{collection.isPublic ? 'Public' : 'Private'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
