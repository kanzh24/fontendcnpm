import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTables, updateTable, createOrder, getTableOrders } from '../../api/api';
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
    const fetchTablesAndOrders = async () => {
      try {
        const tablesData = await getTables();
        if (!Array.isArray(tablesData)) {
          throw new Error('Invalid data format: Expected an array of tables');
        }

        // Fetch latest pending order for each table
        const formattedTables = await Promise.all(
          tablesData
            .filter((table) => table && typeof table === 'object' && table.id)
            .map(async (table) => {
              let cartItems = [];
              let status = 'none'; // Default to pending
              try {
                const ordersData = await getTableOrders(table.id);
                const latestOrder = ordersData.items[0]; // Latest pending order
                if (latestOrder && latestOrder.status === 'pending') {
                  console.log(latestOrder)
                  cartItems = latestOrder.orderItems.map((item) => ({
                    id: item.drinkId,
                    name: item.drink.name,
                    image: item.drink.image_url,
                    price: parseFloat(item.priceAtOrder),
                    quantity: parseInt(item.quantity),
                    delivered: item.delivered || false,
                  }));
                }
              } catch (err) {
                console.error(`Failed to fetch orders for table ${table.id}:`, err);
              }

              return {
                id: table.id,
                name: table.name || `Bàn ${table.id}`,
                status: cartItems.length > 0 ? 'pending' : status,
                total: cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
                cartItems,
              };
            })
        );

        // Natural sort tables by name (e.g., Bàn 1, Bàn 2, ..., Bàn 10, Bàn 11)
        const sortedTables = formattedTables.sort((a, b) => {
          // Extract the numerical part from the table name (e.g., "1" from "Bàn 1")
          const getNumber = (name) => {
            const match = name.match(/\d+$/); // Match digits at the end of the string
            return match ? parseInt(match[0], 10) : 0;
          };

          const numA = getNumber(a.name);
          const numB = getNumber(b.name);

          // Compare the numerical parts
          return numA - numB;
        });

        setTables(sortedTables);
      } catch (err) {
        setError('Failed to load tables: ' + (err.message || 'Unknown error'));
      }
    };
    fetchTablesAndOrders();
  }, []);

  const handleSelectTable = (table) => {
    setSelectedTable(table);
  };

  const handleTableStatus = async (tableId, newStatus) => {
    try {
      const table = tables.find((t) => t.id === tableId);
      if (!table) return;

      if (newStatus === 'completed') {
        if (table.cartItems && table.cartItems.length > 0) {
          const orderData = {
            tableId: table.id,
            items: table.cartItems.map((item) => ({
              drinkId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
            total: table.total,
            status: 'completed',
          };
          await createOrder(orderData);
        }
      }

      // Update table status and clear cart if completed or canceled
      const updatedStatus = newStatus;
      await updateTable(tableId, {
        status: updatedStatus,
        cartItems: newStatus === 'completed' || newStatus === 'canceled' ? [] : table.cartItems,
        total: newStatus === 'completed' || newStatus === 'canceled' ? 0 : table.total,
      });

      setTables((prevTables) =>
        prevTables.map((t) =>
          t.id === tableId
            ? {
                ...t,
                status: updatedStatus,
                cartItems: newStatus === 'completed' || newStatus === 'canceled' ? [] : t.cartItems,
                total: newStatus === 'completed' || newStatus === 'canceled' ? 0 : t.total,
              }
            : t
        )
      );

      if (newStatus === 'completed' || newStatus === 'canceled') {
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