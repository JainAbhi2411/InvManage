const bcrypt = require('bcrypt');
const { createUser, findUserByEmail } = require('../models/userModel');


const register = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  findUserByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (results.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = { name, email, password: hashedPassword, role };
    createUser(user, (err, result) => {
      if (err) return res.status(500).json({ message: 'Error creating user.' });

      res.status(201).json({ message: 'User registered successfully.' });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });

  findUserByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (results.length === 0)
      return res.status(404).json({ message: 'User not found.' });

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
};



module.exports = { register, login };
