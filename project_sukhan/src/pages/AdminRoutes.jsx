import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';

const AdminRoutes = () => {
  const { user, isAuthenticated } = useSelector(s => s.auth);

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'admin') return <Navigate to="/" />;

  return <Outlet />;
};

export default AdminRoutes;
