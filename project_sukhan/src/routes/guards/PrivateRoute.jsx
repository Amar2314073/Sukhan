import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import ProfileShimmer from '../../shimmer/ProfileShimmer';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);

  if (isLoading) return <ProfileShimmer/>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
