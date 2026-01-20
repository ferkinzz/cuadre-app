import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

console.log('[main.jsx] App está a punto de renderizarse.');

// Un tema oscuro básico de Material Design
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    // Hacemos el AppBar ligeramente transparente
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(18, 18, 18, 0.8)', // Fondo oscuro con 80% de opacidad
          backdropFilter: 'blur(4px)', // Efecto de desenfoque para el contenido detrás
        },
      },
    },
    // Hacemos las tarjetas ligeramente transparentes
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(35, 35, 35, 0.8)',
          backdropFilter: 'blur(4px)',
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
