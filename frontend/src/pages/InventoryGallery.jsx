import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import '../styles/InventoryGallery.css';

const InventoryGallery = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/inventory');
        setItems(res.data);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="gallery-container">
      <h2 className="gallery-title">🛒 Available Products</h2>
      <div className="product-grid">
        {items.map(item => (
          <div className="product-card" key={item.id}>
            <img src={item.image} alt={item.name} className="product-image" />
            <div className="product-details">
              <h3 className="product-name">{item.name}</h3>
              <p className="product-price">₹{item.price}</p>
              <p className={`product-status ${item.quantity <= 0 ? 'out' : item.quantity <= 5 ? 'low' : 'in'}`}>
                {item.quantity <= 0 ? 'Out of Stock' : item.quantity <= 5 ? 'Low Stock' : 'In Stock'}
              </p>
              <button className="details-button" onClick={() => setSelectedItem(item)}>
                View Details
                </button>
            </div>
          </div>
        ))}

        {selectedItem && (
  <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <button className="close-modal" onClick={() => setSelectedItem(null)}>✖</button>
      <img src={selectedItem.image} alt={selectedItem.name} className="modal-image" />
      <div className="modal-info">
        <h3>{selectedItem.name}</h3>
        <p><strong>SKU:</strong> {selectedItem.sku}</p>
        <p><strong>Category:</strong> {selectedItem.category}</p>
        <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
        <p><strong>Price:</strong> ₹{selectedItem.price}</p>
        <p><strong>Vendor:</strong> {selectedItem.vendor}</p>
        <p>
          <strong>Status:</strong>{' '}
          <span className={`product-status ${selectedItem.quantity <= 0 ? 'out' : selectedItem.quantity <= 5 ? 'low' : 'in'}`}>
            {selectedItem.quantity <= 0 ? 'Out of Stock' : selectedItem.quantity <= 5 ? 'Low Stock' : 'In Stock'}
          </span>
        </p>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default InventoryGallery;
