import React from 'react';

const TableCart = ({ table, handleTableStatus }) => {
  const totalPrice = table.cartItems.reduce((total, item) => total + item.quantity * item.price, 0, 0);

  return (
    <div className="table-cart-container">
      <div className="table-cart">
        <h3 className="table-cart-title">Giỏ hàng - {table.name}</h3>
        <div className="table-cart-actions">
          <button onClick={() => handleTableStatus(table.id, 'Đã thanh toán')}>
            Thanh toán
          </button>
          <button onClick={() => handleTableStatus(table.id, 'Chuyển bàn')}>
            Chuyển bàn
          </button>
          <button onClick={() => handleTableStatus(table.id, 'Hủy bàn')}>
            Hủy bàn
          </button>
        </div>
        <ul className="table-cart-items">
          {table.cartItems.length > 0 ? (
            table.cartItems.map((item) => (
              <li key={item.id} className="table-cart-item">
                <img src={item.image} alt={item.name} className="table-cart-item-image" />
                <div className="table-cart-item-details">
                  <span className="table-cart-item-name">{item.name}</span>
                  <span className="table-cart-item-price">{item.price.toLocaleString()} VND</span>
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