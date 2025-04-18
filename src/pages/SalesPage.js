// === SalesPage.js ===
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDrinks, createOrder } from '../api/api';
import Header from '../components/Sales/Header';
import ProductList from '../components/Sales/ProductList';
import Cart from '../components/Sales/Cart';

const SalesPage = () => {
  const { tableId } = useParams();
  const [drinks, setDrinks] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [category, setCategory] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const drinksData = await getDrinks();
        setDrinks(drinksData);
      } catch (err) {
        setError('Failed to load data: ' + (err.message || 'Server error'));
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem(`cart-${tableId}`);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, [tableId]);

  useEffect(() => {
    localStorage.setItem(`cart-${tableId}`, JSON.stringify(cartItems));
  }, [cartItems, tableId]);

  const filteredDrinks = drinks.filter((drink) => {
    if (category === 'all') return true;
    return drink.category === category;
  });

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

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      const orderData = {
        tableId: tableId,
        orderItems: cartItems.map((item) => ({
          drinkId: parseInt(item.id),
          quantity: parseInt(item.quantity),
        })),
      };
      console.log(orderData)
      await createOrder(orderData);

      alert('Đặt món thành công!');
      setCartItems([]);
      localStorage.removeItem(`cart-${tableId}`);
    } catch (err) {
      setError('Failed to create order: ' + (err.message || 'Server error'));
    }
  };

  return (
    <div className="sales-page">
      <Header />
      <div className="sales-content">
        <div className="sales-main">
          {error && <p className="error-message">{error}</p>}
          <ProductList products={filteredDrinks} addToCart={addToCart} />
          <Cart cartItems={cartItems} setCartItems={setCartItems} handleCheckout={handleCheckout} />
        </div>
      </div>
    </div>
  );
};

export default SalesPage;