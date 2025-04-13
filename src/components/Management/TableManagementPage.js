import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTables, updateTable, createOrder } from '../../api/api';
import { getToken } from '../../api/auth';
import TableList from './TableList';
import TableCart from './TableCart';


const TableManagementPage = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const tablesData = await getTables();
        if (!Array.isArray(tablesData)) {
          throw new Error('Invalid data format: Expected an array of tables');
        }
        // Lọc các phần tử không hợp lệ và định dạng dữ liệu
        const formattedTables = tablesData
          .filter((table) => table && typeof table === 'object' && table.id) // Chỉ giữ các table hợp lệ
          .map((table) => ({
            id: table.id,
            name: table.name || `Bàn ${table.id}`,
            status: table.status || 'Trống',
            total: table.total || 0,
            cartItems: (table.cartItems || []).map((item) => ({
              ...item,
              delivered: item.delivered || false,
            })),
          }));
        setTables(formattedTables);
      } catch (err) {
        setError('Failed to load tables: ' + (err.message || 'Unknown error'));
      }
    };
    fetchTables();
  }, []);

  const handleSelectTable = (table) => {
    setSelectedTable(table);
  };

  const handleTableStatus = async (tableId, newStatus) => {
    try {
      if (newStatus === 'Đã thanh toán') {
        const table = tables.find((t) => t.id === tableId);
        if (table && table.cartItems && table.cartItems.length > 0) {
          const orderData = {
            tableId: table.id,
            items: table.cartItems.map((item) => ({
              drinkId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
            total: table.total,
            status: 'Unpaid',
          };
          await createOrder(orderData);
        }
      }

      const updatedStatus = newStatus === 'Nhận khách mới' ? 'Trống' : newStatus;

      await updateTable(tableId, {
        status: updatedStatus,
        cartItems: newStatus === 'Đã thanh toán' || newStatus === 'Nhận khách mới' ? [] : undefined,
        total: newStatus === 'Đã thanh toán' || newStatus === 'Nhận khách mới' ? 0 : undefined,
      });

      setTables((prevTables) =>
        prevTables.map((table) =>
          table.id === tableId
            ? {
                ...table,
                status: updatedStatus,
                cartItems:
                  newStatus === 'Đã thanh toán' || newStatus === 'Nhận khách mới'
                    ? []
                    : table.cartItems,
                total: newStatus === 'Đã thanh toán' || newStatus === 'Nhận khách mới' ? 0 : table.total,
              }
            : table
        )
      );

      if (newStatus === 'Đã thanh toán' || newStatus === 'Nhận khách mới') {
        setSelectedTable(null);
      }
    } catch (err) {
      setError('Failed to update table status: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="table-management-page-container">
      <div className="table-management-content">
        <h2>Danh sách bàn</h2>
        {error && <p className="error-message">{error}</p>}
        <TableList tables={tables} onSelectTable={handleSelectTable} />
      </div>
      {selectedTable && (
        <TableCart table={selectedTable} handleTableStatus={handleTableStatus} />
      )}
    </div>
  );
};

export default TableManagementPage;