import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTables,
  updateTable,
  createOrder,
  getTableOrders,
} from "../../api/api";
import { getToken } from "../../api/auth";
import TableList from "./TableList";
import TableCart from "./TableCart";

const TableManagementPage = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTablesAndOrders = async () => {
      try {
        const tablesData = await getTables();
        if (!Array.isArray(tablesData)) {
          throw new Error("Invalid data format: Expected an array of tables");
        }
        console.log(tablesData);
        const formattedTables = await Promise.all(
          tablesData
            .filter(table => table && typeof table === "object" && table.id)
            .map(async table => {
              let cartItems = [];
              let status = "none";
              let orderId = null;

              try {
                const ordersData = await getTableOrders(table.id);
                const latestOrder = ordersData.items[0];

                if (
                  latestOrder &&
                  (latestOrder.status === "pending" ||
                    latestOrder.status === "paid" ||
                    latestOrder.status === "preparing")
                ) {
                  orderId = latestOrder.id;
                  console.log(latestOrder);
                  cartItems = latestOrder.orderItems.map(item => ({
                    id: item.drinkId,
                    name: item.drink?.name || "Không tên",
                    image: item.drink?.image_url || "",
                    price: parseFloat(item.priceAtOrder),
                    quantity: parseInt(item.quantity),
                    delivered: item.delivered || false,
                  }));

                  status = latestOrder.status;
                }
              } catch (err) {
                console.error(
                  `Failed to fetch orders for table ${table.id}:`,
                  err.response.data.message
                );
              }

              return {
                id: table.id,
                name: table.name || `Bàn ${table.id}`,
                status,
                total: cartItems.reduce(
                  (sum, item) => sum + item.quantity * item.price,
                  0
                ),
                cartItems,
                orderId, // 👈 thêm orderId vào đây
              };
            })
        );

        const sortedTables = formattedTables.sort((a, b) => {
          const getNumber = name => {
            const match = name.match(/\d+$/);
            return match ? parseInt(match[0], 10) : 0;
          };
          return getNumber(a.name) - getNumber(b.name);
        });

        setTables(sortedTables);
      } catch (err) {
        setError(err.response.data.message);
      }
    };

    fetchTablesAndOrders();
  }, []);

  const handleSelectTable = table => {
    setSelectedTable(table);
  };

  const handleTableStatus = async (tableId, newStatus) => {
    try {
      const table = tables.find(t => t.id === tableId);
      if (!table) return;

      if (newStatus === "completed") {
        if (table.cartItems && table.cartItems.length > 0) {
          const orderData = {
            tableId: table.id,
            items: table.cartItems.map(item => ({
              drinkId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
            total: table.total,
            status: "completed",
          };
          // await createOrder(orderData);
        }
      }

      // Update table status and clear cart if completed or canceled
      const updatedStatus = newStatus;
      await updateTable(tableId, {
        status: updatedStatus,
        cartItems:
          newStatus === "completed" || newStatus === "canceled"
            ? []
            : table.cartItems,
        total:
          newStatus === "completed" || newStatus === "canceled"
            ? 0
            : table.total,
      });

      setTables(prevTables =>
        prevTables.map(t =>
          t.id === tableId
            ? {
                ...t,
                status: updatedStatus,
                cartItems:
                  newStatus === "completed" || newStatus === "canceled"
                    ? []
                    : t.cartItems,
                total:
                  newStatus === "completed" || newStatus === "canceled"
                    ? 0
                    : t.total,
              }
            : t
        )
      );

      if (newStatus === "completed" || newStatus === "canceled") {
        setSelectedTable(null);
      }
    } catch (err) {
      setError(err.response.data.message);
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
        <TableCart
          table={selectedTable}
          handleTableStatus={handleTableStatus}
        />
      )}
    </div>
  );
};

export default TableManagementPage;
