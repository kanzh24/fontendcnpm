import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTableById } from '../../api/api'; // Import API function
import { toast, ToastContainer } from 'react-toastify';

const Header = () => {
  const { tableId } = useParams(); // Lấy tableId từ URL params
  const [table, setTable] = useState(null); // State to store table data

  // Fetch table data on component mount or when tableId changes
  useEffect(() => {
    const fetchTable = async () => {
      if (tableId) {
        try {
          const tableData = await getTableById(tableId); // Call API to get table info
          console.log(tableData)
          setTable(tableData); // Update state with fetched data
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
        {/* <img src="/logo.png" alt="Logo" /> */}
        <h1>Coffe POS</h1>
      </div>

      {/* Table Info */}
      <div className="header-table">
        {table ? (
          <span>{table.name || table.id || 'N/A'}</span> // Adjust based on API response structure
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </header>
  );
};

export default Header;