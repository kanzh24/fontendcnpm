import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SalesPage from './pages/SalesPage';
import ManagementPage from './pages/ManagementPage';
import './styles/Header.css'; // Import file CSS
import './styles/styles.css';
import './styles/SideBarSale.css';
import './styles/OrderHistory.css'; // File CSS tùy chỉnh
import './styles/Statistics.css'; // File CSS tùy chỉnh
import './styles/SideBarSale.css'
import './styles/Cart.css'
import './styles/SalePage.css';
import './styles/Productlist.css';
import './styles/Sidebar.css';
import './styles/Employee.css';
import './styles/SideBarApp.css';
import './styles/Login.css';
import './styles/ProductManagement.css';



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
