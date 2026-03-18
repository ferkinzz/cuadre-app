import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useConfig } from './ConfigContext';
import { auth } from './api/firebase';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar() {
  const { user } = useAuth();
  const { config } = useConfig();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleLogout = async () => {
    handleMenuClose();
    await auth.signOut();
    navigate('/login');
  };

  if (!user) return null;

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {config.appName}
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit" component={NavLink} to="/">Resumen</Button>
          <Button color="inherit" component={NavLink} to="/ventas">Ventas</Button>
          <Button color="inherit" component={NavLink} to="/compras">Compras</Button>
          <Button color="inherit" component={NavLink} to="/datos">Análisis</Button>
          <Button color="inherit" component={NavLink} to="/configuracion">Config</Button>
          <Button color="inherit" onClick={handleLogout}>Cerrar Sesión</Button>
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton size="large" aria-label="menu" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenuOpen} color="inherit">
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
          >
            <MenuItem component={NavLink} to="/" onClick={handleMenuClose}>Resumen</MenuItem>
            <MenuItem component={NavLink} to="/ventas" onClick={handleMenuClose}>Ventas</MenuItem>
            <MenuItem component={NavLink} to="/compras" onClick={handleMenuClose}>Compras</MenuItem>
            <MenuItem component={NavLink} to="/datos" onClick={handleMenuClose}>Análisis</MenuItem>
            <MenuItem component={NavLink} to="/configuracion" onClick={handleMenuClose}>Config</MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
