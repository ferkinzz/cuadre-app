import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../api/firebase';

const styles = {
  nav: { display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' },
  link: { textDecoration: 'none', color: '#007bff', fontSize: '1.2rem' },
  button: { cursor: 'pointer', padding: '8px 12px', border: 'none', borderRadius: '4px', backgroundColor: '#dc3545', color: 'white' },
};

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  if (!user) {
    return null; // No mostrar navbar si no está logueado
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.link}>Resumen</Link>
      <Link to="/ventas" style={styles.link}>Ventas</Link>
      <Link to="/compras" style={styles.link}>Compras</Link>
      <button onClick={handleLogout} style={styles.button}>Cerrar Sesión</button>
    </nav>
  );
}

export default Navbar;