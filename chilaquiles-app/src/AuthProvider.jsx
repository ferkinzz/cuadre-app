import React, { createContext, useState, useEffect } from 'react';
import { onAuthChange } from './api/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[AuthProvider.jsx] useEffect: Configurando listener de autenticación.');
    const unsubscribe = onAuthChange((user) => {
      console.log('[AuthProvider.jsx] onAuthChange: Estado de autenticación recibido.', { user });
      setUser(user);
      setLoading(false);
    });

    // Limpiar la suscripción al desmontar el componente
    return () => {
      console.log('[AuthProvider.jsx] useEffect cleanup: Desuscribiendo listener.');
      unsubscribe();
    };
  }, []);

  // No renderizar los componentes hijos hasta que se sepa el estado de auth
  if (loading) {
    console.log('[AuthProvider.jsx] Render: Mostrando estado de "Cargando...".');
    return <div style={{ color: 'white' }}>Cargando aplicación...</div>;
  }

  console.log('[AuthProvider.jsx] Render: Proveyendo contexto con usuario.', { user });
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};