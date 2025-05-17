import React from 'react';

const TableList = ({ tables, onSelectTable }) => {
  if (!Array.isArray(tables)) {
    return <p>Không có dữ liệu bàn để hiển thị.</p>;
  }

  return (
    <div className="table-list-container">
      <div className="table-grid">
        {tables.map((table) => {
          if (!table || !table.id) {
            return null;
          }
          return (
            <div
              key={table.id}
              className={`table-item ${table.status === 'pending' ? 'bg-green-100' : 'bg-gray-100'}`}
              onClick={() => onSelectTable(table)}
            >
              <h3>{table.name || 'Không xác định'}</h3>
              <p>Trạng thái: {table.status || 'Không xác định'}</p>
              <p>Tổng tiền: {(table.total || 0).toLocaleString()} VND</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TableList;