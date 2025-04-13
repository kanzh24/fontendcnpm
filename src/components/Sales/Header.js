import React from 'react';

const Header = () => {
  return (
    <header className="header">
      {/* Logo */}
      <div className="header-logo">
        <img src="/logo.png" alt="Logo" />
        <h1>Website Name</h1>
      </div>

      {/* Search Bar */}
      <div className="header-search">
        <input type="text" placeholder="Tìm kiếm sản phẩm..." />
        <button>
          <i className="fa fa-search"></i>
        </button>
      </div>

      {/* User Info Button */}
      <div className="header-user">
        <button>
          <i className="fa fa-user-circle"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
