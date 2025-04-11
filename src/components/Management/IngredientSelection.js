import React, { useState } from 'react';

const IngredientSelection = ({
  ingredients,
  currentReceipt,
  handleAddToReceipt,
  handleConfirmReceipt,
  handleCancelReceipt,
}) => {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [quantity, setQuantity] = useState(0);

  const handleSelectIngredient = (ingredient) => {
    setSelectedIngredient(ingredient);
    setQuantity(0);
  };

  const handleAdd = () => {
    if (selectedIngredient && quantity > 0) {
      handleAddToReceipt(selectedIngredient, parseFloat(quantity));
      setSelectedIngredient(null);
      setQuantity(0);
    }
  };

  return (
    <div className="ingredient-selection-container">
      <h3>Tạo phiếu nhập mới</h3>
      <div className="ingredient-selection-content">
        <div className="ingredient-list">
          <h4>Chọn nguyên liệu</h4>
          <div className="ingredient-grid">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className={`ingredient-item ${selectedIngredient?.id === ingredient.id ? 'selected' : ''}`}
                onClick={() => handleSelectIngredient(ingredient)}
              >
                <h5>{ingredient.name}</h5>
                <p>Số lượng hiện tại: {ingredient.quantity} {ingredient.unit}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="ingredient-input">
          {selectedIngredient && (
            <>
              <h4>Nhập số lượng - {selectedIngredient.name}</h4>
              <div className="input-form">
                <label>Số lượng thêm ({selectedIngredient.unit}):</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="0"
                  step="0.1"
                />
                <button onClick={handleAdd}>Thêm vào phiếu</button>
              </div>
            </>
          )}
          <div className="current-receipt">
            <h4>Nguyên liệu đã chọn</h4>
            {currentReceipt.length > 0 ? (
              <ul>
                {currentReceipt.map((item, index) => (
                  <li key={index}>
                    {item.name}: {item.quantity} {item.unit}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Chưa có nguyên liệu nào được thêm.</p>
            )}
          </div>
          <div className="receipt-actions">
            <button onClick={handleConfirmReceipt} disabled={currentReceipt.length === 0}>
              Xác nhận phiếu nhập
            </button>
            <button onClick={handleCancelReceipt}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientSelection;