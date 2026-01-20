import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { auth } from './api/firebase';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleLogout = async () => {
    handleMenuClose();
    await auth.signOut();
    navigate('/login');
  };

  if (!user) {
    return null; // No mostrar navbar si no está logueado
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Mr Lonche
        </Typography>

        {/* Menú para pantallas grandes */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
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

        {/* Menú de hamburguesa para pantallas pequeñas */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
          >
            <MenuItem component={NavLink} to="/" onClick={handleMenuClose}>Resumen</MenuItem>
            <MenuItem component={NavLink} to="/ventas" onClick={handleMenuClose}>Ventas</MenuItem>
            <MenuItem component={NavLink} to="/compras" onClick={handleMenuClose}>Compras</MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;