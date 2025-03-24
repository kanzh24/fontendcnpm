import React, { useState } from 'react';
import Sidebar                from '../Sidebar';
import Statistics             from './Statistics';
import OrderHistory           from './OrderHistory';
import StaffManagement        from './StaffManagement';
import ProductManagement      from './ProductManagement.js';
// import '../styles/SidebarApp.css';

const SidebarApp = () => {
  const [activeFeature, setActiveFeature] = useState('statistics');

  const menuItems = [
    { icon: 'fa-chart-bar', label: 'Thống kê', feature: 'statistics' },
    { icon: 'fa-history', label: 'Lịch sử đơn hàng', feature: 'orderHistory' },
    { icon: 'fa-users', label: 'Quản lý nhân viên', feature: 'staffManagement' },
    { icon: 'fa-box', label: 'Quản lý sản phẩm', feature: 'productManagement' },
  ];

  const renderContent = () => {
    switch (activeFeature) {
      case 'statistics':
        return <Statistics />;
      case 'orderHistory':
        return <OrderHistory />;
      case 'staffManagement':
        return <StaffManagement />;
      case 'productManagement':
        return <ProductManagement />;
      default:
        return <Statistics />;
    }
  };

  return (
    <div className="sidebar-app-container">
      <Sidebar menuItems={menuItems} setActiveFeature={setActiveFeature} />
      <div className="sidebar-app-content">{renderContent()}</div>
    </div>
  );
};

export default SidebarApp;