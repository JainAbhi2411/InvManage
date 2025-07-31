import React, { useState } from 'react';
import '../styles/Settings.css';

const Settings = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '',
    darkMode: false,
    notifyEmail: true,
    notifySMS: false,
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({
      ...profile,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = () => {
    console.log('Saved Settings:', profile);
    alert('Settings saved (dummy save)');
  };

  return (
    

    <div className="settings-container">
      {/* Inline warning banner */}
      <div className="settings-warning">
        ⚠️ This is a demo settings page. Changes will not be saved permanently.
      </div>
      
      <h2>⚙️ Settings</h2>

      <div className="section">
        <h3>👤 Profile Info</h3>
        <input type="text" name="name" placeholder="Full Name" value={profile.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={profile.email} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone Number" value={profile.phone} onChange={handleChange} />
      </div>

      <div className="section">
        <h3>🎨 Preferences</h3>
        <label>
          <input type="checkbox" name="darkMode" checked={profile.darkMode} onChange={handleChange} />
          Enable Dark Mode
        </label>
      </div>

      <div className="section">
        <h3>🔔 Notifications</h3>
        <label>
          <input type="checkbox" name="notifyEmail" checked={profile.notifyEmail} onChange={handleChange} />
          Email Notifications
        </label>
        <label>
          <input type="checkbox" name="notifySMS" checked={profile.notifySMS} onChange={handleChange} />
          SMS Notifications
        </label>
      </div>

      <div className="section">
        <h3>🔐 Change Password</h3>
        <input type="password" name="password" placeholder="New Password" value={profile.password} onChange={handleChange} />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={profile.confirmPassword} onChange={handleChange} />
      </div>

      <button className="save-btn" onClick={handleSave}>💾 Save Settings</button>
    </div>
  );
};

export default Settings;
