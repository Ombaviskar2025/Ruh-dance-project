import React from 'react';
import '../App.css';

const About = () => {
  return (
    <div className="fade-in modern-page-content">
      {/* Hero Section for About */}
      <section className="glass-hero-panel" style={{ margin: '0 auto', marginBottom: '60px', maxWidth: '900px' }}>
        <h2 className="hero-title-modern">The Story of Ruh</h2>
        <div style={{ width: '80px', height: '4px', background: '#E491C9', margin: '20px auto' }}></div>
        <p className="hero-desc-modern">
          "Ruh" (Soul) was founded in 2026 with a singular vision: to bridge the gap between 
          technical dance excellence and emotional healing. We don't just teach steps; 
          we teach the language of the soul.
        </p>
      </section>

      {/* Vision & Mission Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="glass-hero-panel" style={{ padding: '40px' }}>
          <h3 style={{ color: '#E491C9', fontSize: '1.8rem', marginBottom: '15px' }}>Our Vision</h3>
          <p style={{ color: '#F1E9E9', lineHeight: '1.6' }}>To become a global sanctuary where dance is recognized as a primary tool for artistic expression and mental well-being.</p>
        </div>
        <div className="glass-hero-panel" style={{ padding: '40px' }}>
          <h3 style={{ color: '#E491C9', fontSize: '1.8rem', marginBottom: '15px' }}>Our Mission</h3>
          <p style={{ color: '#F1E9E9', lineHeight: '1.6' }}>Empowering dancers through Dance Movement Therapy (DMT) and world-class production standards to tell stories that matter.</p>
        </div>
      </div>

      {/* Artistic Values */}
      <section style={{ marginTop: '80px', textAlign: 'center' }}>
        <h3 style={{ color: '#E491C9', fontSize: '2.2rem' }}>Our Core Values</h3>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap', gap: '20px' }}>
          <div className="glass-hero-panel" style={{ padding: '15px 30px', borderRadius: '50px' }}><strong>Authenticity</strong></div>
          <div className="glass-hero-panel" style={{ padding: '15px 30px', borderRadius: '50px' }}><strong>Inclusivity</strong></div>
          <div className="glass-hero-panel" style={{ padding: '15px 30px', borderRadius: '50px' }}><strong>Healing</strong></div>
          <div className="glass-hero-panel" style={{ padding: '15px 30px', borderRadius: '50px' }}><strong>Excellence</strong></div>
        </div>
      </section>
    </div>
  );
};

export default About;