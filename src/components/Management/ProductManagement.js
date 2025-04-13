import React, { useState, useEffect } from 'react';
import { getRecipes, createRecipe, updateRecipe, deleteRecipe, getIngredients } from '../../api/api';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isIngredientFormOpen, setIsIngredientFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    status: 'In Stock',
    productId: '',
    quantity: 0,
    price: 0,
    category: 'Fast Food',
    image: null,
    ingredients: [],
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipesData = await getRecipes();
        const ingredientsData = await getIngredients();

        const formattedRecipes = recipesData.map((recipe) => ({
          id: recipe.id,
          name: recipe.name || 'Unknown',
          status: recipe.status || 'In Stock',
          productId: recipe.productId || `PROD-${recipe.id}`,
          quantity: recipe.quantity || 0,
          price: recipe.price || 0,
          category: recipe.category || 'Fast Food',
          image: recipe.image || null,
          ingredients: (recipe.ingredients || []).map((ingredient) => ({
            id: ingredient.id,
            name: ingredient.name || 'Unknown',
            quantity: ingredient.quantity || 0,
            unit: ingredient.unit || 'unit',
          })),
        }));

        const formattedIngredients = ingredientsData.map((ingredient) => ({
          id: ingredient.id,
          name: ingredient.name || 'Unknown',
          quantity: ingredient.quantity || 0,
          unit: ingredient.unit || 'unit',
        }));

        setProducts(formattedRecipes);
        setIngredients(formattedIngredients);
      } catch (err) {
        setError('Failed to load data: ' + err.message);
      }
    };
    fetchData();
  }, []);

  const openAddForm = () => {
    setFormData({
      id: null,
      name: '',
      status: 'In Stock',
      productId: '',
      quantity: 0,
      price: 0,
      category: 'Fast Food',
      image: null,
      ingredients: [],
    });
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const openEditForm = (product) => {
    setFormData(product);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsIngredientFormOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleAddIngredient = (ingredient, quantity) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { id: ingredient.id, name: ingredient.name, quantity: parseFloat(quantity), unit: ingredient.unit },
      ],
    }));
  };

  const handleRemoveIngredient = (ingredientId) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((item) => item.id !== ingredientId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        const updatedProduct = await updateRecipe(formData.id, formData);
        const formattedUpdatedProduct = {
          id: updatedProduct.id,
          name: updatedProduct.name || 'Unknown',
          status: updatedProduct.status || 'In Stock',
          productId: updatedProduct.productId || `PROD-${updatedProduct.id}`,
          quantity: updatedProduct.quantity || 0,
          price: updatedProduct.price || 0,
          category: updatedProduct.category || 'Fast Food',
          image: updatedProduct.image || null,
          ingredients: (updatedProduct.ingredients || []).map((ingredient) => ({
            id: ingredient.id,
            name: ingredient.name || 'Unknown',
            quantity: ingredient.quantity || 0,
            unit: ingredient.unit || 'unit',
          })),
        };
        setProducts((prev) =>
          prev.map((product) => (product.id === formData.id ? formattedUpdatedProduct : product))
        );
      } else {
        const newProduct = await createRecipe(formData);
        const formattedNewProduct = {
          id: newProduct.id,
          name: newProduct.name || 'Unknown',
          status: newProduct.status || 'In Stock',
          productId: newProduct.productId || `PROD-${newProduct.id}`,
          quantity: newProduct.quantity || 0,
          price: newProduct.price || 0,
          category: newProduct.category || 'Fast Food',
          image: newProduct.image || null,
          ingredients: (newProduct.ingredients || []).map((ingredient) => ({
            id: ingredient.id,
            name: ingredient.name || 'Unknown',
            quantity: ingredient.quantity || 0,
            unit: ingredient.unit || 'unit',
          })),
        };
        setProducts((prev) => [...prev, formattedNewProduct]);
      }
      closeForm();
    } catch (err) {
      setError('Failed to save product: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await deleteRecipe(id);
        setProducts((prev) => prev.filter((product) => product.id !== id));
      } catch (err) {
        setError('Failed to delete product: ' + err.message);
      }
    }
  };

  return (
    <div className="product-management-container">
      <h2>Quản lý sản phẩm</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button className="add-product-button" onClick={openAddForm}>
        Thêm sản phẩm
      </button>

      <table className="product-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Status</th>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Ingredients</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="product-info">
                  <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} className="product-image" />
                  <span>{product.name}</span>
                </div>
              </td>
              <td>
                <span className={`status ${product.status.toLowerCase().replace(' ', '-')}`}>
                  {product.status}
                </span>
              </td>
              <td>{product.productId}</td>
              <td>{product.quantity}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>
                {product.ingredients.length > 0 ? (
                  <ul>
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        {ingredient.name}: {ingredient.quantity} {ingredient.unit}
                      </li>
                    ))}
                  </ul>
                ) : (
                  'Chưa có nguyên liệu'
                )}
              </td>
              <td>
                <button className="edit-button" onClick={() => openEditForm(product)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDelete(product.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isFormOpen && (
        <div className="form-overlay">
          <div className="form-container">
            <button className="close-button" onClick={closeForm}>
              <i className="fas fa-arrow-left"></i>
            </button>
            {!isIngredientFormOpen ? (
              <>
                <div className="image-upload">
                  <img
                    src={formData.image || 'https://via.placeholder.com/150?text=Product+Image'}
                    alt="Product Preview"
                    className="image-preview"
                  />
                  <label htmlFor="image-upload" className="upload-label">
                    Upload Image
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!isEditMode}
                    style={{ display: 'none' }}
                  />
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Product Name:</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Product Unit:</label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Category:</label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price:</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Status:</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Product ID:</label>
                      <input
                        type="text"
                        name="productId"
                        value={formData.productId}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Nguyên liệu cần thiết:</label>
                    {formData.ingredients.length > 0 ? (
                      <ul>
                        {formData.ingredients.map((ingredient, index) => (
                          <li key={index}>
                            {ingredient.name}: {ingredient.quantity} {ingredient.unit}
                            <button
                              type="button"
                              onClick={() => handleRemoveIngredient(ingredient.id)}
                              style={{ marginLeft: '10px', color: 'red' }}
                            >
                              Xóa
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Chưa có nguyên liệu nào được thêm.</p>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsIngredientFormOpen(true)}
                      className="add-ingredient-button"
                    >
                      Thêm nguyên liệu
                    </button>
                  </div>
                  <button type="submit" className="save-product-button">
                    Save Product
                  </button>
                </form>
              </>
            ) : (
              <div className="ingredient-selection-container">
                <h3>Chọn nguyên liệu cho {formData.name}</h3>
                <div className="ingredient-selection-content">
                  <div className="ingredient-list">
                    <h4>Danh sách nguyên liệu</h4>
                    <div className="ingredient-grid">
                      {ingredients.map((ingredient) => (
                        <div
                          key={ingredient.id}
                          className={`ingredient-item ${
                            formData.ingredients.find((i) => i.id === ingredient.id)
                              ? 'selected'
                              : ''
                          }`}
                          onClick={() => {
                            if (!formData.ingredients.find((i) => i.id === ingredient.id)) {
                              setFormData((prev) => ({
                                ...prev,
                                selectedIngredient: ingredient,
                              }));
                            }
                          }}
                        >
                          <h5>{ingredient.name}</h5>
                          <p>Số lượng hiện tại: {ingredient.quantity} {ingredient.unit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="ingredient-input">
                    {formData.selectedIngredient && (
                      <>
                        <h4>Nhập số lượng - {formData.selectedIngredient.name}</h4>
                        <div className="input-form">
                          <label>Số lượng cần ({formData.selectedIngredient.unit}):</label>
                          <input
                            type="number"
                            value={formData.selectedIngredient.quantity || 0}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                selectedIngredient: {
                                  ...prev.selectedIngredient,
                                  quantity: e.target.value,
                                },
                              }))
                            }
                            min="0"
                            step="0.01"
                          />
                          <button
                            onClick={() => {
                              handleAddIngredient(
                                formData.selectedIngredient,
                                formData.selectedIngredient.quantity
                              );
                              setFormData((prev) => ({
                                ...prev,
                                selectedIngredient: null,
                              }));
                            }}
                          >
                            Thêm vào danh sách
                          </button>
                        </div>
                      </>
                    )}
                    <div className="current-ingredients">
                      <h4>Nguyên liệu đã chọn</h4>
                      {formData.ingredients.length > 0 ? (
                        <ul>
                          {formData.ingredients.map((item, index) => (
                            <li key={index}>
                              {item.name}: {item.quantity} {item.unit}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Chưa có nguyên liệu nào được thêm.</p>
                      )}
                    </div>
                    <div className="ingredient-actions">
                      <button onClick={() => setIsIngredientFormOpen(false)}>
                        Xong
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;