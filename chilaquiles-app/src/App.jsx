import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import SalesPage from './pages/SalesPage';
import PurchasesPage from './pages/PurchasesPage';
import SummaryPage from './pages/SummaryPage';
import Navbar from './Navbar';

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
                <main style={{ padding: '1rem' }}>
                  <Routes>
                    <Route path="/" element={<SummaryPage />} />
                    <Route path="/ventas" element={<SalesPage />} />
                    <Route path="/compras" element={<PurchasesPage />} />
                  </Routes>
                </main>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
