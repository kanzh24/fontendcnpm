import React from 'react';
// import '../styles/Login.css'; // CSS riêng cho component Login

const Login = () => {
    return (
        <div className="login-container">
            <div className="login-left">
                <img src="../assets/images/image02.jpg" alt="Welcome" className="login-image" />
            </div>

            <div className="login-right"> 
                <h2 className="login-welcome">Welcome to my app!</h2>
                <form className="login-form">
                    <input type="text" placeholder="Tên người dùng" className="login-input" /><br />
                    <input type="password" placeholder="Mật khẩu" className="login-input" /><br />
                    <button type="submit" className="login-button">Đăng nhập</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
