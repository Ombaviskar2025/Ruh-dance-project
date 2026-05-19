import React, { useState, useEffect, useRef } from 'react';
import WhatsAppSuccessPopup from './WhatsAppSuccessPopup';
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
  const [selectedDanceStyles, setSelectedDanceStyles] = useState([]);
  const [otherDanceStyle, setOtherDanceStyle] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // WhatsApp Success Popup states
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupConfig, setSuccessPopupConfig] = useState({
    title: '', subtitle: '', details: {}, whatsappMessage: ''
  });

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    setIsLogin(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const API_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://ruh-dance-project.onrender.com';
      const res = await axios.post(`${API_BASE}/api/auth/login/${role}`, loginData);
      
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
      let finalDanceStyle = regData.danceStyle;

      if (role === 'student') {
        let finalStyles = selectedDanceStyles.filter(s => s !== 'Other');
        if (selectedDanceStyles.includes('Other') && otherDanceStyle.trim() !== '') {
          finalStyles.push(otherDanceStyle.trim());
        }

        if (finalStyles.length === 0) {
          alert("Please select at least one preferred dance style.");
          return;
        }

        finalDanceStyle = finalStyles.join(', ');
      }

      const API_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://ruh-dance-project.onrender.com';
      await axios.post(`${API_BASE}/api/auth/register`, {
        ...regData,
        danceStyle: finalDanceStyle,
        role: role 
      });
      
      const welcomeMessage = `Hey Team Ruh 💃✨\nI just registered as a student on your website!\n\nHere are my registration details:\n- Name: ${regData.fullName}\n- Email: ${regData.email}\n- Phone: ${regData.phone || 'N/A'}\n- Preferred Dance Style(s): ${finalDanceStyle}\n- Role: Student\n\nI am super excited to join the Ruh family and start my classes! Please guide me with the batch joining and next steps. 💃🔥`;
      
      setSuccessPopupConfig({
        title: 'Registration Successful!',
        subtitle: `Welcome to the Ruh Family, ${regData.fullName}! We are excited to start this beautiful movement journey with you.`,
        details: {
          'Student Name': regData.fullName,
          'Dance Style(s)': finalDanceStyle,
          'Phone Number': regData.phone || 'N/A',
          'Assigned Role': 'Student'
        },
        whatsappMessage: welcomeMessage
      });
      
      setSelectedDanceStyles([]);
      setOtherDanceStyle('');
      setShowSuccessPopup(true);
    } catch (err) {
      alert("Registration Failed: " + (err.response?.data?.message || "Server Error"));
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt("Please enter your registered email address:");
    if (email) {
      try {
        const API_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://ruh-dance-project.onrender.com';
        await axios.post(`${API_BASE}/api/auth/forgot-password`, { email, role });
        alert("Success! Please check your Gmail inbox for the reset link.");
      } catch (err) {
        alert(err.response?.data?.message || "Error processing request.");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="login-modal-content">
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
            {role === 'instructor' ? (
              <input 
                type="text" 
                placeholder="Expertise / Dance Specialties Taught" 
                required 
                value={regData.danceStyle}
                onChange={(e) => setRegData({...regData, danceStyle: e.target.value})} 
              />
            ) : (
              <div className="dance-style-selection-wrapper" style={{ marginTop: '10px' }}>
                <label className="form-label-modern">Select Preferred Dance Style(s) <span style={{ color: '#ff477e' }}>*</span></label>
                
                <div className="custom-dropdown-container" ref={dropdownRef}>
                  <div 
                    className={`custom-dropdown-header ${isDropdownOpen ? 'active' : ''}`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="dropdown-selected-text">
                      {selectedDanceStyles.length > 0 
                        ? selectedDanceStyles.map(style => style === 'Other' ? (otherDanceStyle ? `Other: ${otherDanceStyle}` : 'Other') : style).join(', ') 
                        : 'Select Preferred Dance Style(s)'}
                    </span>
                    <span className="dropdown-arrow">{isDropdownOpen ? '▲' : '▼'}</span>
                  </div>
                  
                  {isDropdownOpen && (
                    <div className="custom-dropdown-list">
                      {['Semi-Classical', 'Ballet', 'Bollywood', 'Hip-Hop', 'Contemporary', 'Other'].map((style) => {
                        const isChecked = selectedDanceStyles.includes(style);
                        return (
                          <div 
                            key={style} 
                            className={`custom-dropdown-item ${isChecked ? 'selected' : ''}`}
                            onClick={() => {
                              if (selectedDanceStyles.includes(style)) {
                                setSelectedDanceStyles(selectedDanceStyles.filter(s => s !== style));
                              } else {
                                setSelectedDanceStyles([...selectedDanceStyles, style]);
                              }
                            }}
                          >
                            <input 
                              type="checkbox" 
                              checked={isChecked} 
                              readOnly 
                              className="custom-dropdown-checkbox"
                            />
                            <span className="custom-dropdown-item-text">{style}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className={`other-specify-container ${selectedDanceStyles.includes('Other') ? 'show' : ''}`} style={{ marginTop: '15px' }}>
                  <input
                    type="text"
                    placeholder="Please specify your dance style..."
                    value={otherDanceStyle}
                    onChange={(e) => setOtherDanceStyle(e.target.value)}
                    className="modern-form-input"
                    required={selectedDanceStyles.includes('Other')}
                    style={{ margin: 0 }}
                  />
                </div>
              </div>
            )}
            <button type="submit" className="submit-btn">CREATE ACCOUNT</button>
            <p className="toggle-text">
              Already have an account? <span onClick={() => setIsLogin(true)} style={{cursor: 'pointer', color: '#E491C9', fontWeight: 'bold'}}>Login here</span>
            </p>
          </form>
        )}
      </div>
      
      <WhatsAppSuccessPopup 
        isOpen={showSuccessPopup}
        onClose={handleSuccessPopupClose}
        title={successPopupConfig.title}
        subtitle={successPopupConfig.subtitle}
        details={successPopupConfig.details}
        whatsappMessage={successPopupConfig.whatsappMessage}
        buttonText="Complete Onboarding on WhatsApp"
      />
    </div>
  );
};

export default LoginModal;