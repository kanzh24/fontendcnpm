import React, { useState } from 'react';
// import '../styles/Order.css';

const OrderHistory = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const sampleOrders = [
    {
      id: 20235,
      status: 'Paid',
      table: 12,
      guests: 2,
      amount: 150,
      items: [
        { id: 1, name: 'Pizza Margherita', price: 150000, quantity: 2, image: null },
        { id: 2, name: 'Cà phê sữa đá', price: 30000, quantity: 1, image: null },
      ],
    },
    {
      id: 20236,
      status: 'Unpaid',
      table: 14,
      guests: 4,
      amount: 230,
      items: [
        { id: 3, name: 'Trà sữa trân châu', price: 45000, quantity: 3, image: null },
        { id: 4, name: 'Bánh mì pate', price: 25000, quantity: 1, image: null },
      ],
    },
    {
      id: 20237,
      status: 'Paid',
      table: 16,
      guests: 6,
      amount: 450,
      items: [
        { id: 5, name: 'Nước cam ép', price: 35000, quantity: 2, image: null },
        { id: 6, name: 'Phở bò', price: 60000, quantity: 1, image: null },
      ],
    },
    {
      id: 20238,
      status: 'Unpaid',
      table: 18,
      guests: 3,
      amount: 190,
      items: [
        { id: 7, name: 'Coca Cola', price: 20000, quantity: 2, image: null },
        { id: 8, name: 'Bánh ngọt', price: 30000, quantity: 1, image: null },
      ],
    },
  ];

  const fallbackImage = require(`../../assets/images/image01.jpg`);

  const selectOrder = (order) => {
    setSelectedOrder(order);
    const items = document.querySelectorAll('.order-item');
    items.forEach((item) => item.classList.remove('active'));
    document.querySelector(`[data-order-id="${order.id}"]`).classList.add('active');
  };

  return (
    <div className="order-container">
      <h2>Lịch sử đơn hàng</h2>
      <div className="order-content">
        <div className="order-list">
          {sampleOrders.map((order) => (
            <div
              key={order.id}
              data-order-id={order.id}
              className="order-item"
              onClick={() => selectOrder(order)}
            >
              <div className="top">
                <p className="order-id">Order #{order.id}</p>
                <p className={`status ${order.status.toLowerCase()}`}>Trạng thái: {order.status}</p>
              </div>
              <div className="bot">
                <p>Bàn: {order.table}</p>
                <p>Số khách: {order.guests}</p>
                <p className="amount">Tổng tiền: ${order.amount}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="order-details">
          {selectedOrder ? (
            <>
              <h3>Chi tiết đơn hàng #{selectedOrder.id}</h3>
              <ul className="order-items">
                {selectedOrder.items.map((item) => (
                  <li key={item.id} className="order-item-detail">
                    <img
                      src={item.image || fallbackImage}
                      alt={item.name}
                      className="order-item-image"
                    />
                    <div className="order-item-details">
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-price">{item.price.toLocaleString()} VND</span>
                    </div>
                    <span className="order-item-quantity">{item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="order-total">
                <strong>Tổng cộng:</strong>
                <span>{selectedOrder.amount.toLocaleString()} USD</span>
              </div>
            </>
          ) : (
            <p>Chọn một đơn hàng để xem chi tiết.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;