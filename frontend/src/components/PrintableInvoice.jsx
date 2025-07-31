import React, { useState } from 'react';

const PrintableInvoice = ({ order }) => {
  const [adminName, setAdminName] = useState('');

  if (!order) return null;

  return (
    <div id="printable-invoice" style={styles.invoiceWrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>🧾</div>
        <div>
          <h2 style={styles.businessName}>My Business Pvt. Ltd.</h2>
          <p>123 Market Road, Delhi, India</p>
          <p>Email: contact@mybusiness.com | Phone: +91 98765 43210</p>
        </div>
      </div>

      {/* Invoice Info */}
      <div style={styles.infoSection}>
        <div><strong>Order No:</strong> {order.so_number}</div>
        <div><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</div>
        <div><strong>Customer:</strong> {order.customer_name}</div>
        <div><strong>Status:</strong> {order.status}</div>
      </div>

      {/* Items Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Item</th>
            <th style={styles.th}>Qty</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={idx}>
              <td style={styles.td}>{item.item_name}</td>
              <td style={styles.td}>{item.quantity}</td>
              <td style={styles.td}>₹{item.price}</td>
              <td style={styles.td}>₹{item.quantity * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div style={styles.totalBox}>
        <strong>Total Amount: ₹{order.total}</strong>
      </div>

      {/* Footer with Signature */}
      <div style={styles.footer}>
        <p>Thank you for your purchase!</p>

        {/* Signature Input (Hidden when printing) */}
        <div className="signature-area">
          
          <input
            type="text"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            placeholder="Enter your name"
            className="admin-sign-input"
          />
          <p className="admin-signature">Signed by: <strong>{adminName || '________________'}</strong></p>
        </div>
      </div>

      {/* Inline CSS */}
      <style>
        {`
          @media print {
            .admin-sign-input {
              display: none;
            }
          }

          .signature-area {
            text-align: center;
            margin-top: 30px;
          }

          .admin-sign-input {
            margin-top: 8px;
            padding: 6px 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 250px;
          }

          .admin-signature {
            margin-top: 12px;
            font-size: 16px;
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  invoiceWrapper: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '700px',
    margin: '0 auto',
    color: '#333',
  },
  header: {
    display: 'flex',
    gap: '20px',
    borderBottom: '2px solid #ccc',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  logo: {
    fontSize: '36px',
  },
  businessName: {
    margin: 0,
    fontSize: '22px',
    color: '#2c3e50',
  },
  infoSection: {
    marginBottom: '20px',
    lineHeight: '1.8',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  th: {
    background: '#f8f9fa',
    border: '1px solid #ccc',
    padding: '8px',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #ccc',
    padding: '8px',
  },
  totalBox: {
    textAlign: 'right',
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '40px',
    fontStyle: 'italic',
  }
};

export default PrintableInvoice;
