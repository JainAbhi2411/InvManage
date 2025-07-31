import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/Inventory.css';
import { uploadImageToCloudinary } from '../api/uploadImage';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: '',
    price: '',
    vendor: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchInventory();
    fetchVendors();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const fetchVendors = async () => {
    try {
      const res = await api.get('/vendors');
      setVendors(res.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const addItem = async () => {
    try {
      let imageUrl = '';
      if (form.image) {
        imageUrl = await uploadImageToCloudinary(form.image);
      }
      await api.post('/inventory', {
        ...form,
        image: imageUrl,
        quantity: parseInt(form.quantity),
        price: parseFloat(form.price),
      });
      fetchInventory();
      setForm({ name: '', sku: '', category: '', quantity: '', price: '', vendor: '' ,image: null});
      setImagePreview(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await api.delete(`/inventory/${id}`);
      fetchInventory();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const rows = text.trim().split('\n');
      const headers = rows[0].split(',').map(h => h.trim().toLowerCase());

      const requiredFields = ['name', 'sku', 'category', 'quantity', 'price', 'vendor'];
      const isValid = requiredFields.every(field => headers.includes(field));
      if (!isValid) {
        alert('CSV must include headers: name, sku, category, quantity, price, vendor');
        return;
      }

      const newItems = rows.slice(1).map((row) => {
        const values = row.split(',').map(val => val.trim());
        const itemObj = {};
        headers.forEach((header, i) => {
          itemObj[header] = values[i];
        });
        return itemObj;
      });

      try {
        for (const item of newItems) {
          await api.post('/inventory', {
            ...item,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
          });
        }
        fetchInventory();
      } catch (error) {
        console.error('CSV Upload Error:', error);
      }
    };
    reader.readAsText(file);
  };

  const filtered = items.filter((item) => {
    const searchMatch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const stockMatch =
      stockFilter === 'all' ||
      (stockFilter === 'in' && item.quantity > 5) ||
      (stockFilter === 'low' && item.quantity <= 5 && item.quantity > 0) ||
      (stockFilter === 'out' && item.quantity <= 0);

    return searchMatch && stockMatch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sorted.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

   const openItemDetails = (item) => {
    setSelectedItem(item);
  };

  const closeItemDetails = () => {
    setSelectedItem(null);
  };

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <h2>Inventory Management</h2>
        <div className="btn-group">
          <button className="add-btn" onClick={() => setShowForm(true)}>+ Add Item</button>
          <label className="upload-btn">
            📁 Upload CSV
            <input type="file" accept=".csv" onChange={handleCSVUpload} hidden />
          </label>
        </div>
      </div>

      <div className="inventory-controls">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />

        <select value={stockFilter} onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}>
          <option value="all">All</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>

        <select value={sortField} onChange={(e) => { setSortField(e.target.value); setCurrentPage(1); }}>
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="quantity">Quantity</option>
          <option value="price">Price</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      <div className="inventory-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Vendor</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr><td colSpan="8">No inventory items found.</td></tr>
            ) : (
              currentItems.map(item => (
                <tr
                    key={item.id}
                    className={item.quantity <= 0 ? 'highlight-zero' : ''}
                    title={item.quantity <= 0 ? 'Out of stock' : ''}
                  >
                  <td onClick={() => openItemDetails(item)} className="clickable">{item.name}</td>
                 
                  <td>{item.sku}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                  <td>{item.vendor}</td>
                  <td>
                    <span className={`status ${item.quantity <= 0 ? 'out' : item.quantity <= 5 ? 'low' : 'in'}`}>
                      {item.quantity <= 0 ? 'Out' : item.quantity <= 5 ? 'Low' : 'In'}
                    </span>
                  </td>
                  <td>
                    <button className="del-btn" onClick={() => deleteItem(item.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Drill-down item modal */}
      {selectedItem && (
        <div className="item-detail-overlay" onClick={closeItemDetails}>
          <div className="item-detail-modal" onClick={e => e.stopPropagation()}>
            <h3>Item Details</h3>
            <img src={selectedItem.image} alt={selectedItem.name} width="100%" style={{ borderRadius: 8 }} />
            <p><strong>Name:</strong> {selectedItem.name}</p>
            <p><strong>SKU:</strong> {selectedItem.sku}</p>
            <p><strong>Category:</strong> {selectedItem.category}</p>
            <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
            <p><strong>Price:</strong> ₹{selectedItem.price}</p>
            <p><strong>Vendor:</strong> {selectedItem.vendor}</p>
            <p><strong>Status:</strong> {selectedItem.quantity <= 0 ? 'Out of Stock' : selectedItem.quantity <= 5 ? 'Low Stock' : 'In Stock'}</p>
            <button onClick={closeItemDetails}>Close</button>
          </div>
        </div>
      )}

      {filtered.length > itemsPerPage && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            <FaChevronLeft />
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            <FaChevronRight />
          </button>
        </div>
      )}

      {showForm && (
        <div className="inventory-form-overlay">
          <div className="inventory-form">
            <h3>Add Inventory Item</h3>
            <input name="name" placeholder="Item Name" value={form.name} onChange={handleChange} />
            <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
            <input name="quantity" placeholder="Quantity" type="number" value={form.quantity} onChange={handleChange} />
            <input name="price" placeholder="Price (₹)" type="number" value={form.price} onChange={handleChange} />
            <select name="vendor" value={form.vendor} onChange={handleChange}>
              <option value="">Select Vendor</option>
              {vendors.map(vendor => (
                <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
              ))}
            </select>
             <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="Preview" width="100" style={{ marginTop: 10, borderRadius: 6 }} />}
            <div className="form-actions">
              <button onClick={addItem}>Add</button>
              <button onClick={() => {setShowForm(false);setImagePreview(null);}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;