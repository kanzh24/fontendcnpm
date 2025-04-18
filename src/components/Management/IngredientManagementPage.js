import React, { useState, useEffect } from 'react';
import { getIngredients, getStockImports, createStockImport, getEmployees, getSuppliers } from '../../api/api';
import ReceiptList from './ReceiptList';
import IngredientSelection from './IngredientSelection';

const IngredientManagementPage = () => {
  const [isAddingReceipt, setIsAddingReceipt] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ingredientsData = await getIngredients();
        const stockImportsData = await getStockImports();
        const employeesData = await getEmployees();
        const suppliersData = await getSuppliers();

        // Định dạng ingredients
        const formattedIngredients = ingredientsData.map((ingredient) => ({
          id: parseInt(ingredient.id), // Chuyển id thành int
          name: ingredient.name || 'Unknown',
          availableCount: ingredient.availableCount || '0',
          unit: ingredient.unit || 'unit',
          supplierId: parseInt(ingredient.supplierId), // Chuyển supplierId thành int
          supplier: ingredient.supplier,
        }));

        // Định dạng stock imports
        const formattedStockImports = stockImportsData.map((stockImport) => ({
          id: stockImport.id,
          createdAt: stockImport.createdAt || new Date().toISOString(),
          employeeId: parseInt(stockImport.employeeId), // Chuyển employeeId thành int
          employee: stockImport.employee,
          supplierId: parseInt(stockImport.supplierId), // Chuyển supplierId thành int
          supplier: stockImport.supplier,
          totalCost: stockImport.totalCost || '0',
          stockImportItems: (stockImport.stockImportItems || []).map((item) => ({
            id: item.id,
            ingredientId: parseInt(item.ingredientId), // Chuyển ingredientId thành int
            quantity: parseFloat(item.quantity) || 0, // Đảm bảo quantity là float
            unitPrice: parseInt(item.unitPrice) || 0, // Đảm bảo unitPrice là int
          })),
        }));

        // Định dạng employees và suppliers
        const formattedEmployees = employeesData.map((employee) => ({
          ...employee,
          id: parseInt(employee.id), // Chuyển id thành int
        }));
        const formattedSuppliers = suppliersData.map((supplier) => ({
          ...supplier,
          id: parseInt(supplier.id), // Chuyển id thành int
        }));

        setIngredients(formattedIngredients);
        setReceipts(formattedStockImports);
        setEmployees(formattedEmployees);
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

  const handleConfirmReceipt = async (employeeId, supplierId) => {
    if (currentReceipt.length > 0) {
      try {
        const stockImportData = {
          employeeId, // Đã là int
          supplierId, // Đã là int
          stockImportItems: currentReceipt.map((item) => ({
            ingredientId: item.id, // Đã là int
            quantity: item.quantity, // Đã là float
            unitPrice: item.unitPrice, // Đã là int
          })),
        };
        const createdReceipt = await createStockImport(stockImportData);
        setReceipts((prev) => [
          ...prev,
          {
            id: createdReceipt.id,
            createdAt: createdReceipt.createdAt || new Date().toISOString(),
            employeeId: parseInt(createdReceipt.employeeId),
            employee: createdReceipt.employee,
            supplierId: parseInt(createdReceipt.supplierId),
            supplier: createdReceipt.supplier,
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
            employees={employees}
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