import React from 'react';
import './Vendors.css';

const Vendors = () => {
  return (
    <div className="vendors-container">
      <div className="vendors-header">
        <h1>Vendors</h1>
        <button className="add-vendor-button">+ Add Vendor</button>
      </div>

      <div className="vendors-table-container">
        <table className="vendors-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Dummy row for now */}
            <tr>
              <td>John Doe</td>
              <td>Acme Corp</td>
              <td>john@acme.com</td>
              <td>+91-9876543210</td>
              <td>
                <button>Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vendors;
