import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');
  const navigate = useNavigate();
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({
    fullName: '', 
    email: '', 
    password: '', 
    phone: '', 
    gender: 'Male', 
    age: '', 
    danceStyle: ''
  });

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sending email and password to the role-based login route
      const res = await axios.post(`https://ruh-danceproject.onrender.com/api/auth/login/${role}`, loginData);
      
      // Critical: Save these for ProtectedRoute and persistent login state
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role); 
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      onLoginSuccess(res.data.user);
      onClose();
      
      // Navigate to the specific dashboard based on role
      if (res.data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (res.data.user.role === 'instructor') {
        navigate('/instructor-dashboard');
      } else {
        navigate('/dashboard');
      }

      // Refresh to update the Navbar with the "Admin" or "Logout" links
      window.location.reload();

    } catch (err) {
      alert(err.response?.data?.message || "Invalid Credentials");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Register with the additional fields seen in your registration form
      await axios.post('https://ruh-danceproject.onrender.com/api/auth/register', {
        ...regData,
        role: role 
      });
      alert("Registration Successful! Please login.");
      setIsLogin(true);
    } catch (err) {
      alert("Registration Failed: " + (err.response?.data?.message || "Server Error"));
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt("Please enter your registered email address:");
    if (email) {
      try {
        await axios.post('https://ruh-danceproject.onrender.com/api/auth/forgot-password', { email, role });
        alert("Success! Please check your Gmail inbox for the reset link.");
      } catch (err) {
        alert(err.response?.data?.message || "Error processing request.");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-tabs">
          {['student',  'instructor'].map((tab) => (
            <button 
              key={tab}
              className={role === tab ? 'active' : ''} 
              onClick={() => { setRole(tab); setIsLogin(true); }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {isLogin ? (
          <form className="modal-form" onSubmit={handleLogin}>
            <h2>{role.toUpperCase()} LOGIN</h2>
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})} 
            />
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                required 
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})} 
                style={{ paddingRight: '45px' }}
              />
              <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#E491C9', display: 'flex', alignItems: 'center' }}>
                {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
              </span>
            </div>
            
            <button type="submit" className="submit-btn">LOGIN</button>
            
            {role !== 'admin' && (
              <p className="forgot-password-link" onClick={handleForgotPassword} style={{cursor: 'pointer', color: '#E491C9', marginTop: '10px', textAlign: 'center'}}>
                Forgot Password?
              </p>
            )}

            <p className="toggle-text">
              New user? <span onClick={() => setIsLogin(false)} style={{cursor: 'pointer', color: '#E491C9', fontWeight: 'bold'}}>Create an account</span>
            </p>
          </form>
        ) : (
          <form className="modal-form" onSubmit={handleRegister}>
            <h2>{role.toUpperCase()} REGISTRATION</h2>
            <input 
              type="text" 
              placeholder="Full Name" 
              required 
              onChange={(e) => setRegData({...regData, fullName: e.target.value})} 
            />
            <input 
              type="email" 
              placeholder="Email" 
              required 
              onChange={(e) => setRegData({...regData, email: e.target.value})} 
            />
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                required 
                onChange={(e) => setRegData({...regData, password: e.target.value})} 
                style={{ paddingRight: '45px' }}
              />
              <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#E491C9', display: 'flex', alignItems: 'center' }}>
                {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
              </span>
            </div>
            <input 
              type="text" 
              placeholder="Phone Number" 
              required 
              onChange={(e) => setRegData({...regData, phone: e.target.value})} 
            />
            <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
              <select 
                style={{ flex: 1, padding: '10px' }}
                onChange={(e) => setRegData({...regData, gender: e.target.value})}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input 
                style={{ flex: 1 }}
                type="number" 
                placeholder={role === 'instructor' ? "Years of Exp. or Age" : "Age"} 
                required 
                onChange={(e) => setRegData({...regData, age: e.target.value})} 
              />
            </div>
            <input 
              type="text" 
              placeholder={role === 'instructor' ? "Expertise / Dance Specialties Taught" : "Preferred Dance Style (e.g., Bollywood)"} 
              required 
              onChange={(e) => setRegData({...regData, danceStyle: e.target.value})} 
            />
            <button type="submit" className="submit-btn">CREATE ACCOUNT</button>
            <p className="toggle-text">
              Already have an account? <span onClick={() => setIsLogin(true)} style={{cursor: 'pointer', color: '#E491C9', fontWeight: 'bold'}}>Login here</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;