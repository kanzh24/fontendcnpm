import React, { useState, useEffect } from 'react';
import { updateTable } from '../../api/api';

const TableCart = ({ table, handleTableStatus }) => {
  const [cartItems, setCartItems] = useState(
    (table && table.cartItems && Array.isArray(table.cartItems)
      ? table.cartItems.map((item) => ({
          ...item,
          delivered: item.delivered || false,
        }))
      : []
    ).filter(Boolean)
  );
  const [allDelivered, setAllDelivered] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null); // 'complete' or 'cancel'
  const [successMessage, setSuccessMessage] = useState('');

  const totalPrice = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
  const hasDeliveredItem = cartItems.some((item) => item.delivered);

  useEffect(() => {
    const allItemsDelivered = cartItems.length > 0 && cartItems.every((item) => item.delivered);
    setAllDelivered(allItemsDelivered);
  }, [cartItems]);

  const handleDeliveryChange = async (itemId) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, delivered: !item.delivered } : item
    );
    setCartItems(updatedCartItems);

    try {
      await updateTable(table.id, { cartItems: updatedCartItems });
    } catch (err) {
      console.error('Failed to update delivered status:', err);
    }
  };

  const handleConfirmAction = async (action) => {
    try {
      await handleTableStatus(table.id, action);
      setSuccessMessage(
        action === 'completed'
          ? 'Đã hoàn tất thanh toán thành công!'
          : 'Đã hủy bàn thành công!'
      );
      setShowConfirm(null);
      setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3s
    } catch (err) {
      console.error(`Failed to ${action} table:`, err);
    }
  };

  if (!table || !table.id) {
    return null;
  }

  return (
    <div className="table-cart-container">
      <div className="table-cart">
        <h3 className="table-cart-title">Giỏ hàng - {table.name || 'Không xác định'}</h3>
        {successMessage && (
          <p className="success-message">
            {successMessage}
          </p>
        )}
        <div className="table-cart-actions">
          <button
            onClick={() => setShowConfirm('completed')}
            disabled={!allDelivered || cartItems.length === 0}
            className={`${
              !allDelivered || cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Hoàn tất
          </button>
          <button
            onClick={() => setShowConfirm('canceled')}
            disabled={hasDeliveredItem}
            className={`${
              hasDeliveredItem ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Hủy bàn
          </button>
        </div>
        {allDelivered && cartItems.length > 0 && (
          <p className="delivery-success-message">
            Đã giao thành công toàn bộ món!
          </p>
        )}
        {showConfirm && (
          <div className="confirmation-dialog">
            <div>
              <p>
                Bạn có chắc muốn{' '}
                {showConfirm === 'completed' ? 'hoàn tất thanh toán' : 'hủy bàn'}?
              </p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowConfirm(null)}
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleConfirmAction(showConfirm)}
                >
                  Xác nhận
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
                />
                <img
                  src={item.image || 'https://via.placeholder.com/50'}
                  alt={item.name}
                  className="table-cart-item-image"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/50')}
                />
                <div className="table-cart-item-details">
                  <span
                    className={`table-cart-item-name ${
                      item.delivered ? 'line-through' : ''
                    }`}
                  >
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
    </div>
  );
};

export default TableCart;