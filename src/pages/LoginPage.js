import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";
import { setToken, setRefreshToken, setUser } from "../api/auth";
// import './LoginPage.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { email, password } = credentials;
    let isValid = true;

    if (email === "") {
      setEmailError("Vui lòng nhập Email.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Email không hợp lệ.");
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu.");
      isValid = false;
    }

    if (!isValid) return;
    try {
      const response = await login(credentials);

      // Kiểm tra xem response có access_token không
      if (response.access_token) {
        // Lưu access_token
        setToken(response.access_token);

        // Lưu refresh_token nếu có
        if (response.refresh_token) {
          setRefreshToken(response.refresh_token);
        }

        // Giải mã access_token để lấy thông tin người dùng (nếu cần)
        const user = parseJwt(response.access_token);
        if (user) {
          setUser(user);
        }

        console.log(user);

        // Chuyển hướng đến trang SalesPage
        navigate(`/${user.role}`);
      } else {
        setError("Login failed: No access token received");
      }
    } catch (err) {
      // Hiển thị thông báo lỗi chi tiết nếu có
      const errorMessage =
        err.response?.data?.message || err.message || "Invalid credentials";
      setError(`Login failed: ${errorMessage}`);
    }
  };

  // Hàm giải mã JWT token để lấy thông tin người dùng
  const parseJwt = token => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error parsing JWT token:", e);
      return null;
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-image-placeholder">
          <h3>Welcome to Our System</h3>
          <p>Please login to manage your sales and operations.</p>
        </div>
      </div>
      <div className="login-right">
        <h2 className="login-welcome">Welcome Back</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="login-input"
            placeholder="Email"
            value={credentials.email}
            onChange={e =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />
          {emailError && (
            <p className="error-message error-input">{emailError}</p>
          )}
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={credentials.password}
            onChange={e =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
          {passwordError && (
            <p className="error-message error-input">{passwordError}</p>
          )}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
