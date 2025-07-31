import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../api/api';
import '../styles/AuthForm.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'vendor',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'vendor'
      });
      setSuccess(data.message);
      alert("Registration successful!");

      // ✅ Redirect to dashboard
      navigate('/dashboard');
    } else {
      alert(data.message || 'Registration failed.');
    }
  } catch (error) {
    console.error('Registration error:', error);
    setError(error)
    alert('An error occurred during registration.');
  }
};

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img
          src="https://static.vecteezy.com/system/resources/previews/003/689/228/original/online-registration-or-sign-up-login-for-account-on-smartphone-app-user-interface-with-secure-password-mobile-application-for-ui-web-banner-access-cartoon-people-illustration-vector.jpg"
          alt="Inventory Illustration"
        />
      </div>
      <div className="auth-right">
        <div className="auth-box">
          <h2 className="auth-title">Create Your Account</h2>

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <form onSubmit={handleSubmit}>
            <label className="auth-label">Name</label>
            <input
              className="auth-input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />

            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />

            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="******"
              required
            />

            <label className="auth-label">Role</label>
            <select
              className="auth-input"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="vendor">Vendor</option>
              <option value="inventory_manager">Inventory Manager</option>
            </select>

            <button type="submit" className="auth-button">Register</button>
          </form>
          <div className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
