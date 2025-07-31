import React, { useState, useEffect } from 'react';
import '../styles/VendorModal.css';

const VendorFormModal = ({ onClose, onSave, initialData }) => {
  const [vendor, setVendor] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active',
  });

  useEffect(() => {
    if (initialData) {
      setVendor(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendor({ ...vendor, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!vendor.name || !vendor.email || !vendor.phone) {
      alert('All fields are required!');
      return;
    }

    onSave(vendor);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{vendor.id ? 'Edit Vendor' : 'Add Vendor'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Vendor Name"
            value={vendor.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Vendor Email"
            value={vendor.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Vendor Phone"
            value={vendor.phone}
            onChange={handleChange}
          />
          <select
            name="status"
            value={vendor.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" className="cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorFormModal;
