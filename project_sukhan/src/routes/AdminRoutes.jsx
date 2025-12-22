import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';
import AdminShimmer from '../shimmer/AdminShimmer';

const AdminRoutes = () => {
  const { isLoading, isAuthenticated, user } = useSelector(s => s.auth);

  if (isLoading) return <AdminShimmer />;
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
};

export default AdminRoutes;
