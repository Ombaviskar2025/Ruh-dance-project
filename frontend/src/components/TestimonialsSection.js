import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TestimonialsSection.css';
import { LuStar } from 'react-icons/lu';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const API_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://ruh-dance-project.onrender.com';
        const res = await axios.get(`${API_BASE}/api/testimonials`);
        if (res.data.success) {
          setTestimonials(res.data.testimonials);
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      }
    };
    fetchTestimonials();
  }, []);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8; // Up to 8 degrees vertical tilt
    const rotateY = ((x - centerX) / centerX) * 8;  // Up to 8 degrees horizontal tilt
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = '';
  };

  if (testimonials.length === 0) return null; // Don't show if empty

  return (
    <section className="testimonials-wrapper fade-in">
      <div className="testimonials-badge">TESTIMONIALS</div>
      <h2 className="testimonials-title">What <span>Students</span> Say</h2>
      <p className="testimonials-subtitle">Hear from our students who transformed their dance journey and found their true expression.</p>
      
      <div className="testimonials-grid">
        {testimonials.slice(0, 3).map((testim) => (
          <div 
            className="testimonial-card" 
            key={testim._id}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="quote-icon">"</div>
            <div className="rating-stars">
              {[...Array(testim.rating)].map((_, i) => (
                <LuStar key={i} fill="#f39c12" color="#f39c12" size={18} />
              ))}
              {[...Array(5 - testim.rating)].map((_, i) => (
                <LuStar key={`empty-${i}`} color="rgba(255,255,255,0.2)" size={18} />
              ))}
            </div>
            
            <p className="testimonial-text">
              {testim.text}
            </p>
            
            <div className="student-info">
              {testim.studentPhoto ? (
                <img src={testim.studentPhoto} alt={testim.studentName} className="student-photo" />
              ) : (
                <div className="student-avatar-placeholder">
                  {testim.studentName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="student-details">
                <h4>{testim.studentName}</h4>
                <span>{testim.danceStyle}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
