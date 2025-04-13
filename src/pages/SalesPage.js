import React, { useState, useEffect } from 'react';
import { getDrinks, getTables, createOrder, createPayment } from '../api/api';
import Header from '../components/Sales/Header';
// import SidebarSale from '../components/Sales/SideBarSale';
import ProductList from '../components/Sales/ProductList';
import Cart from '../components/Sales/Cart';

const SalesPage = () => {
  const [drinks, setDrinks] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [category, setCategory] = useState('all');
  const [error, setError] = useState('');

  // Lấy danh sách đồ uống và bàn
  useEffect(() => {
    const fetchData = async () => {
      try {
        const drinksData = await getDrinks(); // Gọi API /api/v1/drinks
        console.log(drinksData)
        setDrinks(drinksData);
      } catch (err) {
        setError('Failed to load data: ' + (err.message || 'Server error'));
      }
    };
    fetchData();
  }, []);

  // Lọc đồ uống theo danh mục
  const filteredDrinks = drinks.filter((drink) => {
    if (category === 'all') return true;
    return drink.category === category;
  });

  // Thêm vào giỏ hàng
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

  // Tạo đơn hàng và thanh toán
  const handleCheckout = async () => {
    if (!selectedTable) {
      setError('Please select a table');
      return;
    }
    if (cartItems.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      const orderData = {
        tableId: selectedTable.id,
        items: cartItems.map((item) => ({
          drinkId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
      const order = await createOrder(orderData); // Gọi API /api/v1/orders

      const paymentData = {
        orderId: order.id,
        amount: order.total,
      };
      const payment = await createPayment(paymentData); // Gọi API /api/v1/payments/create-payment

      if (payment.paymentUrl) {
        window.location.href = payment.paymentUrl;
      } else {
        alert('Order created successfully!');
        setCartItems([]);
        setSelectedTable(null);
      }
    } catch (err) {
      setError('Failed to create order: ' + (err.message || 'Server error'));
    }
  };

  return (
    <div className="sales-page">
      {/* <Header /> */}
      <div className="sales-content">
        {/* <SidebarSale setCategory={setCategory} /> */}
        <div className="sales-main">
          {/* <h2>Sales Page</h2> */}
          {error && <p className="error-message">{error}</p>}
          <ProductList products={filteredDrinks} addToCart={addToCart} />
          <Cart cartItems={cartItems} setCartItems={setCartItems} handleCheckout={handleCheckout} />
        </div>
      </div>
    </div>
  );
};

export default SalesPage;