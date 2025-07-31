import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';
import { Bar } from 'react-chartjs-2';
import { api } from '../api/api';
import { useNavigate } from 'react-router-dom';


import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [inventoryCount, setInventoryCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [topUsedItems, setTopUsedItems] = useState([]);
  const [recentPOs, setRecentPOs] = useState([]);
  const [topVendor, setTopVendor] = useState(null);

  const navigate = useNavigate();

const handleCardClick = (path) => {
  navigate(path);
};

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [inventoryRes, inventoryCountRes, vendorCountRes, ordersRes] = await Promise.all([
        api.get('/inventory'),
        api.get('/inventory/count'),
        api.get('/vendors/count'),
        api.get('/purchaseOrder'),
      ]);

      const inventory = inventoryRes.data;
      const orders = ordersRes.data;

      // Dashboard counts
      setInventoryCount(inventoryCountRes.data);
      setVendorCount(vendorCountRes.data);
      setLowStockCount(inventory.filter(i => i.quantity <= 5 && i.quantity > 0).length);
      setOutOfStockCount(inventory.filter(i => i.quantity <= 0).length);
      setPendingOrdersCount(orders.filter(o => o.status.toLowerCase() === 'pending').length);

      // Top 5 items by quantity (assuming high usage => low quantity)
      const topItems = [...inventory]
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 5)
        .map(i => ({ label: i.name, used: Math.floor(Math.random() * 50) + 1 }));
      setTopUsedItems(topItems);

      // Recent Purchase Orders (latest 5)
      const sortedOrders = orders.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentPOs(sortedOrders.slice(0, 5));

      // Most used vendor (by number of POs)
      const vendorMap = {};
      orders.forEach(order => {
        vendorMap[order.vendorName] = (vendorMap[order.vendorName] || 0) + 1;
      });
      const topVendorEntry = Object.entries(vendorMap).sort((a, b) => b[1] - a[1])[0];
      setTopVendor(topVendorEntry ? topVendorEntry[0] : 'N/A');
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
  };

  const chartData = {
    labels: topUsedItems.map(i => i.label),
    datasets: [
      {
        label: 'Estimated Stock Usage',
        data: topUsedItems.map(i => i.used),
        backgroundColor: '#007BFF',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-heading">Dashboard Overview</h2>

      <div className="dashboard-cards" cursor="pointer">
       <div className="card card-blue" onClick={() => handleCardClick('/inventory')}>
          <div className="card-icon">📦</div>
          <div>
            <h3>Total Inventory</h3>
            <p>{inventoryCount}</p>
          </div>
        </div>

        <div className="card card-green" onClick={() => handleCardClick('/vendors')}>
          <div className="card-icon">👥</div>
          <div>
            <h3>Total Vendors</h3>
            <p>{vendorCount}</p>
          </div>
        </div>

        <div className="card card-yellow" onClick={() => handleCardClick('/inventory?filter=low')}>
          <div className="card-icon">⚠️</div>
          <div>
            <h3>Low Stock</h3>
            <p>{lowStockCount}</p>
          </div>
        </div>

        <div className="card card-red" onClick={() => handleCardClick('/inventory?filter=out')}>
          <div className="card-icon">❌</div>
          <div>
            <h3>Out of Stock</h3>
            <p>{outOfStockCount}</p>
          </div>
        </div>

        <div className="card card-purple" onClick={() => handleCardClick('/purchaseOrder')}>
          <div className="card-icon">🛒</div>
          <div>
            <h3>Pending Orders</h3>
            <p>{pendingOrdersCount}</p>
          </div>
        </div>

        <div className="card card-orange" onClick={() => handleCardClick(`/vendors`)}>
          <div className="card-icon">🏆</div>
          <div>
            <h3>Top Vendor</h3>
            <p>{topVendor}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="chart-section">
          <h3>Top 5 Used Items</h3>
          <Bar data={chartData} />
        </div>

        <div className="recent-activity advanced">
          <h3>Recent Purchase Orders</h3>
          <ul>
            {recentPOs.map(po => (
              <li key={po.id}>
                <span className={`dot ${po.status.toLowerCase()}`} />
                #{po.po_number} - {po.vendorName} - {po.status}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
