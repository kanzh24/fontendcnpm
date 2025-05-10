import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createOrder, createPayment } from '../../api/api'; // Import các hàm từ file api
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify

const Cart = ({ cartItems, setCartItems }) => {
  const fallbackImage = require(`../../assets/images/image01.jpg`);
  const [paymentMethod, setPaymentMethod] = useState(null); // Trạng thái phương thức thanh toán
  const [isProcessing, setIsProcessing] = useState(false); // Trạng thái xử lý thanh toán
  const { tableId } = useParams(); // Lấy tableId từ URL params

  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

  // Hàm tạo đơn hàng
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
      const response = await createOrder(orderData); // Sử dụng hàm từ file api
      return response.id; // Trả về orderId từ response
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error.response.data.message);
      toast.error('Đã xảy ra lỗi khi tạo đơn hàng '+error.response.data.message);
      return null;
    }
  };

  // Hàm xử lý thanh toán tiền mặt
  const handleCashPayment = async (orderId) => {
    try {
      const paymentData = {
        orderId,
        method: 'cash',
      };

      const response = await createPayment(paymentData); // Sử dụng hàm từ file api
      console.log(paymentData);
      if (response.success) {
        toast.success('Thanh toán tiền mặt thành công!');
        setCartItems([]); // Xóa giỏ hàng sau khi thanh toán thành công
        return response.data.payment;
      } else {
        toast.error('Không thể tạo thanh toán');
      }
    } catch (error) {
      console.error('Lỗi khi tạo thanh toán tiền mặt:', error);
      toast.error('Đã xảy ra lỗi khi xử lý thanh toán');
    }
  };

  // Hàm xử lý thanh toán VNPay
  const handleVNPayPayment = async (orderId) => {
    try {
      const paymentData = {
        orderId,
        method: 'vnpay',
      };

      const response = await createPayment(paymentData); // Sử dụng hàm từ file api

      if (response.success) {
        localStorage.setItem('currentOrderId', orderId); // Lưu orderId để xử lý kết quả
        window.location.href = response.data.paymentUrl; // Chuyển hướng đến VNPay
      } else {
        toast.error('Không thể tạo thanh toán');
      }
    } catch (error) {
      console.error('Lỗi khi tạo thanh toán VNPay:', error);
      toast.error('Đã xảy ra lỗi khi xử lý thanh toán');
    }
  };

  // Hàm xử lý khi nhấn nút "Đặt món"
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

        {/* Chọn phương thức thanh toán */}
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

      {/* Thêm ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Cart;