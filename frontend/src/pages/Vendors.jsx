import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import '../styles/Vendors.css';
import VendorFormModal from '../components/VendorFormModal';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editVendor, setEditVendor] = useState(null);

  // Fetch vendors on load
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await api.get('/vendors');
      console.log(res.data);
      setVendors(res.data);
    } catch (err) {
      console.error('Error fetching vendors:', err);
    }
  };

  const handleSave = async (vendor) => {
    try {
      if (vendor.id) {
        await api.put(`/vendors/${vendor.id}`, vendor);
      } else {
        await api.post('/vendors', vendor);
      }
      fetchVendors();
    } catch (err) {
      console.error('Error saving vendor:', err);
    }
    setModalOpen(false);
    setEditVendor(null);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/vendors/${id}`);
      fetchVendors();
    } catch (err) {
      console.error('Error deleting vendor:', err);
    }
  };

  const filtered = vendors.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="vendors">
      <div className="vendors-header">
        <h2>Vendors</h2>
        <input
          type="text"
          placeholder="Search vendors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="add-btn" onClick={() => {
          setEditVendor(null);
          setModalOpen(true);
        }}>
          + Add Vendor
        </button>
      </div>

      <div className="vendors-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.name}</td>
                <td>{vendor.email}</td>
                <td>{vendor.phone}</td>
                <td>
                  <span className={`status ${vendor.status.toLowerCase()}`}>
                    {vendor.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn edit" onClick={() => {
                    setEditVendor(vendor);
                    setModalOpen(true);
                  }}>
                    Edit
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(vendor.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="no-data">No vendors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <VendorFormModal
          onClose={() => {
            setModalOpen(false);
            setEditVendor(null);
          }}
          onSave={handleSave}
          initialData={editVendor}
        />
      )}
    </div>
  );
};

export default Vendors;
