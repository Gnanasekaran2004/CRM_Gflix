import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useCustomerAuthStore from './store/customerAuthStore';
import Login from './pages/Login';
import RequestAccess from './pages/RequestAccess';
import Browse from './pages/Browse';
import MyAccount from './pages/MyAccount';
import Support from './pages/Support';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useCustomerAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useCustomerAuthStore();
  return !isAuthenticated ? children : <Navigate to="/browse" replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/request-access" element={<PublicRoute><RequestAccess /></PublicRoute>} />
        <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/browse" replace />} />
        <Route path="*" element={<Navigate to="/browse" replace />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
