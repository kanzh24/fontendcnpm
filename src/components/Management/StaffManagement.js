import React, { useState, useEffect } from 'react';
import { getEmployees, registerEmployee, updateEmployee, deleteEmployee } from '../../api/api';

const StaffManagement = () => {
  const [staffs, setStaffs] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', gender: 'Male', address: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const employeesData = await getEmployees();
        console.log(employeesData)
        const formattedEmployees = employeesData.map((employee) => ({
          id: employee.id,
          name: employee.name || 'Unknown',
          orders: employee.orders || 0,
          spent: employee.spent || 0,
          gender: employee.gender || 'Male',
          address: employee.address || 'N/A',
        }));
        setStaffs(formattedEmployees);
      } catch (err) {
        setError('Failed to load employees: ' + err.message);
      }
    };
    fetchStaffs();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        const updatedStaff = await updateEmployee(formData.id, formData);
        const formattedUpdatedStaff = {
          id: updatedStaff.id,
          name: updatedStaff.name || 'Unknown',
          orders: updatedStaff.orders || 0,
          spent: updatedStaff.spent || 0,
          gender: updatedStaff.gender || 'Male',
          address: updatedStaff.address || 'N/A',
        };
        setStaffs((prev) =>
          prev.map((staff) => (staff.id === formData.id ? formattedUpdatedStaff : staff))
        );
      } else {
        const newStaff = await registerEmployee({
          ...formData,
          orders: 0,
          spent: 0,
        });
        const formattedNewStaff = {
          id: newStaff.id,
          name: newStaff.name || 'Unknown',
          orders: newStaff.orders || 0,
          spent: newStaff.spent || 0,
          gender: newStaff.gender || 'Male',
          address: newStaff.address || 'N/A',
        };
        setStaffs((prev) => [...prev, formattedNewStaff]);
      }
      closeForm();
    } catch (err) {
      setError('Failed to save employee: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhân viên này?')) {
      try {
        await deleteEmployee(id);
        setStaffs((prev) => prev.filter((staff) => staff.id !== id));
      } catch (err) {
        setError('Failed to delete employee: ' + err.message);
      }
    }
  };

  return (
    <div className="staff-management-container">
      <h2>Quản lý nhân viên</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button className="add-staff-button" onClick={openAddForm}>
        Thêm nhân viên
      </button>

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