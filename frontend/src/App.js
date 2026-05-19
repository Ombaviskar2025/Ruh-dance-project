import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
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
    const fetchAndApplyTheme = async () => {
      try {
        const res = await axios.get('https://ruh-dance-project.onrender.com/api/settings');
        if (res.data.success && res.data.data.theme) {
          const theme = res.data.data.theme;
          Object.entries(theme).forEach(([key, val]) => {
            const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            document.documentElement.style.setProperty(cssVarName, val);
          });
        }
      } catch (err) {
        console.error("Failed to load website theme settings", err);
      }
    };
    fetchAndApplyTheme();
  }, []);

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
        <a href="https://wa.me/9822202239?text=Hey%20Team%20Ruh%20%F0%9F%92%83%E2%9C%A8%0AI%20just%20visited%20your%20website%20and%20loved%20it%21%0AI%20want%20to%20know%20more%20about%20your%20dance%20classes%20and%20registration%20process." target="_blank" rel="noopener noreferrer" className="social-icon whatsapp-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.852.002-2.632-1.023-5.105-2.887-6.97C16.579 1.968 14.1 .94 11.47 1.01 6.039 1.01 1.62 5.429 1.615 10.86c-.001 1.702.453 3.361 1.314 4.816L1.97 21.03l5.652-1.482c.026.012.052.025.078.036zm11.233-6.52c-.28-.14-1.65-.815-1.905-.907-.255-.092-.44-.137-.625.14-.185.276-.713.906-.874 1.092-.16.185-.32.208-.6.068-.28-.14-1.18-.435-2.25-1.39-.83-.74-1.39-1.653-1.55-1.93-.16-.28-.018-.43.12-.57.126-.127.28-.328.42-.492.14-.165.187-.282.28-.47.094-.188.047-.35-.022-.49-.07-.14-.625-1.507-.857-2.07-.225-.548-.453-.473-.625-.482-.16-.008-.344-.01-.53-.01-.186 0-.49.07-.747.35-.257.28-.98 0.957-.98 2.333s1.002 2.707 1.14 2.893c.14.185 1.97 3.01 4.775 4.22.667.288 1.187.46 1.593.589.67.213 1.28.183 1.76.11.536-.08 1.65-.675 1.884-1.326.234-.652.234-1.21.165-1.326-.07-.11-.256-.184-.536-.324z"/>
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
