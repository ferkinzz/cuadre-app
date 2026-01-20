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
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main style={{ padding: '1rem' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><SummaryPage /></ProtectedRoute>} />
            <Route path="/ventas" element={<ProtectedRoute><SalesPage /></ProtectedRoute>} />
            <Route path="/compras" element={<ProtectedRoute><PurchasesPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
