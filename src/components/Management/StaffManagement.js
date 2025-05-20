import React, { useState, useEffect } from "react";
import {
  getEmployees,
  registerEmployee,
  updateEmployee,
  deleteEmployee,
  restoreEmployee,
} from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [deletedStaffList, setDeletedStaffList] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false); // Hiển thị danh sách nhân viên đã xóa
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [formData, setFormData] = useState({
    id: "", // Thêm id vào formData để lưu trữ khi chỉnh sửa
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "barista",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const staffData = await getEmployees();
      if (!Array.isArray(staffData)) {
        throw new Error("Invalid data format: Expected an array of employees");
      }
      // Lọc nhân viên chưa bị xóa và đã xóa
      const activeStaff = staffData
        .filter(staff => staff && staff.id && !staff.deletedAt)
        .map(staff => ({
          id: staff.id,
          name: staff.name || "Unknown",
          phone: staff.phone || "N/A",
          email: staff.email || "N/A",
          role: staff.role || "barista",
          createdAt: staff.createdAt || "",
          updatedAt: staff.updatedAt || "",
          deletedAt: staff.deletedAt || null,
        }));
      const deletedStaff = staffData
        .filter(staff => staff && staff.id && staff.deletedAt)
        .map(staff => ({
          id: staff.id,
          name: staff.name || "Unknown",
          phone: staff.phone || "N/A",
          email: staff.email || "N/A",
          role: staff.role || "barista",
          createdAt: staff.createdAt || "",
          updatedAt: staff.updatedAt || "",
          deletedAt: staff.deletedAt || null,
        }));
      setStaffList(activeStaff);
      setDeletedStaffList(deletedStaff);
    } catch (err) {
      toast.error(
        "Failed to load employees: " + (err.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };
  // Load danh sách nhân viên
  useEffect(() => {
    fetchStaff();
  }, []);

  // Mở form thêm nhân viên
  const openAddForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      password: "",
      role: "barista",
    });
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  // Mở form sửa nhân viên
  const openEditForm = staff => {
    setFormData({
      id: staff.id, // Lưu id của nhân viên để sử dụng khi cập nhật
      name: staff.name,
      phone: staff.phone,
      email: staff.email,
      password: "", // Để trống, người dùng sẽ nhập nếu muốn thay đổi
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
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setNameError("");
    setPhoneError("");
    setEmailError("");
    setPasswordError("");
  };

  // Xử lý submit form (thêm hoặc sửa nhân viên)
  const handleSubmit = async e => {
    e.preventDefault();
    setNameError("");
    setPhoneError("");
    setEmailError("");
    setPasswordError("");
    const { name, phone, email, password } = formData;
    const phoneRegex = /^[0-9]{10,11}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;
    // Validate
    if (name === "") {
      setNameError("Vui lòng nhập tên nhân viên !");
      isValid = false;
    } else if (phone === "") {
      setPhoneError("Vui lòng nhập số điện thoại !");
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      setPhoneError("Vui lòng nhập đúng định dạng số điện thoại !");
      isValid = false;
    } else if (email === "") {
      setEmailError("Vui lòng nhập Email.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Email không hợp lệ.");
      isValid = false;
    } else if (!password && !isEditMode) {
      setPasswordError("Vui lòng nhập mật khẩu.");
      isValid = false;
    }

    if (!isValid) return;
    try {
      if (isEditMode) {
        // Sửa nhân viên
        const { id, password, ...updateData } = formData;
        // Chỉ thêm password vào payload nếu người dùng nhập mật khẩu mới
        if (password.trim()) {
          updateData.password = password;
        }
        console.log(updateData);
        const updatedEmployee = await updateEmployee(id, updateData);
        const formattedUpdatedEmployee = {
          name: updatedEmployee.name || "Unknown",
          phone: updatedEmployee.phone || "N/A",
          email: updatedEmployee.email || "N/A",
          role: updatedEmployee.role || "barista",
        };
        setStaffList(prev =>
          prev.map(staff =>
            staff.id === id ? formattedUpdatedEmployee : staff
          )
        );
        toast.success("Cập nhật nhân viên thành công");
        fetchStaff();
      } else {
        // Thêm nhân viên mới
        console.log(formData);
        const newEmployee = await registerEmployee(formData);
        const formattedNewEmployee = {
          name: newEmployee.name || "Unknown",
          phone: newEmployee.phone || "N/A",
          email: newEmployee.email || "N/A",
          role: newEmployee.role || "barista",
        };
        setStaffList(prev => [...prev, formattedNewEmployee]);
        toast.success("Thêm nhân viên thành công");
        fetchStaff();
      }
      closeForm();
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  // Xử lý xóa nhân viên
  const handleDelete = async id => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này?")) {
      try {
        const deletedEmployee = await deleteEmployee(id);
        // Cập nhật danh sách: chuyển nhân viên từ staffList sang deletedStaffList
        const deletedStaff = staffList.find(staff => staff.id === id);
        setStaffList(prev => prev.filter(staff => staff.id !== id));
        setDeletedStaffList(prev => [
          ...prev,
          {
            ...deletedStaff,
            deletedAt: deletedEmployee.deletedAt || new Date().toISOString(),
          },
        ]);
        toast.success("Xóa nhân viên thành công");
      } catch (err) {
        toast.error(
          "Failed to delete employee: " + (err.message || "Unknown error")
        );
      }
    }
  };

  // Xử lý khôi phục nhân viên
  const handleRestore = async id => {
    if (window.confirm("Bạn có chắc muốn khôi phục nhân viên này?")) {
      try {
        const restoredEmployee = await restoreEmployee(id);
        // Cập nhật danh sách: chuyển nhân viên từ deletedStaffList sang staffList
        const restoredStaff = deletedStaffList.find(staff => staff.id === id);
        setDeletedStaffList(prev => prev.filter(staff => staff.id !== id));
        setStaffList(prev => [
          ...prev,
          {
            ...restoredStaff,
            deletedAt: null,
            updatedAt: restoredEmployee.updatedAt || new Date().toISOString(),
          },
        ]);
        toast.success("Khôi phục nhân viên thành công");
      } catch (err) {
        toast.error(
          "Failed to restore employee: " + (err.message || "Unknown error")
        );
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
          {showDeleted ? "Ẩn nhân viên đã xóa" : "Xem nhân viên đã xóa"}
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
                deletedStaffList.map(staff => (
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
                staffList.map(staff => (
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
            <h3>{isEditMode ? "Sửa nhân viên" : "Thêm nhân viên"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {nameError && (
                  <p className="error-message error-input">{nameError}</p>
                )}
              </div>
              <div className="form-group">
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {phoneError && (
                  <p className="error-message error-input">{phoneError}</p>
                )}
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {emailError && (
                  <p className="error-message error-input">{emailError}</p>
                )}
              </div>
              <div className="form-group">
                <label>
                  {isEditMode
                    ? "Mật khẩu mới (để trống nếu không thay đổi):"
                    : "Mật khẩu:"}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={
                    isEditMode ? "Nhập mật khẩu mới nếu muốn thay đổi" : ""
                  }
                />
                {passwordError && (
                  <p className="error-message error-input">{passwordError}</p>
                )}
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
                  <option value="inventory_manager">Quản lý kho</option>
                </select>
              </div>
              <button type="submit" className="save-staff-button">
                {isEditMode ? "Cập nhật" : "Thêm"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Thêm ToastContainer */}
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

export default StaffManagement;
