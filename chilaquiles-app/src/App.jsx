import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import { ConfigProvider, useConfig } from './ConfigContext';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import SalesPage from './pages/SalesPage';
import PurchasesPage from './pages/PurchasesPage';
import SummaryPage from './pages/SummaryPage';
import HistoricalDataPage from './pages/HistoricalDataPage';
import SettingsPage from './pages/SettingsPage';
import Navbar from './Navbar';
import { Container } from '@mui/material';

function AppWithBackground({ children }) {
  const { config } = useConfig();
  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: config.backgroundImage ? `url(${config.backgroundImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
    }}>
      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ConfigProvider>
          <AppWithBackground>
            <Routes>
              <Route path="/login" element={<Login />} />
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
                        <Route path="/configuracion" element={<SettingsPage />} />
                      </Routes>
                    </Container>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AppWithBackground>
        </ConfigProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
