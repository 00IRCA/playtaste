import { Outlet } from 'react-router';
import Header from '../components/Header';

export default function AuthenticatedLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
