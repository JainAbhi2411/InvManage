// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="logo">🗂️ InvManage</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/dashboard" activeclassname="active-link">
              📊 Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/inventory-gallery" activeclassname="active-link">
              📸 Items
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/vendors" activeclassname="active-link">
              🧑‍💼 Vendors
            </NavLink>
          </li>
          <li>
            <NavLink to="/inventory" activeclassname="active-link">
              📦 Inventory
            </NavLink>
          </li>
          <li>
            <NavLink to="/purchaseOrder" className="sidebar-link">
             📝 Purchase Orders
            </NavLink>
          </li>
          <li>
            <NavLink to="/sales-order" className="sidebar-link">
              🛒 Sales
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/settings" activeclassname="active-link">
              ⚙️ Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
