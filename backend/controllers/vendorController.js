const Vendor = require('../models/vendorModel');

exports.getVendors = (req, res) => {
  Vendor.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.addVendor = (req, res) => {
  const newVendor = req.body;
  Vendor.add(newVendor, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, ...newVendor });
  });
};

exports.updateVendor = (req, res) => {
  const vendorId = req.params.id;
  const updatedData = req.body;
  Vendor.update(vendorId, updatedData, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: vendorId, ...updatedData });
  });
};

exports.deleteVendor = (req, res) => {
  const vendorId = req.params.id;
  Vendor.delete(vendorId, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Vendor deleted' });
  });
};

exports.countVendors = (req, res) => {
  Vendor.count((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0].count);
  });
};
