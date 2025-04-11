import React, { useState } from 'react';
import ReceiptList from './ReceiptList';
import IngredientSelection from './IngredientSelection';

const IngredientManagementPage = () => {
  const [isAddingReceipt, setIsAddingReceipt] = useState(false); // Trạng thái thêm phiếu nhập
  const [currentReceipt, setCurrentReceipt] = useState([]); // Phiếu nhập hiện tại đang tạo
  const [receipts, setReceipts] = useState([
    { id: 1, date: '2025-04-09', items: [
      { id: 1, name: 'Bột mì', quantity: 10, unit: 'kg' },
      { id: 2, name: 'Phô mai', quantity: 5, unit: 'kg' },
    ]},
    { id: 2, date: '2025-04-08', items: [
      { id: 3, name: 'Sốt cà chua', quantity: 3, unit: 'lít' },
    ]},
  ]); // Danh sách phiếu nhập cũ

  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Bột mì', quantity: 50, unit: 'kg' },
    { id: 2, name: 'Phô mai', quantity: 20, unit: 'kg' },
    { id: 3, name: 'Sốt cà chua', quantity: 15, unit: 'lít' },
    { id: 4, name: 'Thịt bò', quantity: 10, unit: 'kg' },
    { id: 5, name: 'Trân châu', quantity: 5, unit: 'kg' },
  ]); // Danh sách nguyên liệu

  // Bắt đầu tạo phiếu nhập mới
  const handleAddReceipt = () => {
    setIsAddingReceipt(true);
    setCurrentReceipt([]);
  };

  // Thêm nguyên liệu vào phiếu nhập hiện tại
  const handleAddToReceipt = (ingredient, quantity) => {
    setCurrentReceipt((prev) => [
      ...prev,
      { id: ingredient.id, name: ingredient.name, quantity, unit: ingredient.unit },
    ]);
  };

  // Xác nhận hoàn tất phiếu nhập
  const handleConfirmReceipt = () => {
    if (currentReceipt.length > 0) {
      const newReceipt = {
        id: receipts.length + 1,
        date: new Date().toISOString().split('T')[0], // Lấy ngày hiện tại
        items: currentReceipt,
      };
      setReceipts((prev) => [...prev, newReceipt]);

      // Cập nhật số lượng nguyên liệu
      setIngredients((prevIngredients) =>
        prevIngredients.map((ingredient) => {
          const addedItem = currentReceipt.find((item) => item.id === ingredient.id);
          if (addedItem) {
            return { ...ingredient, quantity: ingredient.quantity + addedItem.quantity };
          }
          return ingredient;
        })
      );
    }
    setIsAddingReceipt(false);
    setCurrentReceipt([]);
  };

  // Hủy tạo phiếu nhập
  const handleCancelReceipt = () => {
    setIsAddingReceipt(false);
    setCurrentReceipt([]);
  };

  return (
    <div className="ingredient-management-page-container">
      <div className="ingredient-management-content">
        <h2>Quản lý nhập nguyên liệu</h2>
        {!isAddingReceipt ? (
          <>
            <button className="add-receipt-button" onClick={handleAddReceipt}>
              Thêm phiếu nhập
            </button>
            <ReceiptList receipts={receipts} />
          </>
        ) : (
          <IngredientSelection
            ingredients={ingredients}
            currentReceipt={currentReceipt}
            handleAddToReceipt={handleAddToReceipt}
            handleConfirmReceipt={handleConfirmReceipt}
            handleCancelReceipt={handleCancelReceipt}
          />
        )}
      </div>
    </div>
  );
};

export default IngredientManagementPage;