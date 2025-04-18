import React, { useState } from 'react';
import { Table, Modal } from 'antd';

const ReceiptList = ({ receipts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Hiển thị modal chi tiết phiếu nhập
  const showModal = (receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedReceipt(null);
  };

  // Cột của bảng phiếu nhập
  const columns = [
    {
      title: 'ID phiếu nhập',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => new Date(createdAt).toLocaleDateString('vi-VN'),
    },
    
  ];

  // Cột của bảng chi tiết nguyên liệu trong modal
  const itemColumns = [
    {
      title: 'ID nguyên liệu',
      dataIndex: 'ingredientId',
      key: 'ingredientId',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Đơn giá (VND)',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
    },
  ];

  return (
    <div>
      <h3>Danh sách phiếu nhập</h3>
      <Table
        columns={columns}
        dataSource={receipts}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => showModal(record),
        })}
        rowClassName="clickable-row"
      />

      {/* Modal hiển thị chi tiết phiếu nhập */}
      <Modal
        title={`Chi tiết phiếu nhập #${selectedReceipt?.id}`}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        {selectedReceipt && (
          <div>
            <p><strong>Nhân viên:</strong> {selectedReceipt.employee?.name || 'N/A'}</p>
            <p><strong>Nhà cung cấp:</strong> {selectedReceipt.supplier?.name || 'N/A'}</p>
            <p><strong>Tổng chi phí:</strong> {parseFloat(selectedReceipt.totalCost).toLocaleString('vi-VN')} VND</p>
            <p><strong>Ngày tạo:</strong> {new Date(selectedReceipt.createdAt).toLocaleString('vi-VN')}</p>
            <h4>Danh sách nguyên liệu</h4>
            <Table
              columns={itemColumns}
              dataSource={selectedReceipt.stockImportItems}
              rowKey="id"
              pagination={false}
            />
          </div>
        )}
      </Modal>

      <style jsx>{`
        .clickable-row {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ReceiptList;