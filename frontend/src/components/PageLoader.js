import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './PageLoader.css';

const PageLoader = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    // Smooth transition delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); 

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div className="modern-page-loader">
      <div className="loader-content">
        <div className="loader-glow"></div>
        <img src="https://i.pinimg.com/1200x/b3/3a/8e/b33a8edcb3ff5e4b4faeab6e4551ddfa.jpg" alt="RUH Logo" className="loader-logo-pulse" />
        <h2 className="loader-text">RUH <br/><span>Dance Production</span></h2>
      </div>
    </div>
  );
};

export default PageLoader;
