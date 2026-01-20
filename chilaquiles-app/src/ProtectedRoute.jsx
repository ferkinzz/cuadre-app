import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  console.log('[ProtectedRoute.jsx] Verificando usuario.', { user });

  if (user) {
    console.log('[ProtectedRoute.jsx] Usuario autenticado. Renderizando hijos.');
    return children;
  }

  console.log('[ProtectedRoute.jsx] Usuario NO autenticado. Redirigiendo a /login.');
  return <Navigate to="/login" />;
};

export default ProtectedRoute;