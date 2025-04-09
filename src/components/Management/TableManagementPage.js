import React, { useState } from 'react';
import TableList from './TableList';
import TableCart from './TableCart';

const TableManagementPage = () => {
  const [selectedTable, setSelectedTable] = useState(null); // Quản lý bàn được chọn
  const [tables, setTables] = useState([
    { id: 1, name: 'Bàn 1', status: 'Đang sử dụng', total: 330000, cartItems: [
      { id: 1, name: 'Pizza Margherita', price: 150000, quantity: 2, image: require(`../../assets/images/image01.jpg`) },
      { id: 2, name: 'Cà phê sữa đá', price: 30000, quantity: 1, image: require(`../../assets/images/image02.jpg`) },
    ]},
    { id: 2, name: 'Bàn 2', status: 'Trống', total: 0, cartItems: [] },
    { id: 3, name: 'Bàn 3', status: 'Đã thanh toán', total: 200000, cartItems: [] },
    { id: 4, name: 'Bàn 4', status: 'Đang sử dụng', total: 45000, cartItems: [
      { id: 5, name: 'Trà sữa trân châu', price: 45000, quantity: 1, image: require(`../../assets/images/image05.jpg`) },
    ]},
  ]);

  // Hàm chọn bàn
  const handleSelectTable = (table) => {
    setSelectedTable(table);
  };

  // Hàm xử lý trạng thái bàn
  const handleTableStatus = (tableId, newStatus) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, status: newStatus, cartItems: newStatus === 'Đã thanh toán' ? [] : table.cartItems, total: newStatus === 'Đã thanh toán' ? 0 : table.total } : table
      )
    );
    if (newStatus === 'Đã thanh toán' || newStatus === 'Hủy bàn') {
      setSelectedTable(null); // Xóa bàn được chọn nếu thanh toán hoặc hủy
    }
  };

  return (
    <div className="table-management-page-container">
      <div className="table-management-content">
        <h2>Danh sách bàn</h2>
        <TableList tables={tables} onSelectTable={handleSelectTable} />
      </div>
      {selectedTable && (
        <TableCart
          table={selectedTable}
          handleTableStatus={handleTableStatus}
        />
      )}
    </div>
  );
};

export default TableManagementPage;