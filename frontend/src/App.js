// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import Inventory from './pages/Inventory';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import InventoryGallery from './pages/InventoryGallery';

import './App.css';
import PurchaseOrders from './pages/PurchaseOrders';
import SalesOrders from './pages/SalesOrders';

const AppLayout = ({ PageComponent }) => (
  <div className="dashboard-container">
    <Sidebar />
    <div className="main-content">
      <Navbar />
      <div className="content">
        <PageComponent />
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App Routes with Sidebar and Navbar */}
        <Route path="/dashboard" element={<AppLayout PageComponent={Dashboard} />} />
        <Route path="/vendors" element={<AppLayout PageComponent={Vendors} />} />
        <Route path="/inventory" element={<AppLayout PageComponent={Inventory} />} />
        <Route path="/purchaseOrder" element={<AppLayout PageComponent={PurchaseOrders} />} />
        <Route path="/inventory-gallery" element={<AppLayout PageComponent={InventoryGallery} />} />
        <Route path="/sales-order" element={<AppLayout PageComponent={SalesOrders} />} />
        <Route path="/settings" element={<AppLayout PageComponent={Settings} />} />
      </Routes>
    </Router>
  );
};

export default App;
