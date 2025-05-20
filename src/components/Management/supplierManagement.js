import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  restoreSupplier,
  deletedSuppliersList, // API mới để lấy danh sách đã xóa
} from '../../api/api';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]); // Danh sách nhà cung cấp active
  const [deletedSuppliers, setDeletedSuppliers] = useState([]); // Danh sách nhà cung cấp đã xóa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [showDeleted, setShowDeleted] = useState(false); // Chuyển đổi giữa active và deleted
  const [loading, setLoading] = useState(false);

  // Lấy danh sách nhà cung cấp khi component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const activeData= await getSuppliers()
      const deletedData = await deletedSuppliersList()
      setSuppliers(activeData); // Chỉ lấy active
      setDeletedSuppliers(deletedData); // Lấy danh sách đã xóa từ API
      console.log('Active suppliers:', activeData);
      console.log('Deleted suppliers:', deletedData);
    } catch (error) {
      toast.error('Không thể tải danh sách nhà cung cấp!');
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mở modal để thêm nhà cung cấp
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: '', email: '', phone: '', address: '' });
    setIsModalOpen(true);
  };

  // Mở modal để sửa nhà cung cấp
  const openEditModal = async (id) => {
    try {
      const supplier = await getSupplierById(id);
      setCurrentSupplier(supplier);
      setFormData({
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
      });
      setIsEditMode(true);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Không thể tải thông tin nhà cung cấp!');
      console.error('Error fetching supplier:', error);
    }
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSupplier(null);
  };

  // Xử lý thay đổi input trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý thêm hoặc sửa nhà cung cấp
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {
        await updateSupplier(currentSupplier.id, formData);
        toast.success('Cập nhật nhà cung cấp thành công!');
      } else {
        await createSupplier(formData);
        toast.success('Thêm nhà cung cấp thành công!');
      }
      fetchSuppliers(); // Cập nhật cả active và deleted
      closeModal();
    } catch (error) {
      toast.error(isEditMode ? 'Cập nhật thất bại!' : 'Thêm thất bại!');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xóa (mềm) nhà cung cấp
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhà cung cấp này?')) {
      setLoading(true);
      try {
        await deleteSupplier(id);
        toast.success('Xóa nhà cung cấp thành công!');
        fetchSuppliers();
      } catch (error) {
        toast.error('Xóa thất bại!');
        console.error('Error deleting supplier:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Khôi phục nhà cung cấp
  const handleRestore = async (id) => {
    setLoading(true);
    try {
      await restoreSupplier(id);
      toast.success('Khôi phục nhà cung cấp thành công!');
      fetchSuppliers();
    } catch (error) {
      toast.error('Khôi phục thất bại!');
      console.error('Error restoring supplier:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="supplier-management">
      <h2>Quản lý nhà cung cấp</h2>

      {/* Nút chuyển đổi danh sách và thêm nhà cung cấp */}
      <div className="supplier-actions">
        <button onClick={() => setShowDeleted(!showDeleted)}>
          {showDeleted ? 'Hiện danh sách active' : 'Hiện danh sách đã xóa'}
        </button>
        {!showDeleted && (
          <button onClick={openAddModal}>Thêm nhà cung cấp</button>
        )}
      </div>

      {/* Danh sách nhà cung cấp */}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          {showDeleted ? (
            <div className="deleted-suppliers">
              <h3>Danh sách nhà cung cấp đã xóa</h3>
              {deletedSuppliers.length === 0 ? (
                <p>Không có nhà cung cấp nào đã xóa.</p>
              ) : (
                <table className="supplier-table">
                  <thead>
                    <tr>
                      <th>Tên</th>
                      <th>Email</th>
                      <th>Số điện thoại</th>
                      <th>Địa chỉ</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deletedSuppliers.map((supplier) => (
                      <tr key={supplier.id}>
                        <td>{supplier.name}</td>
                        <td>{supplier.email}</td>
                        <td>{supplier.phone}</td>
                        <td>{supplier.address}</td>
                        <td>
                          <button onClick={() => handleRestore(supplier.id)}>Khôi phục</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="active-suppliers">
              <h3>Danh sách nhà cung cấp</h3>
              {suppliers.length === 0 ? (
                <p>Không có nhà cung cấp nào.</p>
              ) : (
                <table className="supplier-table">
                  <thead>
                    <tr>
                      <th>Tên</th>
                      <th>Email</th>
                      <th>Số điện thoại</th>
                      <th>Địa chỉ</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((supplier) => (
                      <tr key={supplier.id}>
                        <td>{supplier.name}</td>
                        <td>{supplier.email}</td>
                        <td>{supplier.phone}</td>
                        <td>{supplier.address}</td>
                        <td>
                          <button onClick={() => openEditModal(supplier.id)}>Sửa</button>
                          <button onClick={() => handleDelete(supplier.id)}>Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal thêm/sửa nhà cung cấp */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{isEditMode ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Địa chỉ:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Đang xử lý...' : isEditMode ? 'Cập nhật' : 'Thêm'}
                </button>
                <button type="button" onClick={closeModal} disabled={loading}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default SupplierManagement;