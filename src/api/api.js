import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor để thêm token vào header của các yêu cầu
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Employees (Quản lý nhân viên)
export const getEmployees = async () => {
  const response = await api.get('/api/v1/employees');
  return response.data;
};

export const registerEmployee = async (employeeData) => {
  const response = await api.post('/api/v1/employees/register', employeeData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/api/v1/employees/login', credentials);
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post('/api/v1/employees/refresh-token');
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/api/v1/employees/profile');
  return response.data;
};

export const getEmployeeById = async (id) => {
  const response = await api.get(`/api/v1/employees/${id}`);
  return response.data;
};

export const updateEmployee = async (id, employeeData) => {
  const response = await api.put(`/api/v1/employees/${id}`, employeeData);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await api.delete(`/api/v1/employees/${id}`);
  return response.data;
};

export const restoreEmployee = async (id) => {
  const response = await api.patch(`/api/v1/employees/${id}/restore`);
  return response.data;
};

// Suppliers (Quản lý nhà cung cấp)
export const createSupplier = async (supplierData) => {
  const response = await api.post('/api/v1/suppliers', supplierData);
  return response.data;
};

export const getSuppliers = async () => {
  const response = await api.get('/api/v1/suppliers');
  return response.data;
};

export const getSupplierById = async (id) => {
  const response = await api.get(`/api/v1/suppliers/${id}`);
  return response.data;
};

export const updateSupplier = async (id, supplierData) => {
  const response = await api.put(`/api/v1/suppliers/${id}`, supplierData);
  return response.data;
};

export const deleteSupplier = async (id) => {
  const response = await api.delete(`/api/v1/suppliers/${id}`);
  return response.data;
};

export const restoreSupplier = async (id) => {
  const response = await api.patch(`/api/v1/suppliers/${id}`);
  return response.data;
};
export const deletedSuppliersList = async () => {
  const response = await api.get(`/api/v1/suppliers/deleted`);
  return response.data;
};



// Ingredients (Quản lý nguyên liệu)
export const createIngredient = async (ingredientData) => {
  const response = await api.post('/api/v1/ingredients', ingredientData);
  return response.data;
};

export const deletedIngredient = async (ingredientData) => {
  const response = await api.get('/api/v1/ingredients/deleted');
  return response.data;
};


export const getIngredients = async () => {
  const response = await api.get('/api/v1/ingredients');
  return response.data;
};

export const getIngredientById = async (id) => {
  const response = await api.get(`/api/v1/ingredients/${id}`);
  return response.data;
};

export const updateIngredient = async (id, ingredientData) => {
  const response = await api.put(`/api/v1/ingredients/${id}`, ingredientData);
  return response.data;
};

export const deleteIngredient = async (id) => {
  const response = await api.delete(`/api/v1/ingredients/${id}`);
  return response.data;
};

export const restoreIngredient = async (id) => {
  const response = await api.patch(`/api/v1/ingredients/${id}/restore`);
  return response.data;
};

// Recipes (Quản lý công thức)
export const createRecipe = async (recipeData) => {
  const response = await api.post('/api/v1/recipes', recipeData);
  return response.data;
};

export const getRecipes = async () => {
  const response = await api.get('/api/v1/recipes');
  return response.data;
};

export const getRecipeById = async (id) => {
  const response = await api.get(`/api/v1/recipes/${id}`);
  return response.data;
};

export const updateRecipe = async (id, recipeData) => {
  const response = await api.put(`/api/v1/recipes/${id}`, recipeData);
  return response.data;
};

export const deleteRecipe = async (id) => {
  const response = await api.delete(`/api/v1/recipes/${id}`);
  return response.data;
};

export const restoreRecipe = async (id) => {
  const response = await api.patch(`/api/v1/recipes/${id}`);
  return response.data;
};

// Stock Imports (Quản lý nhập kho)
export const createStockImport = async (stockImportData) => {
  const response = await api.post('/api/v1/stock-imports', stockImportData);
  return response.data;
};

export const getStockImports = async () => {
  const response = await api.get('/api/v1/stock-imports');
  return response.data;
};

export const getStockImportById = async (id) => {
  const response = await api.get(`/api/v1/stock-imports/${id}`);
  return response.data;
};

export const updateStockImport = async (id, stockImportData) => {
  const response = await api.put(`/api/v1/stock-imports/${id}`, stockImportData);
  return response.data;
};

export const deleteStockImport = async (id) => {
  const response = await api.delete(`/api/v1/stock-imports/${id}`);
  return response.data;
};

export const restoreStockImport = async (id) => {
  const response = await api.patch(`/api/v1/stock-imports/${id}`);
  return response.data;
};

// Stock Import Items (Quản lý chi tiết phiếu nhập kho)
export const createStockImportItem = async (stockImportItemData) => {
  const response = await api.post('api/v1/stock-import-items', stockImportItemData);
  return response.data;
};

export const getStockImportItems = async () => {
  const response = await api.get('api/v1/stock-import-items');
  return response.data;
};

export const getStockImportItemById = async (id) => {
  const response = await api.get(`api/v1/stock-import-items/${id}`);
  return response.data;
};

export const updateStockImportItem = async (id, stockImportItemData) => {
  const response = await api.put(`api/v1/stock-import-items/${id}`, stockImportItemData);
  return response.data;
};

export const deleteStockImportItem = async (id) => {
  const response = await api.delete(`api/v1/stock-import-items/${id}`);
  return response.data;
};

export const restoreStockImportItem = async (id) => {
  const response = await api.patch(`api/v1/stock-import-items/${id}`);
  return response.data;
};

// Tables (Quản lý bàn)
export const createTable = async (tableData) => {
  const response = await api.post('/api/v1/tables', tableData);
  return response.data;
};

export const getTables = async () => {
  const response = await api.get('/api/v1/tables');
  return response.data;
};

export const getTableById = async (id) => {
  const response = await api.get(`/api/v1/tables/${id}`);
  return response.data;
};

export const updateTable = async (id, tableData) => {
  const response = await api.put(`/api/v1/tables/${id}`, tableData);
  return response.data;
};

export const deleteTable = async (id) => {
  const response = await api.delete(`/api/v1/tables/${id}`);
  return response.data;
};

export const getTableOrders = async(id)=> {
  const response = await api.get(`/api/v1/tables/${id}/orders`);
  return response.data;
}

// Drinks (Quản lý đồ uống)
export const createDrink = async (drinkData) => {
  const response = await api.post('/api/v1/drinks', drinkData);
  return response.data;
};

export const getDrinks = async () => {
  const response = await api.get('/api/v1/drinks');
  return response.data;
};

export const getDrinkById = async (id) => {
  const response = await api.get(`/api/v1/drinks/${id}`);
  return response.data;
};

export const updateDrink = async (id, drinkData) => {
  const response = await api.patch(`/api/v1/drinks/${id}`, drinkData);
  return response.data;
};

export const deleteDrink = async (id) => {
  const response = await api.delete(`/api/v1/drinks/${id}`);
  return response.data;
};
export const deleted = async (id) => {
  const response = await api.get(`/api/v1/drinks/only-trashed`);
  return response.data;
};
export const restore = async (id) => {
  const response = await api.post(`/api/v1/drinks/${id}/restore`);
  return response.data;
};export const remaining = async (id) => {
  const response = await api.get(`/api/v1/drinks/${id}/available-quantity`);
  return response.data;
};



// Payments (Quản lý thanh toán)
export const createPayment = async (paymentData) => {
  const response = await api.post('/api/v1/payments/create-payment', paymentData);
  return response.data;
};

export const getVnpayReturn = async (params) => {
  const response = await api.get('/api/v1/payments/vnpay-return', { params });
  return response.data;
};

export const getVnpayIpn = async (params) => {
  const response = await api.get('/api/v1/payments/vnpay-ipn', { params });
  return response.data;
};

export const getPaymentByOrderId = async (orderId) => {
  const response = await api.get(`/api/v1/payments/order/${orderId}`);
  return response.data;
};

export const getPaymentById = async (id) => {
  const response = await api.get(`/api/v1/payments/${id}`);
  return response.data;
};

// Orders (Quản lý đơn hàng)
export const createOrder = async (orderData) => {
  const response = await api.post('/api/v1/orders', orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/api/v1/orders');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/api/v1/orders/${id}`);
  return response.data;
};

export const updateOrder = async (id, orderData) => {
  const response = await api.patch(`/api/v1/orders/${id}`, orderData);
  return response.data;
};

// App (API gốc)
export const getAppRoot = async () => {
  const response = await api.get('/api/v1');
  return response.data;
};  

// Statistics (Thống kê)
export const getRevenueStatistics = async (params) => {
  const response = await api.get('/api/v1/statistics/revenue', { params });
  return response.data;
};

export const getProductStatistics = async (params) => {
  const response = await api.get('/api/v1/statistics/products', { params });
  return response.data;
};

export const getDashboardStatistics = async () => {
  const response = await api.get('/api/v1/statistics/dashboard');
  return response.data;
};
