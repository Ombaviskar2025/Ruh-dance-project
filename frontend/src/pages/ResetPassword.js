import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match!");

    try {
      const res = await axios.post(`https://ruh-danceproject.onrender.com/api/auth/reset-password/${token}`, { password });
      alert(res.data.message);
      navigate('/'); 
    } catch (err) {
      alert(err.response?.data?.message || "Link invalid or expired.");
    }
  };

  return (
    <div className="reset-page-wrapper">
      <div className="reset-card">
        <h2 className="reset-title">RESET PASSWORD</h2>
        <p className="reset-subtitle">Enter your new secure password below.</p>
        <form onSubmit={handleSubmit} className="reset-form">
          <input 
            type="password" 
            placeholder="New Password" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Confirm New Password" 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="reset-submit-btn">
            UPDATE PASSWORD
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;