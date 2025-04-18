import React, { useState, useEffect } from 'react';
import { getOrders, getOrderById, updateOrder } from '../../api/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State cho phân trang
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // State cho bộ lọc
  const [filters, setFilters] = useState({
    tableName: '',
    status: '',
    withCanceled: false,
  });

  // State cho sắp xếp
  const [sort, setSort] = useState('createdAt_DESC');

  // Load danh sách đơn hàng
  useEffect(() => {
    fetchOrders();
  }, [pagination.page, pagination.limit, filters, sort]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        tableName: filters.tableName || undefined,
        status: filters.status || undefined,
        withCanceled: filters.withCanceled || undefined,
        sort: sort || undefined,
      };

      const response = await getOrders(params);
      if (!response.items || !Array.isArray(response.items)) {
        throw new Error('Invalid data format: Expected an array of orders');
      }

      const formattedOrders = response.items.map((order) => ({
        id: order.id || 'N/A',
        employeeName: order.employee?.name || 'Unknown',
        tableName: order.table?.name || 'N/A',
        totalAmount: order.payment?.totalAmount || 0,
        paymentMethod: order.payment?.method || 'N/A',
        status: order.status || 'Unknown',
        createdAt: order.createdAt || '',
        orderItems: order.orderItems || [],
      }));

      setOrders(formattedOrders);
      setPagination({
        page: response.page || 1,
        limit: response.limit || 10,
        total: response.total || 0,
        totalPages: response.totalPages || 1,
      });

      // Tự động chọn đơn hàng đầu tiên nếu có
      if (formattedOrders.length > 0 && !selectedOrder) {
        handleViewDetails(formattedOrders[0].id);
      }
    } catch (err) {
      setError('Failed to load orders: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Xem chi tiết đơn hàng
  const handleViewDetails = async (orderId) => {
    try {
      const orderData = await getOrderById(orderId);
      setSelectedOrder(orderData);
    } catch (err) {
      setError('Failed to load order details: ' + (err.message || 'Unknown error'));
    }
  };

  // Xử lý thay đổi trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  // Xử lý thay đổi limit
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 })); // Reset về trang 1 khi thay đổi limit
  };

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset về trang 1 khi thay đổi bộ lọc
  };

  // Xử lý thay đổi sắp xếp
  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset về trang 1 khi thay đổi sắp xếp
  };

  // Xử lý hủy đơn hàng (nếu cần)
  const handleCancelOrder = async () => {
    if (window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      try {
        await updateOrder(selectedOrder.id, { status: 'canceled' });
        setSelectedOrder({ ...selectedOrder, status: 'canceled' });
        setOrders((prev) =>
          prev.map((order) =>
            order.id === selectedOrder.id ? { ...order, status: 'canceled' } : order
          )
        );
      } catch (err) {
        setError('Failed to cancel order: ' + (err.message || 'Unknown error'));
      }
    }
  };

  return (
    <div className="order-history-container">
      <h2>Lịch sử đơn hàng</h2>
      {error && <p className="error-message">{error}</p>}

      {/* Bộ lọc và sắp xếp */}


      <div className="order-history-layout">
        {/* Bên trái: Danh sách đơn hàng */}
        <div className="order-list">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className={`order-card ${selectedOrder?.id === order.id ? 'selected' : ''}`}
                onClick={() => handleViewDetails(order.id)}
              >
                <p><strong>Order #{order.id}</strong></p>
                <p><strong>Bàn:</strong> {order.tableName}</p>
                <p><strong>Nhân viên:</strong> {order.employeeName}</p>
                <p><strong>Ngày:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Trạng thái:</strong> {order.status}</p>
              </div>
            ))
          ) : (
            <p>Không có đơn hàng nào.</p>
          )}

          {/* Phân trang */}
          {orders.length > 0 && (
            <div className="pagination-section">
              <div className="pagination-info">
                Trang {pagination.page} / {pagination.totalPages} (Tổng: {pagination.total} đơn hàng)
              </div>
              <div className="pagination-controls">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Trang trước
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Trang sau
                </button>
                <select value={pagination.limit} onChange={handleLimitChange}>
                  <option value="5">5 / trang</option>
                  <option value="10">10 / trang</option>
                  <option value="20">20 / trang</option>
                  <option value="50">50 / trang</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Bên phải: Chi tiết đơn hàng */}
        <div className="order-details-panel">
          {selectedOrder ? (
            <>
              <h3>Chi tiết đơn hàng #{selectedOrder.id}</h3>
              <div className="order-details">
                <p><strong>Tổng cộng:</strong> {parseFloat(selectedOrder.payment?.totalAmount || 0).toLocaleString()} VND</p>

                <p><strong>Nhân viên:</strong> {selectedOrder.employee?.name || 'N/A'}</p>
                <p><strong>Bàn:</strong> {selectedOrder.table?.name || 'N/A'}</p>
                <p><strong>Số khách:</strong> N/A</p>
                <p><strong>Phương thức thanh toán:</strong> {selectedOrder.payment?.method || 'N/A'}</p>
                <p><strong>Giao dịch ID:</strong> {selectedOrder.payment?.transactionId || 'N/A'}</p>
                <p><strong>Trạng thái:</strong> {selectedOrder.status || 'N/A'}</p>
                <p><strong>Ngày tạo:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p><strong>Ngày cập nhật:</strong> {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                <h4>Các món trong đơn hàng:</h4>
                {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                  <ul>
                    {selectedOrder.orderItems.map((item, index) => (
                      <li key={index}>
                        {item.name || 'N/A'} - Số lượng: {item.quantity || 0} - Giá: {(item.price || 0).toLocaleString()} VND
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Không có món nào trong đơn hàng.</p>
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