import React, { useState, useEffect } from 'react';
import { getOrders, updateOrder } from '../../api/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState('');

  const fallbackImage = require(`../../assets/images/image01.jpg`);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getOrders();
        // console.log(ordersData)
        const formattedOrders = ordersData.map((order) => ({
          id: order.id,
          status: order.status || 'Unknown',
          tableId: order.tableId || 'N/A', // Adjust for API response
          guests: order.guests || 'N/A',
          total: order.total || 0,
          items: (order.items || []).map((item) => ({
            id: item.id,
            name: item.name || (item.drinkId ? `Drink #${item.drinkId}` : 'Unknown'),
            price: item.price || 0,
            quantity: item.quantity || 1,
            image: item.image || null,
          })),
        }));
        setOrders(formattedOrders);
      } catch (err) {
        setError('Failed to load orders: ' + err.message);
      }
    };
    fetchOrders();
  }, []);

  const selectOrder = (order) => {
    setSelectedOrder(order);
    const items = document.querySelectorAll('.order-item');
    items.forEach((item) => item.classList.remove('active'));
    document.querySelector(`[data-order-id="${order.id}"]`).classList.add('active');
  };

  const handleConfirm = async () => {
    if (selectedOrder.status === 'Unpaid') {
      try {
        const updatedOrder = await updateOrder(selectedOrder.id, { status: 'Confirmed' });
        const formattedUpdatedOrder = {
          id: updatedOrder.id,
          status: updatedOrder.status || 'Unknown',
          tableId: updatedOrder.tableId || 'N/A',
          guests: updatedOrder.guests || 'N/A',
          total: updatedOrder.total || 0,
          items: (updatedOrder.items || []).map((item) => ({
            id: item.id,
            name: item.name || (item.drinkId ? `Drink #${item.drinkId}` : 'Unknown'),
            price: item.price || 0,
            quantity: item.quantity || 1,
            image: item.image || null,
          })),
        };
        setOrders((prev) =>
          prev.map((order) => (order.id === selectedOrder.id ? formattedUpdatedOrder : order))
        );
        setSelectedOrder(formattedUpdatedOrder);
      } catch (err) {
        setError('Failed to confirm order: ' + err.message);
      }
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      try {
        const updatedOrder = await updateOrder(selectedOrder.id, { status: 'Cancelled' });
        const formattedUpdatedOrder = {
          id: updatedOrder.id,
          status: updatedOrder.status || 'Unknown',
          tableId: updatedOrder.tableId || 'N/A',
          guests: updatedOrder.guests || 'N/A',
          total: updatedOrder.total || 0,
          items: (updatedOrder.items || []).map((item) => ({
            id: item.id,
            name: item.name || (item.drinkId ? `Drink #${item.drinkId}` : 'Unknown'),
            price: item.price || 0,
            quantity: item.quantity || 1,
            image: item.image || null,
          })),
        };
        setOrders((prev) =>
          prev.map((order) => (order.id === selectedOrder.id ? formattedUpdatedOrder : order))
        );
        setSelectedOrder(formattedUpdatedOrder);
      } catch (err) {
        setError('Failed to cancel order: ' + err.message);
      }
    }
  };

  const handleMarkAsPaid = async () => {
    if (selectedOrder.status === 'Unpaid') {
      try {
        const updatedOrder = await updateOrder(selectedOrder.id, { status: 'Paid' });
        const formattedUpdatedOrder = {
          id: updatedOrder.id,
          status: updatedOrder.status || 'Unknown',
          tableId: updatedOrder.tableId || 'N/A',
          guests: updatedOrder.guests || 'N/A',
          total: updatedOrder.total || 0,
          items: (updatedOrder.items || []).map((item) => ({
            id: item.id,
            name: item.name || (item.drinkId ? `Drink #${item.drinkId}` : 'Unknown'),
            price: item.price || 0,
            quantity: item.quantity || 1,
            image: item.image || null,
          })),
        };
        setOrders((prev) =>
          prev.map((order) => (order.id === selectedOrder.id ? formattedUpdatedOrder : order))
        );
        setSelectedOrder(formattedUpdatedOrder);
      } catch (err) {
        setError('Failed to mark order as paid: ' + err.message);
      }
    }
  };

  return (
    <div className="order-container">
      <h2>Lịch sử đơn hàng</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="order-content">
        <div className="order-list">
          {orders.map((order) => (
            <div
              key={order.id}
              data-order-id={order.id}
              className="order-item"
              onClick={() => selectOrder(order)}
            >
              <div className="top">
                <p className="order-id">Order #{order.id}</p>
                <p className={`status ${order.status.toLowerCase()}`}>
                  Trạng thái: {order.status}
                </p>
              </div>
              <div className="bot">
                <p>Bàn: {order.tableId}</p>
                <p>Số khách: {order.guests}</p>
                <p className="amount">Tổng tiền: ${order.total}</p>
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
                      <span className="order-item-price">
                        {item.price.toLocaleString()} VND
                      </span>
                    </div>
                    <span className="order-item-quantity">{item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="order-total">
                <strong>Tổng cộng:</strong>
                <span>{selectedOrder.total.toLocaleString()} USD</span>
              </div>
              <div className="order-actions">
                {selectedOrder.status === 'Unpaid' && (
                  <button className="confirm-button" onClick={handleConfirm}>
                    Xác nhận
                  </button>
                )}
                {selectedOrder.status !== 'Cancelled' && (
                  <button className="cancel-button" onClick={handleCancel}>
                    Hủy
                  </button>
                )}
                {selectedOrder.status === 'Unpaid' && (
                  <button className="paid-button" onClick={handleMarkAsPaid}>
                    Đã thanh toán
                  </button>
                )}
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