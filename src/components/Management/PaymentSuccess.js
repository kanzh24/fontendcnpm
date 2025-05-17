import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPaymentByOrderId, getOrderById, updateOrder } from '../../api'; // Điều chỉnh đường dẫn import nếu cần

const PaymentSuccess = () => {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy orderId từ query params
  const orderId = searchParams.get('orderId');

  // Lấy thông tin thanh toán, chi tiết đơn hàng và cập nhật trạng thái
  useEffect(() => {
    const fetchPaymentAndOrderInfo = async () => {
      if (!orderId) {
        setError('Không tìm thấy thông tin đơn hàng');
        return;
      }

      try {
        // Lấy thông tin thanh toán
        const paymentData = await getPaymentByOrderId(orderId);
        setPaymentInfo(paymentData);

        // Lấy chi tiết đơn hàng
        const orderData = await getOrderById(orderId);
        setOrderDetails(orderData);

        // Cập nhật trạng thái đơn hàng thành "paid" nếu chưa phải
        if (orderData.status !== 'paid') {
          await updateOrder(orderId, { status: 'paid' });
          setOrderDetails((prev) => ({ ...prev, status: 'paid' })); // Cập nhật UI ngay lập tức
        }
        // if (orderData.status !== 'preparing') {
        //   await updateOrder(orderId, { status: 'preparing' });
        //   setOrderDetails((prev) => ({ ...prev, status: 'preparing' })); // Cập nhật UI ngay lập tức
        // }

        // // Chuyển hướng về trang chủ sau 5 giây
        // setTimeout(() => {
        //   navigate('/');
        // }, 5000);
      } catch (err) {
        console.error('Lỗi khi lấy thông tin hoặc cập nhật đơn hàng:', err);
        setError('Đã xảy ra lỗi khi xử lý thông tin thanh toán hoặc đơn hàng');
      }
    };

    fetchPaymentAndOrderInfo();
  }, [orderId, navigate]);

  // CSS inline với tông màu cam-đen-trắng
  const styles = {
    container: {
      textAlign: 'center',
      padding: '50px',
      backgroundColor: '#ffffff',
      color: '#1a1a1a',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
    },
    heading: {
      color: '#f28c38',
      fontSize: '2.5rem',
      marginBottom: '20px',
    },
    subHeading: {
      color: '#1a1a1a',
      fontSize: '1.8rem',
      marginTop: '30px',
      marginBottom: '15px',
    },
    text: {
      fontSize: '1.2rem',
      margin: '10px 0',
      color: '#1a1a1a',
    },
    strong: {
      color: '#f28c38',
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: '20px 0',
    },
    listItem: {
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      padding: '15px',
      margin: '10px auto',
      borderRadius: '8px',
      maxWidth: '600px',
      transition: 'background-color 0.3s ease',
    },
    listItemHover: {
      backgroundColor: '#f28c38',
      color: '#1a1a1a',
    },
    listItemSpan: {
      fontSize: '1.1rem',
    },
  };

  return (
    <div style={styles.container}>
      {error ? (
        <div>
          <h2 style={styles.heading}>Lỗi</h2>
          <p style={styles.text}>{error}</p>
        </div>
      ) : paymentInfo && orderDetails ? (
        <div>
          <h2 style={styles.heading}>Thanh toán thành công!</h2>
          <p style={styles.text}>Cảm ơn bạn đã đặt hàng.</p>
          <p style={styles.text}>
            <strong style={styles.strong}>Mã đơn hàng:</strong> {paymentInfo.orderId}
          </p>
          <p style={styles.text}>
            <strong style={styles.strong}>Tổng tiền:</strong> {paymentInfo.totalAmount.toLocaleString()} VND
          </p>
          <p style={styles.text}>
            <strong style={styles.strong}>Phương thức:</strong>{' '}
            {paymentInfo.method === 'vnpay' ? 'VNPay' : 'Tiền mặt'}
          </p>
          <p style={styles.text}>
            <strong style={styles.strong}>Trạng thái thanh toán:</strong> {paymentInfo.status}
          </p>
          <p style={styles.text}>
            <strong style={styles.strong}>Trạng thái đơn hàng:</strong> {orderDetails.status}
          </p>

          <h3 style={styles.subHeading}>Chi tiết đơn hàng</h3>
          <ul style={styles.list}>
            {orderDetails.orderItems.map((item, index) => (
              <li
                key={index}
                style={styles.listItem}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.listItemHover.backgroundColor)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.listItem.backgroundColor)}
              >
                <span style={styles.listItemSpan}>
                  {item.drink.name} - Số lượng: {item.quantity} - Giá: {(item.drink.price || 0).toLocaleString()} VND
                </span>
              </li>
            ))}
          </ul>

          <p style={styles.text}>Quét mã tiếp tục để order...</p>
        </div>
      ) : (
        <p style={styles.text}>Đang tải thông tin thanh toán và đơn hàng...</p>
      )}
    </div>
  );
};

export default PaymentSuccess;