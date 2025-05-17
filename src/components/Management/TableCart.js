import React, { useState, useEffect } from 'react';
import { updateOrder,createPayment } from '../../api/api';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify

const TableCart = ({ table, handleTableStatus }) => {
  const [cartItems, setCartItems] = useState([]);
  const [allDelivered, setAllDelivered] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);
  const [isOrderAccepted, setIsOrderAccepted] = useState(false);

  useEffect(() => {
    const initialItems = Array.isArray(table.cartItems)
      ? table.cartItems.map((item) => ({
          ...item,
          delivered: localStorage.getItem(`delivered_${table.id}_${item.id}`) === 'true' || false,
        }))
      : [];
    setCartItems(initialItems);
    setIsOrderAccepted(localStorage.getItem(`orderAccepted_${table.id}`) === 'true');
  }, [table]);

  const totalPrice = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
  const hasDeliveredItem = cartItems.some((item) => item.delivered);

  useEffect(() => {
    const allItemsDelivered = cartItems.length > 0 && cartItems.every((item) => item.delivered);
    setAllDelivered(allItemsDelivered);
  }, [cartItems]);


    const handleCashPayment = async (orderId) => {
      try {
        const paymentData = {
          orderId,
          method: 'cash',
        };
  
        const response = await createPayment(paymentData);
        console.log(paymentData);
        if (response.success) {
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

  const handleAcceptOrder = async () => {
    try {

      await updateOrder(table.orderId, { status: 'preparing' });
      localStorage.setItem(`orderAccepted_${table.id}`, 'true');
      setIsOrderAccepted(true);
      toast.success('Đã nhận đơn hàng và bắt đầu chuẩn bị!');
      setTimeout(() => {
        window.location.reload(); // Reload trang khi nhận đơn
      }, 2000);
    } catch (err) {
      console.error('Failed to accept order:', err);
      toast.error('Không thể nhận đơn hàng');
    }
  };  
  const handleConfirmOrder = async () => {
    try {
      await handleCashPayment(table.orderId);

      // await updateOrder(table.orderId, { status: 'paid' });
      localStorage.setItem(`orderAccepted_${table.id}`, 'true');
      setIsOrderAccepted(true);
      toast.success('Đã nhận được tiền mặt bắt đầu chuẩn bị!');
      setTimeout(() => {
        window.location.reload(); // Reload trang khi nhận đơn
      }, 2000);
    } catch (err) {
      console.error('Failed to accept order:', err);
      toast.error('Không thể nhận đơn hàng');
    }
  };


  const handleDeliveryChange = async (itemId) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, delivered: !item.delivered } : item
    );
    setCartItems(updatedCartItems);

    // Save to localStorage only
    const item = updatedCartItems.find((i) => i.id === itemId);
    localStorage.setItem(`delivered_${table.id}_${itemId}`, item.delivered.toString());
  };

  const handleConfirmAction = async (action) => {
    try {
      if (action === 'completed') {
        // Cập nhật trạng thái đơn hàng thành completed
        await updateOrder(table.orderId, { status: 'completed' });
        toast.success('Đã hoàn tất đơn hàng!');
      } else if (action === 'canceled') {
        // Cập nhật trạng thái đơn hàng thành canceled
        await updateOrder(table.orderId, { status: 'canceled' });
        toast.success('Đã hủy đơn hàng thành công!');
      }

      // Xóa trạng thái trong localStorage
      localStorage.removeItem(`orderAccepted_${table.id}`);
      cartItems.forEach((item) => localStorage.removeItem(`delivered_${table.id}_${item.id}`));

      // Reload trang sau khi thực hiện hành động
      setTimeout(() => {
        window.location.reload();
      }, 2000);

      setShowConfirm(null);
    } catch (err) {
      console.error(`Failed to ${action} table:`, err);
      toast.error(`Không thể ${action === 'completed' ? 'hoàn tất' : 'hủy'} đơn hàng`);
    }
  };

  if (!table || !table.id || !table.orderId) {
    return null;
  }

  return (
    <div className="table-cart-container">
      <div className="table-cart">
        <h3 className="table-cart-title">Giỏ hàng - {table.name || 'Không xác định'}</h3>
        <div className="table-cart-actions">
          {table.status === 'pending' ? (
            // Trạng thái pending: chỉ có thể hủy đơn
            <>
              <button
                onClick={handleConfirmOrder}
                disabled={cartItems.length === 0}
                className={`${cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Đã thanh toán
              </button>
              <button
                onClick={() => setShowConfirm('canceled')}
                disabled={hasDeliveredItem}
                className={`${hasDeliveredItem ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Hủy đơn
              </button>
            </>
          ) : table.status === 'paid' ? (
            // Trạng thái paid: có thể nhận đơn hoặc hủy đơn
            <>
              <button
                onClick={handleAcceptOrder}
                disabled={cartItems.length === 0}
                className={`${cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Nhận đơn
              </button>
              <button
                onClick={() => setShowConfirm('canceled')}
                disabled={hasDeliveredItem}
                className={`${hasDeliveredItem ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Hủy đơn
              </button>
            </>
          ) : table.status === 'preparing' && isOrderAccepted ? (
            // Trạng thái preparing: chỉ hiển thị nút hoàn tất
            <button
              onClick={() => setShowConfirm('completed')}
              disabled={!allDelivered || cartItems.length === 0}
              className={`${!allDelivered || cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Hoàn tất
            </button>
          ) : null}
        </div>
        {allDelivered && cartItems.length > 0 && (
          <p className="delivery-success-message">Đã giao thành công toàn bộ món!</p>
        )}

        {showConfirm && (
          <div className="confirm-overlay">
            <div className="confirm-modal">
              <p>
                Bạn có chắc chắn muốn {showConfirm === 'completed' ? 'hoàn tất' : 'hủy'} đơn hàng của{' '}
                <strong>{table.name}</strong> không?
              </p>
              <div className="confirm-buttons">
                <button
                  onClick={() => handleConfirmAction(showConfirm)}
                  className="confirm-yes"
                >
                  Có
                </button>
                <button onClick={() => setShowConfirm(null)} className="confirm-no">
                  Không
                </button>
              </div>
            </div>
          </div>
        )}

        <ul className="table-cart-items">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <li key={item.id} className="table-cart-item">
                <input
                  type="checkbox"
                  checked={item.delivered}
                  onChange={() => handleDeliveryChange(item.id)}
                  className="delivery-checkbox"
                  disabled={table.status !== 'preparing' || !isOrderAccepted}
                />
                <img
                  src={item.image || '/images/default-drink.jpg'}
                  alt={item.name}
                  className="table-cart-item-image"
                  onError={(e) => (e.target.src = '/images/default-drink.jpg')}
                />
                <div className="table-cart-item-details">
                  <span className={`table-cart-item-name ${item.delivered ? 'line-through' : ''}`}>
                    {item.name}
                  </span>
                  <span className="table-cart-item-price">
                    {item.price.toLocaleString()} VND
                  </span>
                </div>
                <div className="table-cart-item-quantity">
                  <span>SL: {item.quantity}</span>
                </div>
              </li>
            ))
          ) : (
            <p>Giỏ hàng trống</p>
          )}
        </ul>
        <div className="table-cart-total">
          <strong>Tổng cộng:</strong>
          <span>{totalPrice.toLocaleString()} VND</span>
        </div>
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

export default TableCart;