import React, { useState, useEffect } from 'react';
import { updateTable } from '../../api/api';


const TableCart = ({ table, handleTableStatus }) => {
  // Kiểm tra table và table.cartItems
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

  const totalPrice = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

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

  if (!table || !table.id) {
    return null;
  }

  return (
    <div className="table-cart-container">
      <div className="table-cart">
        <h3 className="table-cart-title">Giỏ hàng - {table.name || 'Không xác định'}</h3>
        <div className="table-cart-actions">
          <button
            onClick={() => handleTableStatus(table.id, 'Đã thanh toán')}
            disabled={cartItems.length === 0}
            className={cartItems.length === 0 ? 'disabled-button' : ''}
          >
            Thanh toán
          </button>
          <button onClick={() => handleTableStatus(table.id, 'Chuyển bàn')}>
            Chuyển bàn
          </button>
          <button onClick={() => handleTableStatus(table.id, 'Nhận khách mới')}>
            Nhận khách mới
          </button>
        </div>
        {allDelivered && cartItems.length > 0 && (
          <p className="delivery-success-message">Đã giao thành công toàn bộ món!</p>
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
                    className={`table-cart-item-name ${item.delivered ? 'delivered' : ''}`}
                  >
                    {item.name}
                  </span>
                  <span className="table-cart-item-price">
                    {item.price.toLocaleString()} VND
                  </span>
                </div>
                <div className="table-cart-item-quantity">
                  <span>Số lượng: {item.quantity}</span>
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