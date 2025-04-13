import React, { useState, useEffect } from 'react';
import { getIngredients, getStockImports, createStockImport } from '../../api/api';
import ReceiptList from './ReceiptList';
import IngredientSelection from './IngredientSelection';

const IngredientManagementPage = () => {
  const [isAddingReceipt, setIsAddingReceipt] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ingredientsData = await getIngredients();
        const stockImportsData = await getStockImports();
        
        // Ensure ingredients have the expected structure
        const formattedIngredients = ingredientsData.map((ingredient) => ({
          id: ingredient.id,
          name: ingredient.name || 'Unknown',
          quantity: ingredient.quantity || 0,
          unit: ingredient.unit || 'unit',
        }));

        // Ensure stock imports have the expected structure
        const formattedStockImports = stockImportsData.map((stockImport) => ({
          id: stockImport.id,
          date: stockImport.date || new Date().toISOString().split('T')[0],
          items: (stockImport.items || []).map((item) => ({
            id: item.id,
            name: item.name || 'Unknown',
            quantity: item.quantity || 0,
            unit: item.unit || 'unit',
          })),
        }));

        setIngredients(formattedIngredients);
        setReceipts(formattedStockImports);
      } catch (err) {
        setError('Failed to load data: ' + err.message);
      }
    };
    fetchData();
  }, []);

  const handleAddReceipt = () => {
    setIsAddingReceipt(true);
    setCurrentReceipt([]);
  };

  const handleAddToReceipt = (ingredient, quantity) => {
    setCurrentReceipt((prev) => [
      ...prev,
      { id: ingredient.id, name: ingredient.name, quantity, unit: ingredient.unit },
    ]);
  };

  const handleConfirmReceipt = async () => {
    if (currentReceipt.length > 0) {
      try {
        const newReceipt = {
          date: new Date().toISOString().split('T')[0],
          items: currentReceipt,
        };
        const createdReceipt = await createStockImport(newReceipt);
        setReceipts((prev) => [...prev, {
          id: createdReceipt.id,
          date: createdReceipt.date || new Date().toISOString().split('T')[0],
          items: (createdReceipt.items || []).map((item) => ({
            id: item.id,
            name: item.name || 'Unknown',
            quantity: item.quantity || 0,
            unit: item.unit || 'unit',
          })),
        }]);

        // Refresh ingredients after creating a stock import
        const updatedIngredients = await getIngredients();
        const formattedIngredients = updatedIngredients.map((ingredient) => ({
          id: ingredient.id,
          name: ingredient.name || 'Unknown',
          quantity: ingredient.quantity || 0,
          unit: ingredient.unit || 'unit',
        }));
        setIngredients(formattedIngredients);
      } catch (err) {
        setError('Failed to create stock import: ' + err.message);
      }
    }
    setIsAddingReceipt(false);
    setCurrentReceipt([]);
  };

  const handleCancelReceipt = () => {
    setIsAddingReceipt(false);
    setCurrentReceipt([]);
  };

  return (
    <div className="ingredient-management-page-container">
      <div className="ingredient-management-content">
        <h2>Quản lý nhập nguyên liệu</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
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