import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SalesPage from './pages/SalesPage';
import ManagementPage from './pages/ManagementPage';
import { useParams } from 'react-router-dom'; // nếu cần xử lý trong component

import { isAuthenticated } from './api/auth';
import './styles/Header.css';
import './styles/styles.css';
// import './styles/SideBarSale.css';
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

// Component bảo vệ route
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
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
            <ProtectedRoute>
              <SalesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management"
          element={
            <ProtectedRoute>
              <ManagementPage />
            </ProtectedRoute>
          }
        />
      </Routes>

    </Router>
  );
};

export default App;