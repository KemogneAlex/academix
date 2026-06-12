import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth';

export const RequireAuth = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to='/account/login' />;
  return children;
};

// Réservé aux instructeurs uniquement
export const RequireInstructor = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to='/account/login' />;
  if (user.role !== 'instructor') return <Navigate to='/account/dashboard' />;
  return children;
};

// Réservé aux admins uniquement
export const RequireAdmin = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to='/account/login' />;
  if (user.role !== 'admin') return <Navigate to='/account/dashboard' />;
  return children;
};
