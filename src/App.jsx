import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Market from './pages/Market';
import StockList from './components/StockList';
import StockDetail from './components/StockDetail';
import Wallet from './pages/Wallet';
import TraderProfile from './pages/TraderProfile';
import History from './pages/History';
import Trade from './pages/Trade';
import Fixed from './pages/Fixed';
import Refer from './pages/Refer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Verify from './pages/Verify';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Transactions from './pages/admin/Transactions';

function AppRoutes() {
  const location = useLocation();
  const { user, loading } = useAuth();
  const isAdmin = localStorage.getItem('adminRole');
  const hideNavbar = location.pathname === '/login' || 
                    location.pathname === '/signup' ||
                    location.pathname === '/verify' ||
                    location.pathname === '/forgot-password' ||
                    location.pathname.includes('/trade/') || 
                    location.pathname.includes('/trader/') ||
                    location.pathname.includes('/admin/');

  if (loading) {
    return <div>Loading...</div>;
  }

  // Always redirect to login if not authenticated, except for signup and verify pages
  if (!user && !isAdmin && !['/login', '/signup', '/verify', '/forgot-password'].includes(location.pathname)) {
    return <Navigate to="/login" />;
  }

  // Redirect authenticated users trying to access auth pages to appropriate dashboard
  if ((user || isAdmin) && ['/login', '/signup', '/verify', '/forgot-password'].includes(location.pathname)) {
    return isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      {!hideNavbar && <Sidebar hideOnMobile={hideNavbar} />}
      <div className={!hideNavbar ? "lg:pl-64" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            isAdmin ? <Dashboard /> : <Navigate to="/login" />
          } />
          <Route path="/admin/users" element={
            isAdmin ? <Users /> : <Navigate to="/login" />
          } />
          <Route path="/admin/transactions" element={
            isAdmin ? <Transactions /> : <Navigate to="/login" />
          } />
          
          {/* Protected User Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/market" element={
            <ProtectedRoute>
              <Market />
            </ProtectedRoute>
          } />
          <Route path="/market/stocks" element={
            <ProtectedRoute>
              <StockList />
            </ProtectedRoute>
          } />
          <Route path="/trade/:symbol" element={
            <ProtectedRoute>
              <StockDetail />
            </ProtectedRoute>
          } />
          <Route path="/wallet" element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          } />
          <Route path="/trader/:traderId" element={
            <ProtectedRoute>
              <TraderProfile />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />
          <Route path="/trade" element={
            <ProtectedRoute>
              <Trade />
            </ProtectedRoute>
          } />
          <Route path="/fixed" element={
            <ProtectedRoute>
              <Fixed />
            </ProtectedRoute>
          } />
          <Route path="/refer" element={
            <ProtectedRoute>
              <Refer />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;