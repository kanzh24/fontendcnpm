import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPaymentByOrderId } from '../../api/api';

const PaymentCanceled = () => {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const message = searchParams.get('message') || 'Thanh toán đã bị hủy';
    if (orderId) {
      getPaymentByOrderId(orderId)
        .then((payment) => {
          setPaymentInfo(payment);
          if (payment.status !== 'canceled') {
            setError('Thông tin thanh toán không khớp với trạng thái bị hủy');
          }
        })
        .catch((err) => {
          console.error('Error fetching payment:', err);
          setError('Không thể lấy thông tin thanh toán: ' + message);
        });
    } else {
      setError('Không tìm thấy orderId trong URL: ' + message);
    }
  }, [searchParams]);

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
    title: {
      color: '#f28c38',
      fontSize: '2.5rem',
      marginBottom: '20px',
    },
    message: {
      fontSize: '1.2rem',
      margin: '10px 0',
      color: '#1a1a1a',
    },
    details: {
      margin: '20px 0',
    },
    detailText: {
      fontSize: '1.1rem',
      margin: '10px 0',
      color: '#1a1a1a',
    },
    strong: {
      color: '#f28c38',
    },
    actions: {
      marginTop: '30px',
    },
    link: {
      display: 'inline-block',
      padding: '10px 20px',
      margin: '0 10px',
      textDecoration: 'none',
      borderRadius: '5px',
      fontSize: '1.1rem',
      transition: 'background-color 0.3s ease',
    },
    backLink: {
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
    },
    backLinkHover: {
      backgroundColor: '#f28c38',
      color: '#1a1a1a',
    },
    retryLink: {
      backgroundColor: '#f28c38',
      color: '#1a1a1a',
    },
    retryLinkHover: {
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Thanh toán đã bị hủy</h2>
      <p style={styles.message}>{error}</p>
      {paymentInfo && (
        <div style={styles.details}>
          <p style={styles.detailText}>
            <strong style={styles.strong}>Mã đơn hàng:</strong> {paymentInfo.orderId}
          </p>
          <p style={styles.detailText}>
            <strong style={styles.strong}>Tổng tiền:</strong> {paymentInfo.totalAmount.toLocaleString()} VND
          </p>
          <p style={styles.detailText}>
            <strong style={styles.strong}>Phương thức:</strong>{' '}
            {paymentInfo.method === 'cash' ? 'Tiền mặt' : 'VNPay'}
          </p>
          <p style={styles.detailText}>
            <strong style={styles.strong}>Trạng thái:</strong>{' '}
            {paymentInfo.status === 'canceled' ? 'Đã hủy' : paymentInfo.status}
          </p>
          <p style={styles.detailText}>
            <strong style={styles.strong}>Thời gian:</strong>{' '}
            {new Date(paymentInfo.updatedAt).toLocaleString()}
          </p>
        </div>
      )}
      <div style={styles.actions}>
        <a
          href="/"
          style={styles.link}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.backLinkHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.backLink)}
        >
          Quay lại trang chủ
        </a>
        <a
          href="/cart"
          style={{ ...styles.link, ...styles.retryLink }}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.retryLinkHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.retryLink)}
        >
          Thử lại thanh toán
        </a>
      </div>
    </div>
  );
};

export default PaymentCanceled;