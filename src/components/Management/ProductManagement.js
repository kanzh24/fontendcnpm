import React, { useState } from 'react';
// import '../styles/ProductManagement.css';


import image01 from '../../assets/images/image01.jpg';
import image02 from '../../assets/images/image02.jpg';
import image03 from '../../assets/images/image03.jpg';

const ProductManagement = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Grill Sandwich', status: 'In Stock', productId: '6675941', quantity: 50, price: 20.00, category: 'Fast Food', image: image01 },
    { id: 2, name: 'Chicken Poppers', status: 'In Stock', productId: '6780952', quantity: 40, price: 30.00, category: 'Fast Food', image: image02 },
    { id: 3, name: 'Bison Burgers', status: 'In Stock', productId: '6897163', quantity: 40, price: 40.00, category: 'Fast Food', image: image03 },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    status: 'In Stock',
    productId: '',
    quantity: 0,
    price: 0,
    category: 'Fast Food',
    image: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);

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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'quantity' || name === 'price' ? parseFloat(value) : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      // Cập nhật sản phẩm
      setProducts((prev) =>
        prev.map((product) =>
          product.id === formData.id ? { ...product, ...formData } : product
        )
      );
    } else {
      // Thêm sản phẩm mới
      const newProduct = {
        ...formData,
        id: products.length + 1,
        image: formData.image || image01, // Sử dụng image01 làm mặc định nếu không upload ảnh
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    closeForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      setProducts((prev) => prev.filter((product) => product.id !== id));
    }
  };

  return (
    <div className="product-management-container">
      <h2>Quản lý sản phẩm</h2>
      <button className="add-product-button" onClick={openAddForm}>
        Thêm sản phẩm
      </button>

      {/* Bảng danh sách sản phẩm */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Status</th>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="product-info">
                  <img src={product.image} alt={product.name} className="product-image" />
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

      {/* Form thêm/sửa sản phẩm */}
      {isFormOpen && (
        <div className="form-overlay">
          <div className="form-container">
            <button className="close-button" onClick={closeForm}>
              <i className="fas fa-arrow-left"></i>
            </button>
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
              <button type="submit" className="save-product-button">
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;