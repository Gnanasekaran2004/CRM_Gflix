import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import RequestAccess from './pages/RequestAccess';
import Browse from './pages/Browse';
import NotificationToast from './components/NotificationToast';

const ProtectedRoute = ({ children }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <NotificationToast />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/request" element={<RequestAccess />} />
          <Route path="/browse" element={
            <ProtectedRoute>
              <Browse />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/browse" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
