import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { StoreProvider } from "./contexts/StoreContext"
import LandingPage from "./components/customer/LandingPage"
import CatalogBrowsing from "./components/customer/CatalogBrowsing"
import ReviewSystem from "./components/customer/ReviewSystem"
import UserAuth from "./components/customer/UserAuth"
import AdminPanel from "./components/admin/AdminPanel"
import CatalogManagement from "./components/admin/CatalogManagement"
import CustomerTracking from "./components/admin/CustomerTracking"
import ReviewManagement from "./components/admin/ReviewManagement"
import StoreManagement from "./components/admin/StoreManagement"

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/store/:storeId" element={<LandingPage />} />
              <Route path="/catalog/:storeId" element={<CatalogBrowsing />} />
              <Route path="/review/:storeId" element={<ReviewSystem />} />
              <Route path="/auth/:storeId" element={<UserAuth />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/catalog" element={<CatalogManagement />} />
              <Route path="/admin/customers" element={<CustomerTracking />} />
              <Route path="/admin/reviews" element={<ReviewManagement />} />
              <Route path="/admin/stores" element={<StoreManagement />} />
            </Routes>
          </div>
        </Router>
      </StoreProvider>
    </AuthProvider>
  )
}

export default App
