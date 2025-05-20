import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTableById } from '../../api/api';
import { toast, ToastContainer } from 'react-toastify';

const Header = ({ isOpen, setIsOpen }) => {
  const { tableId } = useParams();
  const [table, setTable] = useState(null);

  useEffect(() => {
    const fetchTable = async () => {
      if (tableId) {
        try {
          const tableData = await getTableById(tableId);
          console.log(tableData);
          setTable(tableData);
        } catch (error) {
          console.error('Error fetching table:', error);
          toast.error('Không tìm thấy thông tin bàn. Vui lòng quét mã QR trước.');
        }
      }
    };
    fetchTable();
  }, [tableId]);

  return (
    <header className="header">
      {/* Logo */}
      <div className="header-logo">
        <h1>Coffe POS</h1>
      </div>

      {/* Table Info */}
      <div className="header-table">
        {table ? (
          <span>{table.name || table.id || 'N/A'}</span>
        ) : (
          <span>Loading...</span>
        )}
      </div>

      {/* Nút đóng/mở giỏ hàng */}
      <button className="cart-toggle-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Ẩn giỏ hàng' : 'Hiện giỏ hàng'}
      </button>

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
    </header>
  );
};

export default Header;