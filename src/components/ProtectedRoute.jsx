import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, adminOnly = false }) {
  const adminRole = localStorage.getItem('adminRole');
  const isAuthenticated = !!localStorage.getItem('sb-token');

  if (adminOnly && !adminRole) {
    return <Navigate to="/login" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;