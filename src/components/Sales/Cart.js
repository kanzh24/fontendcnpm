import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createOrder, createPayment } from '../../api/api';
import { toast } from 'react-toastify';

const Cart = ({ cartItems, setCartItems }) => {
  const fallbackImage = require(`../../assets/images/image01.jpg`);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { tableId } = useParams();

const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + delta;
            if (delta < 0 && newQuantity >= 0) {
              return { ...item, quantity: newQuantity };
            }
            if (delta > 0 && newQuantity <= (parseInt(item.soldCount) || 0)) {
              return { ...item, quantity: newQuantity };
            } else if (delta > 0 && newQuantity > (parseInt(item.soldCount) || 0)) {
              toast.error(`Số lượng vượt quá tồn kho (${item.soldCount} sản phẩm)`, {
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

  const handleCreateOrder = async () => {
    try {
      if (!tableId) {
        toast.error('Không tìm thấy thông tin bàn. Vui lòng quét mã QR trước.');
        return null;
      }

      const orderData = {
        tableId,
        orderItems: cartItems.map((item) => ({
          drinkId: parseInt(item.id),
          quantity: item.quantity,
        })),
      };
      console.log(orderData);
      const response = await createOrder(orderData);
      return response.id;
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error.response?.data?.message || error.message);
      toast.error(`Đã xảy ra lỗi khi tạo đơn hàng: ${error.response?.data?.message || 'Vui lòng thử lại'}`);
      return null;
    }
  };

  const handleCashPayment = async (orderId) => {
    try {
      const paymentData = {
        orderId,
        method: 'cash',
      };

      const response = await createPayment(paymentData);
      console.log(paymentData);
      if (response.success) {
        toast.success('Thanh toán tiền mặt thành công!');
        setCartItems([]);
        return response.data.payment;
      } else {
        toast.error('Không thể tạo thanh toán');
      }
    } catch (error) {
      console.error('Lỗi khi tạo thanh toán tiền mặt:', error);
      toast.error('Đã xảy ra lỗi khi xử lý thanh toán');
    }
  };

  const handleVNPayPayment = async (orderId) => {
    try {
      const paymentData = {
        orderId,
        method: 'vnpay',
      };

      const response = await createPayment(paymentData);

      if (response.success) {
        localStorage.setItem('currentOrderId', orderId);
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error('Không thể tạo thanh toán');
      }
    } catch (error) {
      console.error('Lỗi khi tạo thanh toán VNPay:', error);
      toast.error('Đã xảy ra lỗi khi xử lý thanh toán');
    }
  };

  const handleCheckout = async () => {
    if (!paymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán!');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống!');
      return;
    }

    setIsProcessing(true);
    const orderId = await handleCreateOrder();

    if (!orderId) {
      setIsProcessing(false);
      return;
    }

    if (paymentMethod === 'cash') {
      await handleCashPayment(orderId);
    } else if (paymentMethod === 'vnpay') {
      await handleVNPayPayment(orderId);
    }

    setIsProcessing(false);
  };

  return (
    <div className="cart-container">
      <div className="cart">
        <h3 className="cart-title">Giỏ hàng</h3>
        <ul className="cart-items">
          {cartItems.map((item) => (
            <li key={item.id} className="cart-item">
              <img src={item.image_url || fallbackImage} alt={item.name} className="cart-item-image" />
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

        <div className="payment-methods">
          <h4>Chọn phương thức thanh toán:</h4>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              onChange={() => setPaymentMethod('cash')}
              checked={paymentMethod === 'cash'}
            />
            Tiền mặt
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="vnpay"
              onChange={() => setPaymentMethod('vnpay')}
              checked={paymentMethod === 'vnpay'}
            />
            VNPay
          </label>
        </div>

        <button
          className="checkout-button"
          onClick={handleCheckout}
          disabled={isProcessing}
        >
          {isProcessing ? 'Đang xử lý...' : 'Đặt món'}
        </button>
      </div>
    </div>
  );
};

export default Cart;