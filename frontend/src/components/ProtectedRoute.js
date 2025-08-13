import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { token, user } = useContext(AuthContext);

  if (!token || !user) return <Navigate to="/login" replace />;
  return children;
}