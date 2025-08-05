import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, createContext, useContext } from "react";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminRegister from "./pages/admin/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import StoresManagement from "./pages/admin/Stores";
import CatalogManagement from "./pages/admin/CatalogManagement";
import ReviewManagement from "./pages/admin/ReviewManagement";
import Analytics from "./pages/admin/Analytics";

// Create Auth Context
const AuthContext = createContext();

function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    admin: null,
    token: null,
  });

  const login = (adminData, token) => {
    setAuthState({
      isAuthenticated: true,
      admin: adminData,
      token: token,
    });
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setAuthState({
      isAuthenticated: false,
      admin: null,
      token: null,
    });
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!authState.isAuthenticated) {
      return <Navigate to="/admin/login" replace />;
    }
    return children;
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/stores"
            element={
              <ProtectedRoute>
                <StoresManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/catalog/:store_id"
            element={
              <ProtectedRoute>
                <CatalogManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reviews/:store_id"
            element={
              <ProtectedRoute>
                <ReviewManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/analytics/:store_id"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

// Export the auth context for use in other components
export const useAuth = () => useContext(AuthContext);

export default App;
