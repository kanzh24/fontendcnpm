import React from 'react';
import IngredientManagementPage from '../components/Management/IngredientManagementPage'; // hoặc đúng path

const InventoryManagerPage = () => {
  return (
    <div>
      <h1>Inventory Manager - Nhập nguyên liệu</h1>
      <IngredientManagementPage />
    </div>
  );
};

export default InventoryManagerPage;
