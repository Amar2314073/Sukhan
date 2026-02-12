import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';
import ProfileShimmer from '@/shimmer/ProfileShimmer';

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);

  if (isLoading) return <ProfileShimmer/>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
