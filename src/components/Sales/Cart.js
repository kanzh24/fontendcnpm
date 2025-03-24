import React, { useState } from 'react';
const Cart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Pizza Margherita', price: 150000, quantity: 2, image: null },
    { id: 2, name: 'Cà phê sữa đá', price: 30000, quantity: 1, image: null },
    // Loại bỏ các mục trùng lặp
  ]);

  const fallbackImage = require(`../../assets/images/image01.jpg`);

  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    );
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

  return (
    <div className="cart-container">
      <div className="cart">
        <h3 className="cart-title">Giỏ hàng</h3>
        <ul className="cart-items">
          {cartItems.map((item) => (
            <li key={item.id} className="cart-item">
              <img src={item.image || fallbackImage} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-price">{item.price.toLocaleString()} VND</span>
              </div>
              <div className="cart-item-quantity">
                <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="cart-total">
          <strong>Tổng cộng:</strong>
          <span>{totalPrice.toLocaleString()} VND</span>
        </div>
        <button className="checkout-button">Thanh toán</button>
      </div>
    </div>
  );
};

export default Cart;