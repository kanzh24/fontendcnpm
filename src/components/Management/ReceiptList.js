import React from 'react';

const ReceiptList = ({ receipts }) => {
  return (
    <div className="receipt-list-container">
      <h3>Danh sách phiếu nhập</h3>
      {receipts.length > 0 ? (
        <div className="receipt-grid">
          {receipts.map((receipt) => (
            <div key={receipt.id} className="receipt-item">
              <h4>Phiếu nhập #{receipt.id} - {receipt.date}</h4>
              <ul>
                {receipt.items.map((item, index) => (
                  <li key={index}>
                    {item.name}: {item.quantity} {item.unit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>Chưa có phiếu nhập nào.</p>
      )}
    </div>
  );
};

export default ReceiptList;