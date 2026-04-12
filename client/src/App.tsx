import { Routes, Route, Navigate, Outlet } from 'react-router';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CollectionForm from './pages/CollectionForm';
import CollectionDetail from './pages/CollectionDetail';
import AddGame from './pages/AddGame';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import ProfileLayout from './layouts/ProfileLayout';

function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfileLayout />}>
            <Route index element={<Profile />} />
            <Route path="new" element={<CollectionForm />} />
            <Route path="collections/:id" element={<CollectionDetail />} />
            <Route path="collections/:id/add" element={<AddGame />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
