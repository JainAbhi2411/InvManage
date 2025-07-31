import React, { useEffect, useState } from 'react';

import '../styles/PurchaseOrders.css';
import { uploadImageToCloudinary } from '../api/uploadImage';
import { api } from '../api/api';

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);

  const [form, setForm] = useState({
  vendor: '',
  items: [{ name: '', quantity: 1, category: '', price: '', image: null, imagePreview: null }],
});

  useEffect(() => {
    fetchOrders();
    fetchVendors();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/purchaseOrder');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching purchase orders:', err);
    }
  };
  const handleImageChange = (e, index) => {
  const file = e.target.files[0];
  const updatedItems = [...form.items];
  updatedItems[index].image = file;
  updatedItems[index].imagePreview = URL.createObjectURL(file);
  setForm({ ...form, items: updatedItems });
};
  const fetchVendors = async () => {
    try {
      const res = await api.get('/vendors');
      setVendors(res.data);
    } catch (err) {
      console.error('Error fetching vendors:', err);
    }
  };

  const handleFormChange = (e, index = null) => {
  if (e.target.name === 'vendor') {
    setForm({ ...form, vendor: e.target.value });
  } else {
    const updatedItems = [...form.items];
    updatedItems[index][e.target.name] = e.target.value;
    setForm({ ...form, items: updatedItems });
  }
};

  const addItemField = () => {
    setForm({ ...form, items: [...form.items, { name: '', quantity: 1 }] });
  };

  const removeItemField = (index) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updatedItems });
  };

  const createPurchaseOrder = async () => {
  try {
    const itemsWithImages = await Promise.all(
      form.items.map(async (item) => {
        let imageUrl = '';
        if (item.image) {
          imageUrl = await uploadImageToCloudinary(item.image);
        }
        return {
          ...item,
          image: imageUrl,
        };
      })
    );

    await api.post('/purchaseOrder', {
      vendor: form.vendor,
      items: itemsWithImages,
    });

    fetchOrders();
    setShowForm(false);
    setForm({
      vendor: '',
      items: [{ name: '', quantity: 1, category: '', price: '', image: null, imagePreview: null }],
    });
  } catch (err) {
    console.error('Error creating purchase order:', err);
  }
};

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this purchase order?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/purchaseOrder/${id}`);
      fetchOrders();
    } catch (err) {
      console.error('Error deleting purchase order:', err);
    }
  };
  const markAsReceived = async (id) => {
  try {
    await api.put(`/purchaseOrder/${id}/receive`);
    fetchOrders(); // Refresh list after update
  } catch (err) {
    console.error("Error marking as received:", err);
  }
};

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredOrders = orders.filter(order =>
    order.vendorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="purchase-orders">
      <div className="po-header">
        <h2>Purchase Orders</h2>
        <div className="po-header-actions">
          <input
            className="po-search"
            type="text"
            placeholder="Search by vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="create-po-btn" onClick={() => setShowForm(true)}>+ Create Purchase Order</button>
        </div>
      </div>

      <div className="po-table">
        <table>
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Vendor</th>
              <th>Date</th>
              <th>Total Items</th>
              <th>Total Cost</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan="6">No purchase orders found.</td></tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.po_number}</td>
                  <td>{order.vendorName}</td>
                  <td>{formatDate(order.date)}</td>
                  <td>{order.items.length}</td>
                  <td>₹{order.totalCost}</td>

                  <td>
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button className="view-btn" onClick={() => setViewOrder(order)}>View</button>
                    <button className="del-btn" onClick={() => deleteOrder(order.id)}>Delete</button>
                    {order.status !== 'Received' && (
                        <button className="receive-btn" onClick={() => markAsReceived(order.id)}>Mark as Received</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Order Modal */}
      {viewOrder && (
        <div className="po-modal-overlay">
    <div className="po-modal">
      <h3>Purchase Order: {viewOrder.po_number}</h3>
      <p><strong>Vendor:</strong> {viewOrder.vendorName}</p>
      <p><strong>Date:</strong> {new Date(viewOrder.date).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {viewOrder.status}</p>
      <h4>Items:</h4>
      <ul>
        {viewOrder.items.map((item, idx) => (
          <li key={idx}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                 {item.image && <img src={item.image} width="60" style={{ borderRadius: '6px' }} alt={item.item_name}/>}
                  <span>{item.item_name} ({item.category}) - {item.quantity} × ₹{item.price}</span>
            </div>
            
          </li>
        ))}
      </ul>
      <div className="modal-actions">
        <button onClick={() => setViewOrder(null)}>Close</button>
      </div>
    </div>
  </div>
)}

      {/* Create Order Form */}
      {showForm && (
        <div className="po-form-overlay">
          <div className="po-form">
            <h3>Create Purchase Order</h3>
            <select name="vendor" value={form.vendor} onChange={handleFormChange}>
              <option value="">Select Vendor</option>
              {vendors.map(v => (
                <option key={v.id} value={v.name}>{v.name}</option>
              ))}
            </select>

            {form.items.map((item, idx) => (    
              <div key={idx} className="po-item-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Item Name"
                  value={item.name}
                  onChange={(e) => handleFormChange(e, idx)}
                />
                <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={item.category || ''}
                        onChange={(e) => handleFormChange(e, idx)}
                    />

                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleFormChange(e, idx)}
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={item.price || ''}
                    onChange={(e) => handleFormChange(e, idx)}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, idx)}
                    />
                    {item.imagePreview && (
                    <img
                        src={item.imagePreview}
                        alt="Preview"
                        width="60"
                        style={{ borderRadius: '6px', marginTop: '6px' }}
                    />
                    )}
                {form.items.length > 1 && (
                  <button className="remove-btn" onClick={() => removeItemField(idx)}>✖</button>
                )}
              </div>
            ))}

            <button className="add-btn" onClick={addItemField}>+ Add Item</button>

            <div className="form-actions">
              <button onClick={createPurchaseOrder}>Create</button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrders;
