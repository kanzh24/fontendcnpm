import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SalesPage from './pages/SalesPage';
import ManagementPage from './pages/ManagementPage';
import './styles/Header.css';
import './styles/styles.css';
import './styles/SideBarSale.css';
import './styles/OrderHistory.css';
import './styles/Statistics.css';
import './styles/Cart.css';
import './styles/SalePage.css';
import './styles/Productlist.css';
import './styles/Sidebar.css';
import './styles/Employee.css';
import './styles/SideBarApp.css';
import './styles/Login.css';
import './styles/ProductManagement.css';
import './styles/TableManagementPage.css'; // Thêm CSS cho TableManagementPage
import './styles/TableList.css';
import './styles/TableCart.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/management" element={<ManagementPage />} />
      </Routes>
    </Router>
  );
};

export default App;