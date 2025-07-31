import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import '../styles/SalesOrders.css';
import SalesOrderForm from '../components/SalesOrderForm';
import PrintableInvoice from '../components/PrintableInvoice';

const SalesOrders = () => {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchInventory();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/sales');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching sales orders:', err);
    }
  };
  const printInvoice = () => {
  const printContent = document.getElementById("printable-invoice");
  const printWindow = window.open("", "", "width=900,height=700");
  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          h2 { text-align: center; }
          .invoice-header, .invoice-footer { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f1f1f1; }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
};


  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setInventory(res.data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const res = await api.get(`/sales/${orderId}`);
      setViewOrder(res.data);
    } catch (err) {
      console.error('Error fetching order details:', err);
    }
  };
  const handleDeleteOrder = async (orderId) => {
  if (!window.confirm("Are you sure you want to delete this order?")) return;

  try {
    await api.delete(`/sales/${orderId}`);
    fetchOrders(); // Refresh the list after deletion
  } catch (err) {
    console.error("Error deleting order:", err);
    alert("Failed to delete order. Please try again.");
  }
};
  console.log(viewOrder)
  const markAsDelivered = async (orderId) => {
  try {
    await api.patch(`/sales/${orderId}`, { status: 'Delivered' });
    fetchOrders();
    fetchOrderDetails(orderId); // update the modal too
  } catch (err) {
    console.error('Error updating order status:', err);
  }
};

  return (
    <div className="sales-orders">
      <div className="so-header">
        <h2>Sales Orders</h2>
        <button className="create-so-btn" onClick={() => setShowForm(true)}>+ Create Sales Order</button>
      </div>

      <table className="so-table">
        <thead>
          <tr>
            <th>Order No</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr><td colSpan="6">No orders found</td></tr>
          ) : (
            orders.map(order => (
              <tr key={order.id}>
                <td>{order.so_number}</td>
                <td>{order.customer_name}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>₹{order.total}</td>
                <td>{order.status}</td>
               <td>
                <button onClick={() => fetchOrderDetails(order.id)}>View</button>
                <button onClick={() => handleDeleteOrder(order.id)} style={{ marginLeft: "8px", backgroundColor: "#f44336", color: "white" }}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showForm && (
        <SalesOrderForm
          inventory={inventory}
          onClose={() => setShowForm(false)}
          onSubmit={fetchOrders}
        />
      )}

    {viewOrder && (
  <div className="so-modal-overlay" onClick={() => setViewOrder(null)}>
    <div className="so-modal" onClick={e => e.stopPropagation()}>
      <PrintableInvoice order={viewOrder} />
      
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        {/* Mark as Delivered */}
        {viewOrder.status !== "Delivered" && (
          <button onClick={() => markAsDelivered(viewOrder.id)}>Mark as Delivered</button>
        )}

        {/* Show Print only if status is Delivered */}
        {viewOrder.status === "Delivered" && (
          <button onClick={printInvoice}>🖨️ Print Invoice</button>
        )}

        <button onClick={() => setViewOrder(null)}>Close</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default SalesOrders;
