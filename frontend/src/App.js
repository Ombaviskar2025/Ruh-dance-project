import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginModal from './components/LoginModal';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import { LuLayoutGrid, LuLogOut, LuMenu, LuX } from "react-icons/lu";
import PageLoader from './components/PageLoader';

// Lazy load all heavy page components for massive performance boost
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Styles = lazy(() => import('./pages/Styles'));
const Productions = lazy(() => import('./pages/Productions'));
const Events = lazy(() => import('./pages/Events'));
const Dmt = lazy(() => import('./pages/Dmt'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const InstructorDashboard = lazy(() => import('./pages/InstructorDashboard'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Purpose = lazy(() => import('./pages/PurposeVision'));
const Contact = lazy(() => import('./pages/Contact'));
const Gallery = lazy(() => import('./pages/Gallery'));

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Store user data
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); // Get user info stored during login
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }

  }, []);
  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData); // This updates the UI name immediately without refresh
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    window.location.href = "/";
  };



  return (
    <div className="home-aesthetic-container">
      {/* Floating Social Icons */}
      <div className="floating-social-icons">
        <a href="https://www.instagram.com/rujutaa_wakhare?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="social-icon instagram-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
        <a href="https://wa.me/9822202239" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </a>
      </div>

      {/* Ambient Glowing Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>
      <Router>
        <PageLoader />
        <header className="main-header modern-glass-header">
          <div className="header-container">
            <div className="logo-section">
              <Link to="/" className="logo-link">
                <img src="https://i.pinimg.com/1200x/b3/3a/8e/b33a8edcb3ff5e4b4faeab6e4551ddfa.jpg" alt="logo" className="logo-icon" />
                <div>
                  <h1 className="logo-text">RUH</h1>
                  <span className="logo-subtext">Dance Production</span>
                </div>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
              <LuMenu size={28} color="#fff" />
            </button>

            {/* Desktop Navigation */}
            <nav className="nav-bar desktop-nav">
              <Link to="/" className="nav-tab">HOME</Link>
              <Link to="/about" className="nav-tab">ABOUT</Link>
              
              <div className="nav-dropdown-container">
                <span className="nav-tab" style={{cursor: 'pointer'}}>WHAT WE SERVE ▼</span>
                <div className="nav-dropdown-menu">
                  <Link to="/styles" className="nav-dropdown-item">DANCE STYLES</Link>
                  <Link to="/productions" className="nav-dropdown-item">PRODUCTIONS</Link>
                  <Link to="/events" className="nav-dropdown-item">EVENTS</Link>
                  <Link to="/dmt" className="nav-dropdown-item">DMT</Link>
                </div>
              </div>

              <Link to="/purpose" className="nav-tab">PURPOSE & VISION</Link>
              <Link to="/gallery" className="nav-tab">GALLERY</Link>
              <Link to="/contact" className="nav-tab">CONTACT</Link>

              {/* {isLoggedIn ? (
              <span className="nav-tab signin-tab-option" onClick={handleLogout}>LOGOUT</span>
            ) : (
              <span className="nav-tab signin-tab-option" onClick={() => setIsLoginOpen(true)}>SIGN IN</span>
            )} */}
              {isLoggedIn ? (
                <div className="user-profile-container">
                  <div className="user-info" onClick={() => setShowDropdown(!showDropdown)}>
                    <span className="user-name">{user?.username || user?.fullName || "Student"}</span>
                    <div className="user-avatar-circle">
                      {/* FontAwesome or a simple SVG human icon */}
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  </div>

                  {showDropdown && (
                    <div className="user-dropdown">
                      <div className="dropdown-header">
                        <span className="dropdown-role">{user?.role}</span>
                        <div className="dropdown-user-email">{user?.email}</div>
                      </div>
                      <Link
                        to={user?.role === 'admin' ? '/admin-dashboard' : user?.role === 'instructor' ? '/instructor-dashboard' : '/dashboard'}
                        className="dropdown-nav-btn"
                        onClick={() => setShowDropdown(false)}
                      >
                        <LuLayoutGrid size={16} /> DASHBOARD
                      </Link>
                      <button onClick={handleLogout} className="dropdown-logout-btn">
                        <LuLogOut size={16} /> LOGOUT
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <span className="nav-tab signin-tab-option" onClick={() => setIsLoginOpen(true)}>
                  SIGN IN
                </span>
              )}
            </nav>
          </div>
        </header>

        {/* Mobile Sidebar */}
        <div className={`mobile-sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-sidebar-header">
            <button className="close-sidebar-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <LuX size={32} color="#333" />
            </button>
          </div>
          <div className="mobile-sidebar-links">
            <Link to="/" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link to="/styles" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Dance Styles</Link>
            <Link to="/productions" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Productions</Link>
            <Link to="/events" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Events</Link>
            <Link to="/dmt" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>DMT</Link>
            <Link to="/purpose" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Purpose & Vision</Link>
            <Link to="/gallery" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Gallery</Link>
            <Link to="/contact" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            
            {isLoggedIn ? (
               <Link to={user?.role === 'admin' ? '/admin-dashboard' : user?.role === 'instructor' ? '/instructor-dashboard' : '/dashboard'} className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
            ) : (
               <span className="mobile-link" onClick={() => { setIsMobileMenuOpen(false); setIsLoginOpen(true); }}>Sign In</span>
            )}
            {isLoggedIn && (
               <span className="mobile-link logout-mobile-link" onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}>Logout</span>
            )}
          </div>
        </div>

        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/styles" element={<Styles />} />
            <Route path="/productions" element={<Productions />} />
            <Route path="/events" element={<Events />} />
            <Route path="/dmt" element={<Dmt />} />
            <Route path="/purpose" element={<Purpose />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin-dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/ruh-admin-portal-login" element={<AdminLogin />} />
            <Route path="/dashboard" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
            <Route path="/instructor-dashboard" element={<ProtectedRoute allowedRole="instructor"><InstructorDashboard /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
