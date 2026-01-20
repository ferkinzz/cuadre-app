import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { auth } from './api/firebase';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

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
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Chilaquiles App
        </Typography>
        <Box>
          <Button color="inherit" component={NavLink} to="/">
            Resumen
          </Button>
          <Button color="inherit" component={NavLink} to="/ventas">
            Ventas
          </Button>
          <Button color="inherit" component={NavLink} to="/compras">
            Compras
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;