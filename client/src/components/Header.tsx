import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="border-b px-4 py-3 flex items-center justify-between">
      <Link to="/" className="font-bold text-lg tracking-tight">
        Playtaste
      </Link>

      <div className="flex items-center gap-3">
        {user?.avatarUrl && (
          <Link to="/profile">
            <img
              src={user.avatarUrl}
              alt={user.displayName ?? 'User avatar'}
              width={32}
              height={32}
              className="rounded-full"
            />
          </Link>
        )}
        {user?.displayName && <span className="text-sm text-gray-700">{user.displayName}</span>}
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-900">
          Logout
        </button>
      </div>
    </header>
  );
}
