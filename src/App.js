import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './services/authService';
import { FilterProvider, DashboardProvider, ResultsProvider } from './context';
import { theme } from './theme/antd-theme';

function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (authService.isAuthenticated() && user) {
      const roleMapping = {
        'superadmin': '/superadmin',
        'instituteadmin': '/institute',
        'branchadmin': '/branch',
        'teacher': '/institute',
        'student': '/branch'
      };
      const route = roleMapping[user.role?.toLowerCase()] || '/login';
      navigate(route, { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return null;
}

function App() {
  return (
    <ConfigProvider theme={theme}>
      <FilterProvider>
        <DashboardProvider>
          <ResultsProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/superadmin/*" element={<ProtectedRoute role="superadmin"><Dashboard /></ProtectedRoute>} />
                <Route path="/institute/*" element={<ProtectedRoute role="institute"><Dashboard /></ProtectedRoute>} />
                <Route path="/branch/*" element={<ProtectedRoute role="branch"><Dashboard /></ProtectedRoute>} />
                <Route path="/" element={<RootRedirect />} />
              </Routes>
            </Router>
          </ResultsProvider>
        </DashboardProvider>
      </FilterProvider>
    </ConfigProvider>
  );
}

export default App;
