import React from 'react';
// import '../styles/SidebarSale.css';

const SidebarSale = ({ setCategory }) => {
  const categories = [
    { icon: 'fa-hamburger', label: 'Tất cả món', category: 'all' },
    { icon: 'fa-pizza-slice', label: 'Pizza', category: 'pizza' },
    { icon: 'fa-utensils', label: 'Món chính', category: 'main' },
    { icon: 'fa-coffee', label: 'Thức uống', category: 'drink' },
    { icon: 'fa-ice-cream', label: 'Tráng miệng', category: 'dessert' },
  ];

  return (
    <div className="sidebar-sale-container">
      <div className="sidebar-sale">
        <h3 className="sidebar-sale-title">Danh mục</h3>
        <ul className="sidebar-sale-list">
          {categories.map((category, index) => (
            <li
              key={index}
              className="sidebar-sale-item"
              onClick={() => setCategory(category.category)}
            >
              <i className={`fa ${category.icon}`} />
              <span>{category.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarSale;