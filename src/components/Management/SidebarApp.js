import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Statistics from './Statistics';
import OrderHistory from './OrderHistory';
import StaffManagement from './StaffManagement';
import ProductManagement from './ProductManagement';
import TableManagementPage from './TableManagementPage';
import IngredientManagementPage from './IngredientManagementPage';
import IngredientManagement from './IngredientManagement';

const SidebarApp = () => {
  const [activeFeature, setActiveFeature] = useState('statistics');

  const menuItems = [
    { icon: 'fa-chart-bar', label: 'Thống kê', feature: 'statistics' },
    { icon: 'fa-history', label: 'Lịch sử đơn hàng', feature: 'orderHistory' },
    { icon: 'fa-users', label: 'Quản lý nhân viên', feature: 'staffManagement' },
    { icon: 'fa-box', label: 'Quản lý sản phẩm', feature: 'productManagement' },
    { icon: 'fa-table', label: 'Quản lý bàn', feature: 'tableManagement' },
    { icon: 'fa-warehouse', label: 'Quản lý nhập nguyên liệu', feature: 'ingredientManagement' },
    { icon: 'fa-lemon', label: 'Quản lý nguyên liệu', feature: 'ingredient' },
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
      case 'tableManagement':
        return <TableManagementPage />;
      case 'ingredientManagement':
        return <IngredientManagementPage />;
      case 'ingredient': // Sửa từ 'Ingredient' thành 'ingredient'
        return <IngredientManagement />;
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