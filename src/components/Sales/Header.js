import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTableById } from '../../api/api';
import { toast } from 'react-toastify'; // Giữ import toast để gọi toast.error

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
      <div className="header-logo">
        <h1>Coffe POS</h1>
      </div>
      <div className="header-table">
        {table ? (
          <span>{table.name || table.id || 'N/A'}</span>
        ) : (
          <span>Loading...</span>
        )}
      </div>
      <button className="cart-toggle-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Ẩn giỏ hàng' : 'Hiện giỏ hàng'}
      </button>
    </header>
  );
};

export default Header;