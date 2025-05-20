import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SalesPage from './pages/SalesPage';
import ManagementPage from './pages/ManagementPage';
import BaristaTableManagementPage from './components/Management/TableManagementPage'; // Thay thế BaristaPage
import InventoryManagerPage from './pages/InventoryManagerPage';
import PaymentSuccess from './components/Management/PaymentSuccess';
import PaymentFailed from './components/Management/PaymentFailed';
import { isAuthenticated } from './api/auth';
import './styles/Header.css';
import './styles/styles.css';
import './styles/OrderHistory.css';
import './styles/Statistics.css';
import './styles/Cart.css';
import './styles/SalePage.css';
import './styles/Productlist.css';
import './styles/Sidebar.css';
import './styles/StaffManagement.css';
import './styles/SideBarApp.css';
import './styles/Login.css';
import './styles/ProductManagement.css';
import './styles/TableManagementPage.css';
import './styles/TableList.css';
import './styles/TableCart.css';
import './styles/IngredientManagementPage.css';
import './styles/ReceiptList.css';
import './styles/IngredientSelection.css';
import './styles/BaristaPage.css';
import './styles/payment.css';
// import './styles/supplier.css';

// Component bảo vệ route
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route cho trang login */}
        <Route path="/" element={<LoginPage />} />

        {/* Route cho trang bán hàng */}
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <SalesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/:tableId"
          element={
            // <ProtectedRoute>
              <SalesPage />
            // </ProtectedRoute> 
          }
        />

        {/* Route cho trang thanh toán thành công */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
        {/* Route cho trang thanh toán thất bại */}
        <Route path="/payment-failed" element={<PaymentFailed />} />

        {/* Route cho trang quản lý (admin) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <ManagementPage />
            </ProtectedRoute>
          }
        />

        {/* Route cho trang barista */}
        <Route
          path="/barista"
          element={
            <ProtectedRoute>
              <BaristaTableManagementPage /> {/* Thay thế BaristaPage */}
            </ProtectedRoute>
          }
        />

        {/* Route cho trang quản lý kho */}
        <Route
          path="/inventory_manager"
          element={
            <ProtectedRoute>
              <InventoryManagerPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;