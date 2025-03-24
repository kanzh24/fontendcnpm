import React, { useState } from 'react';
import SidebarSale from '../components/Sales/SideBarSale';
import ProductList from '../components/Sales/ProductList';
import Cart from '../components/Sales/Cart'; // Import Cart
// import '../styles/SalesPage.css';

const SalesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]); // State để quản lý giỏ hàng

  // Dữ liệu sản phẩm mẫu
  const allProducts = [
    { id: 1, name: 'Pizza Margherita', price: 150000, category: 'pizza', image: require(`../assets/images/image01.jpg`) },
    { id: 2, name: 'Cà phê sữa đá', price: 30000, category: 'drink', image: require(`../assets/images/image02.jpg`) },
    { id: 3, name: 'Phở bò', price: 60000, category: 'main', image: require(`../assets/images/image03.jpg`) },
    { id: 4, name: 'Bánh ngọt', price: 30000, category: 'dessert', image: require(`../assets/images/image04.jpg`) },
    { id: 5, name: 'Trà sữa trân châu', price: 45000, category: 'drink', image: require(`../assets/images/image05.jpg`) },
    { id: 6, name: 'Pizza Pepperoni', price: 170000, category: 'pizza', image: require(`../assets/images/image06.jpg`) },
  ];

  // Lọc sản phẩm theo danh mục
  const filteredProducts =
    selectedCategory === 'all'
      ? allProducts
      : allProducts.filter((product) => product.category === selectedCategory);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  return (
    <div className="sales-page-container">
      <SidebarSale setCategory={setSelectedCategory} />
      <div className="sales-page-content">
        <h2>Danh sách sản phẩm</h2>
        <ProductList products={filteredProducts} addToCart={addToCart} />
      </div>
      <Cart cartItems={cartItems} setCartItems={setCartItems} />
    </div>
  );
};

export default SalesPage;