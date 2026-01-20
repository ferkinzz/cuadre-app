import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import SalesPage from './pages/SalesPage';
import PurchasesPage from './pages/PurchasesPage';
import SummaryPage from './pages/SummaryPage';
import HistoricalDataPage from './pages/HistoricalDataPage';
import Navbar from './Navbar';
import { Container } from '@mui/material';

function App() {
  console.log('[App.jsx] Renderizando componente App y su enrutador.');

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Ruta pública para el login */}
          <Route path="/login" element={<Login />} />

          {/* Rutas privadas que requieren autenticación */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Navbar />
                <Container component="main" sx={{ mt: 4, mb: 4 }}>
                  <Routes>
                    <Route path="/" element={<SummaryPage />} />
                    <Route path="/ventas" element={<SalesPage />} />
                    <Route path="/compras" element={<PurchasesPage />} />
                    <Route path="/datos" element={<HistoricalDataPage />} />
                  </Routes>
                </Container>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
