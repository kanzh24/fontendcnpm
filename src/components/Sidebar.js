import React from 'react';
// import './styles/main.css';

const Sidebar = ({ menuItems, setActiveFeature }) => {
  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <h3 className="sidebar-title">Menu</h3>
        <ul className="sidebar-list">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="sidebar-item"
              onClick={() => setActiveFeature(item.feature)}
            >
              <i className={`fa ${item.icon}`} />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;