import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import AdminShimmer from '@/shimmer/AdminShimmer';

const PoetOwnerRoute = () => {
  const { isAuthenticated, user, loading } = useSelector(
    (state) => state.auth
  );

  if (loading) return <AdminShimmer />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isPoetOwner || !user?.ownedPoet) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default PoetOwnerRoute;
