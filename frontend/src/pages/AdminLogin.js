import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LuEye, LuEyeOff } from 'react-icons/lu';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Using your existing admin login endpoint
            const res = await axios.post('https://ruh-dance-project.onrender.com/api/auth/login/admin', { email, password });
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', 'admin');
            localStorage.setItem('user', JSON.stringify(res.data.user));

            alert("Admin Access Granted");
            navigate('/admin-dashboard');
            window.location.reload(); 
        } catch (err) {
            alert(err.response?.data?.message || "Invalid Admin Credentials");
        }
    };

    return (
        <div className="home-aesthetic-container fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleLogin} className="glass-hero-panel" style={{ padding: '40px', width: '350px' }}>
                <h2 style={{ textAlign: 'center', color: '#E491C9', marginBottom: '30px', fontSize: '1.8rem', fontFamily: "'Playfair Display', serif" }}>RUH ADMIN PORTAL</h2>
                <input 
                    type="email" 
                    placeholder="Admin Email" 
                    required 
                    style={{ background: 'rgba(0,0,0,0.2)', color: '#F1E9E9', width: '100%', padding: '15px', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div style={{ position: 'relative', width: '100%', marginBottom: '25px' }}>
                  <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Password" 
                      required 
                      style={{ background: 'rgba(0,0,0,0.2)', color: '#F1E9E9', width: '100%', padding: '15px', paddingRight: '45px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                  <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#E491C9', display: 'flex', alignItems: 'center' }}>
                    {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                  </span>
                </div>
                <button type="submit" className="modern-btn" style={{ width: '100%', padding: '15px', cursor: 'pointer', fontWeight: 'bold' }}>
                    LOGIN TO CONTROL PANEL
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;