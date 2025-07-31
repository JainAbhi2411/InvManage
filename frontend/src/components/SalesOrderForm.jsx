import React, { useState } from 'react';
import { api } from '../api/api';
import '../styles/SalesOrderForm.css';

const SalesOrderForm = ({ inventory, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    customer: '',
    items: [{ id: '', quantity: 1, sellingPrice: 0, purchasePrice: 0 }],
  });

  const handleItemChange = (e, idx) => {
  const updatedItems = [...form.items];
  const { name, value } = e.target;

  if (name === 'id') {
    const selectedItem = inventory.find(item => item.id === parseInt(value));
    if (selectedItem) {
      updatedItems[idx].id = selectedItem.id;
      updatedItems[idx].purchasePrice = selectedItem.price;
      updatedItems[idx].sellingPrice = selectedItem.price;
      updatedItems[idx].quantity = 1;
    }
  } else if (name === 'quantity') {
    const itemId = parseInt(updatedItems[idx].id);
    const selectedItem = inventory.find(item => item.id === itemId);
    const enteredQty = parseInt(value);

    if (selectedItem && enteredQty > selectedItem.quantity) {
      alert(`Only ${selectedItem.quantity} items in stock.`);
      return;
    }

    updatedItems[idx][name] = enteredQty;
  } else {
    updatedItems[idx][name] = value;
  }

  setForm({ ...form, items: updatedItems });
};
  const addItemRow = () => {
    setForm({
      ...form,
      items: [...form.items, { id: '', quantity: 1, sellingPrice: 0, purchasePrice: 0 }],
    });
  };

  const removeItemRow = (idx) => {
    if (form.items.length === 1) return;
    const updated = form.items.filter((_, i) => i !== idx);
    setForm({ ...form, items: updated });
  };

  const createOrder = async () => {
    if (!form.customer.trim()) return alert("Please enter customer name.");

    try {
      await api.post('/sales', {
        customer: form.customer,
        items: form.items.map(item => ({
          name: inventory.find(inv => inv.id === parseInt(item.id))?.name || '',
          quantity: parseInt(item.quantity),
          price: parseFloat(item.sellingPrice),
        })),
      });
      onSubmit();
      onClose();
    } catch (err) {
      console.error('Sales Order Creation Failed:', err);
    }
  };

  const totalCost = form.items.reduce((acc, item) => acc + (item.sellingPrice * item.quantity), 0);
  const totalProfit = form.items.reduce((acc, item) => {
    const profit = (item.sellingPrice - item.purchasePrice) * item.quantity;
    return acc + profit;
  }, 0);

  return (
    <div className="so-overlay">
      <div className="so-modal">
        <div className="so-header">
          <h2>🧾 Create Sales Order</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="so-body">
          <div className="input-group">
            <label>Customer Name</label>
            <input
              type="text"
              placeholder="Enter customer name"
              value={form.customer}
              onChange={e => setForm({ ...form, customer: e.target.value })}
            />
          </div>

          <div className="so-items-header">
            <span>Item</span>
            <span>Qty</span>
            <span>Purchase ₹</span>
            <span>Selling ₹</span>
            <span>Total ₹</span>
            <span>Profit ₹</span>
            <span>Action</span>
          </div>

          {form.items.map((item, idx) => {
            const subtotal = item.quantity * item.sellingPrice;
            const profit = (item.sellingPrice - item.purchasePrice) * item.quantity;

            return (
              <div key={idx} className="so-item-row">
                <select name="id" value={item.id} onChange={e => handleItemChange(e, idx)}>
                <option value="">Select</option>
                {inventory
                    .filter(inv => inv.quantity > 0)
                    .map(inv => (
                    <option key={inv.id} value={inv.id}>
                        {inv.name} ({inv.quantity} left)
                    </option>
                ))}
                </select>

                <input
                  name="quantity"
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => handleItemChange(e, idx)}
                />

                <input type="number" value={item.purchasePrice} disabled />

                <input
                  name="sellingPrice"
                  type="number"
                  min="0"
                  value={item.sellingPrice}
                  onChange={e => handleItemChange(e, idx)}
                />

                <span>₹{subtotal}</span>
                <span style={{ color: profit >= 0 ? 'green' : 'red' }}>
                  ₹{profit}
                </span>

                <button className="remove" onClick={() => removeItemRow(idx)}>❌</button>
              </div>
            );
          })}

          <div className="add-btn-container">
            <button className="add-item" onClick={addItemRow}>➕ Add Item</button>
          </div>

          <div className="totals">
            <p><strong>Total Cost:</strong> ₹{totalCost}</p>
            <p><strong>Net Profit:</strong> <span style={{ color: totalProfit >= 0 ? 'green' : 'red' }}>₹{totalProfit}</span></p>
          </div>
          <div className="invoice-preview">
            <h4>🧾 Invoice Preview</h4>
            <div className="invoice-table">
            <div className="invoice-header">
                <span>Item</span>
                <span>Qty</span>
                <span>Price ₹</span>
                <span>Total ₹</span>
            </div>
            {form.items.map((item, idx) => {
                const inv = inventory.find(i => i.id === parseInt(item.id));
                const total = item.quantity * item.sellingPrice;
                return (
                <div className="invoice-row" key={idx}>
                    <span>{inv?.name || '—'}</span>
                    <span>{item.quantity}</span>
                    <span>₹{item.sellingPrice}</span>
                    <span>₹{total}</span>
                </div>
                );
            })}
            <div className="invoice-footer">
                <strong>Total: ₹{totalCost}</strong>
            </div>
            </div>
            </div>

          <div className="action-buttons">
            <button className="submit" onClick={createOrder}>✅ Create Order</button>
            <button className="cancel" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderForm;
