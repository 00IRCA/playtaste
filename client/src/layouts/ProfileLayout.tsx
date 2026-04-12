import { Outlet } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileLayout() {
  const { user } = useAuth();

  return (
    <div>
      <div>
        {user?.avatarUrl && (
          <img src={user.avatarUrl} alt={user.displayName ?? 'Avatar'} width={80} height={80} />
        )}
        <h1>{user?.displayName ?? 'User'}</h1>
      </div>
      <Outlet />
    </div>
  );
}
