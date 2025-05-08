import React, { useState, useEffect } from 'react';
import { getIngredients, getStockImports, createStockImport, getSuppliers } from '../../api/api';
import ReceiptList from './ReceiptList';
import IngredientSelection from './IngredientSelection';

const IngredientManagementPage = () => {
  const [isAddingReceipt, setIsAddingReceipt] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ingredientsData = await getIngredients();
        const stockImportsData = await getStockImports();
        const suppliersData = await getSuppliers();

        // Định dạng ingredients
        const formattedIngredients = ingredientsData.map((ingredient) => ({
          id: parseInt(ingredient.id),
          name: ingredient.name || 'Unknown',
          availableCount: ingredient.availableCount || '0',
          unit: ingredient.unit || 'unit',
          supplierId: parseInt(ingredient.supplierId),
          supplier: ingredient.supplier,
        }));

        // Định dạng stock imports
        const formattedStockImports = stockImportsData.map((stockImport) => ({
          id: stockImport.id,
          createdAt: stockImport.createdAt || new Date().toISOString(),
          employeeId: parseInt(stockImport.employeeId),
          employee: stockImport.employee,
          supplierId: parseInt(stockImport.supplierId),
          supplier: stockImport.supplier,
          totalCost: stockImport.totalCost || '0',
          stockImportItems: (stockImport.stockImportItems || []).map((item) => ({
            id: item.id,
            ingredientId: parseInt(item.ingredientId),
            quantity: parseFloat(item.quantity) || 0,
            unitPrice: parseInt(item.unitPrice) || 0,
          })),
        }));

        // Định dạng suppliers
        const formattedSuppliers = suppliersData.map((supplier) => ({
          ...supplier,
          id: parseInt(supplier.id),
        }));

        setIngredients(formattedIngredients);
        setReceipts(formattedStockImports);
        setSuppliers(formattedSuppliers);
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

  const handleAddToReceipt = (ingredient, quantity, unitPrice) => {
    setCurrentReceipt((prev) => [
      ...prev,
      { id: ingredient.id, name: ingredient.name, quantity, unitPrice, unit: ingredient.unit },
    ]);
  };

  const handleConfirmReceipt = async (supplierId) => {
    if (currentReceipt.length > 0) {
      try {
        // Lấy userId từ localStorage
        const userId = parseInt(localStorage.getItem('user')?.split(',')[0].split(':')[1].replaceAll('"', ''));
        if (!userId) {
          throw new Error('User ID not found in localStorage');
        }

        const stockImportData = {
          employeeId: userId, // Gán employeeId từ userId
          supplierId: parseInt(supplierId), // Đảm bảo supplierId là int
          stockImportItems: currentReceipt.map((item) => ({
            ingredientId: item.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        };
        console.log('Data sent to API:', stockImportData); // Kiểm tra dữ liệu gửi lên

        const createdReceipt = await createStockImport(stockImportData);
        console.log('Response from API:', createdReceipt); // Kiểm tra dữ liệu trả về

        setReceipts((prev) => [
          ...prev,
          {
            id: createdReceipt.id,
            createdAt: createdReceipt.createdAt || new Date().toISOString(),
            employeeId: parseInt(createdReceipt.employeeId) || userId,
            employee: createdReceipt.employee || { name: 'N/A' },
            supplierId: parseInt(createdReceipt.supplierId) || parseInt(supplierId),
            supplier: createdReceipt.supplier || suppliers.find(s => s.id === supplierId) || { name: 'N/A' },
            totalCost: createdReceipt.totalCost || '0',
            stockImportItems: (createdReceipt.stockImportItems || []).map((item) => ({
              id: item.id,
              ingredientId: parseInt(item.ingredientId),
              quantity: parseFloat(item.quantity) || 0,
              unitPrice: parseInt(item.unitPrice) || 0,
            })),
          },
        ]);

        // Refresh ingredients sau khi tạo phiếu nhập
        const updatedIngredients = await getIngredients();
        const formattedIngredients = updatedIngredients.map((ingredient) => ({
          id: parseInt(ingredient.id),
          name: ingredient.name || 'Unknown',
          availableCount: ingredient.availableCount || '0',
          unit: ingredient.unit || 'unit',
          supplierId: parseInt(ingredient.supplierId),
          supplier: ingredient.supplier,
        }));
        setIngredients(formattedIngredients);
      } catch (err) {
        console.log(err);
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
            suppliers={suppliers}
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