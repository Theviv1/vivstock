import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Market from "./pages/Market";
import StockList from "./components/ForeignStockList";
import Wallet from "./pages/Wallet";
import TraderProfile from "./pages/TraderProfile";
import History from "./pages/History";
import Trade from "./pages/Trade";
import Fixed from "./pages/Fixed";
import StockDetail from "./components/StockDetail";
import Refer from "./pages/Refer";
import LocalStockList from "./components/LocalStockList";
import ForeignStockList from "./components/ForeignStockList";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";

function AppRoutes() {
  const location = useLocation();
  const hideNavbar =
    location.pathname.includes("/trade/") ||
    location.pathname.includes("/trader/") ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password";

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      {!hideNavbar && <Sidebar hideOnMobile={hideNavbar} />}
      <div className={!hideNavbar ? "lg:pl-64" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
          <Route path="/trade/:symbol" element={<ProtectedRoute><StockDetail /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="/trader/:traderId" element={<ProtectedRoute><TraderProfile /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/trade" element={<ProtectedRoute><Trade /></ProtectedRoute>} />
          <Route path="/market/local-stocks" element={<ProtectedRoute><LocalStockList /></ProtectedRoute>} />
          <Route path="/market/foreign-stocks" element={<ProtectedRoute><ForeignStockList /></ProtectedRoute>} />
          <Route path="/fixed" element={<ProtectedRoute><Fixed /></ProtectedRoute>} />
          <Route path="/refer" element={<ProtectedRoute><Refer /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster position="top-center" />
    </AuthProvider>
  );
}

export default App;
