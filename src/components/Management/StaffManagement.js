import React, { useState } from 'react';
// import '../styles/StaffManagement.css';

const StaffManagement = () => {
  const [staffs, setStaffs] = useState([
    { id: 1, name: 'Addie Mintra', orders: 250, spent: 550, gender: 'Male', address: '2403 Juddwood Drive' },
    { id: 2, name: 'Manuel Laber', orders: 300, spent: 480, gender: 'Male', address: '3799 Glendale Avenue' },
    { id: 3, name: 'Jack Amanda', orders: 240, spent: 320, gender: 'Male', address: '827 Wildwood Street' },
    { id: 4, name: 'Stuam Clewed', orders: 450, spent: 300, gender: 'Male', address: '5056 Lindgren Village' },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', gender: 'Male', address: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  const openAddForm = () => {
    setFormData({ id: null, name: '', gender: 'Male', address: '' });
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const openEditForm = (staff) => {
    setFormData(staff);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      // Cập nhật nhân viên
      setStaffs((prev) =>
        prev.map((staff) =>
          staff.id === formData.id ? { ...staff, ...formData } : staff
        )
      );
    } else {
      // Thêm nhân viên mới
      const newStaff = {
        ...formData,
        id: staffs.length + 1,
        orders: 0, // Giá trị mặc định
        spent: 0,  // Giá trị mặc định
      };
      setStaffs((prev) => [...prev, newStaff]);
    }
    closeForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhân viên này?')) {
      setStaffs((prev) => prev.filter((staff) => staff.id !== id));
    }
  };

  return (
    <div className="staff-management-container">
      <h2>Quản lý nhân viên</h2>
      <button className="add-staff-button" onClick={openAddForm}>
        Thêm nhân viên
      </button>

      {/* Bảng danh sách nhân viên */}
      <table className="staff-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Orders</th>
            <th>Spent ($)</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {staffs.map((staff) => (
            <tr key={staff.id}>
              <td>{staff.name}</td>
              <td>{staff.orders}</td>
              <td>{staff.spent}</td>
              <td>{staff.gender}</td>
              <td>{staff.address}</td>
              <td>
                <button className="edit-button" onClick={() => openEditForm(staff)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDelete(staff.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form thêm/sửa nhân viên */}
      {isFormOpen && (
        <div className="form-overlay">
          <div className="form-container">
            <h3>{isEditMode ? 'Sửa nhân viên' : 'Thêm nhân viên'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Gender:</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit">{isEditMode ? 'Cập nhật' : 'Thêm'}</button>
                <button type="button" onClick={closeForm}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;