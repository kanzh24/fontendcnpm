import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Cart = ({ cartItems, setCartItems, isOpen, setIsOpen, handleCheckout }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + delta;
            if (delta < 0 && newQuantity >= 0) {
              return { ...item, quantity: newQuantity };
            }
            if (delta > 0 && newQuantity <= (parseInt(item.remaining) || 0)) {
              return { ...item, quantity: newQuantity };
            } else if (delta > 0 && newQuantity > (parseInt(item.remaining) || 0)) {
              toast.error(`Số lượng vượt quá tồn kho (${item.remaining} sản phẩm)`, {
                toastId: `quantity-exceed-${item.id}`,
              });
              return item;
            }
            return item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

  const onCheckout = async () => {
    setIsProcessing(true);
    await handleCheckout();
    setIsProcessing(false);
  };

  return (
    <div className="cart-container">
      <div className={`cart ${isOpen ? 'open' : ''}`}>
        <h3 className="cart-title">Giỏ hàng</h3>
        <ul className="cart-items">
          {cartItems.map((item) => (
            <li key={item.id} className="cart-item">
              <img src={item.image_url} alt={item.name} className="cart-item-image" />
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
        <button
          className="checkout-button"
          onClick={onCheckout}
          disabled={isProcessing}
        >
          {isProcessing ? 'Đang xử lý...' : 'Đặt món'}
        </button>
      </div>
    </div>
  );
};

export default Cart;