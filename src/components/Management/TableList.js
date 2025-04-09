import React from 'react';

const TableList = ({ tables, onSelectTable }) => {
  return (
    <div className="table-list-container">
      <div className="table-grid">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`table-item ${table.status === 'Trống' ? 'table-empty' : 'table-occupied'}`}
            onClick={() => onSelectTable(table)}
          >
            <h3>{table.name}</h3>
            <p>Trạng thái: {table.status}</p>
            <p>Tổng tiền: {table.total.toLocaleString()} VND</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableList;