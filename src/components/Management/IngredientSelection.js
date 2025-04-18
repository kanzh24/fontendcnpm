import React, { useState, useEffect } from 'react';
import { Select, InputNumber } from 'antd';

const { Option } = Select;

const IngredientSelection = ({
  ingredients,
  employees,
  suppliers,
  currentReceipt,
  handleAddToReceipt,
  handleConfirmReceipt,
  handleCancelReceipt,
}) => {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [employeeId, setEmployeeId] = useState(null);
  const [supplierId, setSupplierId] = useState(null);
  const [filteredIngredients, setFilteredIngredients] = useState(ingredients);

  // Lọc nguyên liệu theo nhà cung cấp khi supplierId thay đổi
  useEffect(() => {
    if (supplierId) {
      const filtered = ingredients.filter((ingredient) => ingredient.supplierId === supplierId);
      setFilteredIngredients(filtered);
    } else {
      setFilteredIngredients(ingredients);
    }
  }, [supplierId, ingredients]);

  const handleSelectIngredient = (ingredient) => {
    setSelectedIngredient(ingredient);
    setQuantity(0);
    setUnitPrice(0);
  };

  const handleAdd = () => {
    if (selectedIngredient && quantity > 0 && unitPrice > 0) {
      handleAddToReceipt(selectedIngredient, parseFloat(quantity), parseInt(unitPrice));
      setSelectedIngredient(null);
      setQuantity(0);
      setUnitPrice(0);
    }
  };

  return (
    <div className="ingredient-selection-container">
      <h3>Tạo phiếu nhập mới</h3>
      <div className="ingredient-selection-content">
        <div className="employee-supplier-selection">
          <div className="select-field">
            <label>Nhân viên:</label>
            <Select
              style={{ width: 200 }}
              placeholder="Chọn nhân viên"
              onChange={(value) => setEmployeeId(parseInt(value))} // Chuyển thành int
              value={employeeId}
            >
              {employees.map((employee) => (
                <Option key={employee.id} value={employee.id}>
                  {employee.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="select-field">
            <label>Nhà cung cấp:</label>
            <Select
              style={{ width: 200 }}
              placeholder="Chọn nhà cung cấp"
              onChange={(value) => setSupplierId(parseInt(value))} // Chuyển thành int
              value={supplierId}
            >
              {suppliers.map((supplier) => (
                <Option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="ingredient-list">
          <h4>Chọn nguyên liệu</h4>
          <div className="ingredient-grid">
            {filteredIngredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className={`ingredient-item ${selectedIngredient?.id === ingredient.id ? 'selected' : ''}`}
                onClick={() => handleSelectIngredient(ingredient)}
              >
                <h5>{ingredient.name}</h5>
                <p>Số lượng hiện tại: {ingredient.availableCount} {ingredient.unit}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="ingredient-input">
          {selectedIngredient && (
            <>
              <h4>Nhập thông tin - {selectedIngredient.name}</h4>
              <div className="input-form">
                <label>Số lượng thêm ({selectedIngredient.unit}):</label>
                <InputNumber
                  value={quantity}
                  onChange={(value) => setQuantity(value)}
                  min={0}
                  step={0.1} // quantity là float
                />
                <label>Đơn giá (VND):</label>
                <InputNumber
                  value={unitPrice}
                  onChange={(value) => setUnitPrice(value)}
                  min={0}
                  step={1} // unitPrice là int
                  parser={(value) => parseInt(value)} // Đảm bảo giá trị là int
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
                    {item.name}: {item.quantity} {item.unit} - Đơn giá: {item.unitPrice} VND
                  </li>
                ))}
              </ul>
            ) : (
              <p>Chưa có nguyên liệu nào được thêm.</p>
            )}
          </div>
          <div className="receipt-actions">
            <button
              onClick={() => handleConfirmReceipt(employeeId, supplierId)}
              disabled={currentReceipt.length === 0 || !employeeId || !supplierId}
            >
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