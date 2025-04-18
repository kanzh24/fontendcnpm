import React, { useState, useEffect } from 'react';
import { getEmployees, registerEmployee, updateEmployee, deleteEmployee, restoreEmployee } from '../../api/api';
// import './StaffManagement.css';

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [deletedStaffList, setDeletedStaffList] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false); // Hiển thị danh sách nhân viên đã xóa
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: '', // Thêm id vào formData để lưu trữ khi chỉnh sửa
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'barista',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load danh sách nhân viên
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const staffData = await getEmployees();
        if (!Array.isArray(staffData)) {
          throw new Error('Invalid data format: Expected an array of employees');
        }
        // Lọc nhân viên chưa bị xóa và đã xóa
        const activeStaff = staffData
          .filter((staff) => staff && staff.id && !staff.deletedAt)
          .map((staff) => ({
            id: staff.id,
            name: staff.name || 'Unknown',
            phone: staff.phone || 'N/A',
            email: staff.email || 'N/A',
            role: staff.role || 'barista',
            createdAt: staff.createdAt || '',
            updatedAt: staff.updatedAt || '',
            deletedAt: staff.deletedAt || null,
          }));
        const deletedStaff = staffData
          .filter((staff) => staff && staff.id && staff.deletedAt)
          .map((staff) => ({
            id: staff.id,
            name: staff.name || 'Unknown',
            phone: staff.phone || 'N/A',
            email: staff.email || 'N/A',
            role: staff.role || 'barista',
            createdAt: staff.createdAt || '',
            updatedAt: staff.updatedAt || '',
            deletedAt: staff.deletedAt || null,
          }));
        setStaffList(activeStaff);
        setDeletedStaffList(deletedStaff);
      } catch (err) {
        setError('Failed to load employees: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  // Mở form thêm nhân viên
  const openAddForm = () => {
    setFormData({
      // id: '',
      name: '',
      phone: '',
      email: '',
      password: '',
      role: 'barista',
    });
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  // Mở form sửa nhân viên
  const openEditForm = (staff) => {
    setFormData({
      id: staff.id, // Lưu id của nhân viên để sử dụng khi cập nhật
      name: staff.name,
      phone: staff.phone,
      email: staff.email,
      password: '', // Để trống, người dùng sẽ nhập nếu muốn thay đổi
      role: staff.role,
    });
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  // Đóng form
  const closeForm = () => {
    setIsFormOpen(false);
  };

  // Xử lý thay đổi input trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý submit form (thêm hoặc sửa nhân viên)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Sửa nhân viên
        const { id, password, ...updateData } = formData;
        // Chỉ thêm password vào payload nếu người dùng nhập mật khẩu mới
        if (password.trim()) {
          updateData.password = password;
        }
        console.log(updateData)
        const updatedEmployee = await updateEmployee(id, updateData);
        const formattedUpdatedEmployee = {
          id: updatedEmployee.id,
          name: updatedEmployee.name || 'Unknown',
          phone: updatedEmployee.phone || 'N/A',
          email: updatedEmployee.email || 'N/A',
          role: updatedEmployee.role || 'barista',
          createdAt: updatedEmployee.createdAt || '',
          updatedAt: updatedEmployee.updatedAt || '',
          deletedAt: updatedEmployee.deletedAt || null,
        };
        setStaffList((prev) =>
          prev.map((staff) => (staff.id === id ? formattedUpdatedEmployee : staff))
        );
      } else {
        // Thêm nhân viên mới
        console.log(formData)
        const newEmployee = await registerEmployee(formData);
        const formattedNewEmployee = {
          name: newEmployee.name || 'Unknown',
          phone: newEmployee.phone || 'N/A',
          email: newEmployee.email || 'N/A',
          role: newEmployee.role || 'barista',
          createdAt: newEmployee.createdAt || '',
          updatedAt: newEmployee.updatedAt || '',
          deletedAt: newEmployee.deletedAt || null,
        };
        setStaffList((prev) => [...prev, formattedNewEmployee]);
      }
      closeForm();
    } catch (err) {
      setError('Failed to save employee: ' + (err.message || 'Unknown error'));
    }
  };

  // Xử lý xóa nhân viên
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhân viên này?')) {
      try {
        const deletedEmployee = await deleteEmployee(id);
        // Cập nhật danh sách: chuyển nhân viên từ staffList sang deletedStaffList
        const deletedStaff = staffList.find((staff) => staff.id === id);
        setStaffList((prev) => prev.filter((staff) => staff.id !== id));
        setDeletedStaffList((prev) => [
          ...prev,
          {
            ...deletedStaff,
            deletedAt: deletedEmployee.deletedAt || new Date().toISOString(),
          },
        ]);
      } catch (err) {
        setError('Failed to delete employee: ' + (err.message || 'Unknown error'));
      }
    }
  };

  // Xử lý khôi phục nhân viên
  const handleRestore = async (id) => {
    if (window.confirm('Bạn có chắc muốn khôi phục nhân viên này?')) {
      try {
        const restoredEmployee = await restoreEmployee(id);
        // Cập nhật danh sách: chuyển nhân viên từ deletedStaffList sang staffList
        const restoredStaff = deletedStaffList.find((staff) => staff.id === id);
        setDeletedStaffList((prev) => prev.filter((staff) => staff.id !== id));
        setStaffList((prev) => [
          ...prev,
          {
            ...restoredStaff,
            deletedAt: null,
            updatedAt: restoredEmployee.updatedAt || new Date().toISOString(),
          },
        ]);
      } catch (err) {
        setError('Failed to restore employee: ' + (err.message || 'Unknown error'));
      }
    }
  };

  return (
    <div className="staff-management-container">
      <h2>Quản lý nhân viên</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="staff-management-actions">
        <button className="add-staff-button" onClick={openAddForm}>
          Thêm nhân viên
        </button>
        <button
          className="toggle-deleted-button"
          onClick={() => setShowDeleted(!showDeleted)}
        >
          {showDeleted ? 'Ẩn nhân viên đã xóa' : 'Xem nhân viên đã xóa'}
        </button>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : showDeleted ? (
        <>
          <h3>Danh sách nhân viên đã xóa</h3>
          <table className="staff-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày xóa</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {deletedStaffList.length > 0 ? (
                deletedStaffList.map((staff) => (
                  <tr key={staff.id}>
                    <td>{staff.name}</td>
                    <td>{staff.phone}</td>
                    <td>{staff.email}</td>
                    <td>{staff.role}</td>
                    <td>{new Date(staff.deletedAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="restore-button"
                        onClick={() => handleRestore(staff.id)}
                      >
                        Khôi phục
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Không có nhân viên đã xóa.</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <h3>Danh sách nhân viên</h3>
          <table className="staff-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th>Ngày cập nhật</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {staffList.length > 0 ? (
                staffList.map((staff) => (
                  <tr key={staff.id}>
                    <td>{staff.name}</td>
                    <td>{staff.phone}</td>
                    <td>{staff.email}</td>
                    <td>{staff.role}</td>
                    <td>{new Date(staff.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(staff.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => openEditForm(staff)}
                      >
                        Sửa
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(staff.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Không có nhân viên nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {isFormOpen && (
        <div className="form-overlay">
          <div className="form-container">
            <button className="close-button" onClick={closeForm}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <h3>{isEditMode ? 'Sửa nhân viên' : 'Thêm nhân viên'}</h3>
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
                <label>{isEditMode ? 'Mật khẩu mới (để trống nếu không thay đổi):' : 'Mật khẩu:'}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!isEditMode} // Bắt buộc khi thêm mới, không bắt buộc khi chỉnh sửa
                  placeholder={isEditMode ? 'Nhập mật khẩu mới nếu muốn thay đổi' : ''}
                />
              </div>
              <div className="form-group">
                <label>Vai trò:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="admin">Quản trị viên</option>
                  <option value="barista">Nhân viên pha chế</option>
                  <option value="waiter">Nhân viên phục vụ</option>
                </select>
              </div>
              <button type="submit" className="save-staff-button">
                {isEditMode ? 'Cập nhật' : 'Thêm'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;