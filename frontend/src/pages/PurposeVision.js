import React from 'react';
import '../App.css';

const PurposeVision = () => {
  return (
    <div className="fade-in modern-page-content" style={{ marginTop: '30px' }}>
      {/* Header Section */}
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 className="hero-title-modern" style={{ fontSize: '3.5rem' }}>Purpose & Vision</h1>
        <p className="hero-desc-modern" style={{ maxWidth: '800px' }}>
          At RUH Dance Production, we believe that movement is the ultimate language of the soul. We are committed to bridging the profound heritage of classical arts with the dynamic pulse of modern expression.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Purpose Section */}
        <section className="glass-hero-panel" style={{ padding: '50px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '20px', borderRadius: '50%', background: 'rgba(228, 145, 201, 0.1)', boxShadow: '0 0 20px rgba(228, 145, 201, 0.2)' }}>
              <svg viewBox="0 0 24 24" width="36" height="36" fill="#E491C9">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h2 style={{ color: '#E491C9', fontSize: '2.2rem', margin: 0, fontFamily: "'Playfair Display', serif" }}>Our Purpose</h2>
          </div>
          <p style={{ color: '#d1d5db', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '25px' }}>
            Our fundamental purpose is to cultivate a secure, centralized sanctuary for the dance community where artistry meets cutting-edge technology. We exist to simplify the logistics of learning so that our students can focus entirely on their creative evolution.
          </p>
          <ul style={{ color: '#F1E9E9', listStyleType: 'none', padding: 0, fontSize: '1.05rem', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '18px', paddingLeft: '35px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#E491C9', fontSize: '1.4rem' }}>✦</span>
              <strong>Empowering Instructors:</strong> Equipping our world-class choreographers with professional tools to seamlessly manage schedules, curate routines, and independently interact with students in real-time.
            </li>
            <li style={{ marginBottom: '18px', paddingLeft: '35px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#E491C9', fontSize: '1.4rem' }}>✦</span>
              <strong>Student-Centric Interface:</strong> Offering a digital ecosystem where students easily explore disciplines like Kathak and Ballet, track their progress, and enroll in masterclasses effortlessly.
            </li>
            <li style={{ marginBottom: '18px', paddingLeft: '35px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#E491C9', fontSize: '1.4rem' }}>✦</span>
              <strong>Preserving Authenticity:</strong> Upholding the sacred, rigorous traditions of classical Indian arts while rendering them highly accessible through modern full-stack web platforms and contemporary pedagogy.
            </li>
          </ul>
        </section>

        {/* Vision Section */}
        <section className="glass-hero-panel" style={{ padding: '50px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '20px', borderRadius: '50%', background: 'rgba(228, 145, 201, 0.1)', boxShadow: '0 0 20px rgba(228, 145, 201, 0.2)' }}>
              <svg viewBox="0 0 24 24" width="36" height="36" fill="#E491C9">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            </div>
            <h2 style={{ color: '#E491C9', fontSize: '2.2rem', margin: 0, fontFamily: "'Playfair Display', serif" }}>Our Vision</h2>
          </div>
          <p style={{ color: '#d1d5db', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '25px' }}>
            We envision an expansive global future where geographic limitations disappear. RUH is destined to be a beacon of artistic excellence, intertwining technological innovation with the raw emotion of physical performance.
          </p>
          <ul style={{ color: '#F1E9E9', listStyleType: 'none', padding: 0, fontSize: '1.05rem', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '18px', paddingLeft: '35px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#E491C9', fontSize: '1.4rem' }}>✦</span>
              <strong>Global Virtual Productions:</strong> Expanding our digital reach by hosting monumental virtual dance showcases, allowing dancers across the world to participate and witness our annual productions.
            </li>
            <li style={{ marginBottom: '18px', paddingLeft: '35px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#E491C9', fontSize: '1.4rem' }}>✦</span>
              <strong>Tech-Integrated Academy:</strong> Operating a premier MERN stack architecture that guarantees enterprise-grade data security, student privacy, and lightning-fast streaming for digital tutorials.
            </li>
            <li style={{ marginBottom: '18px', paddingLeft: '35px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#E491C9', fontSize: '1.4rem' }}>✦</span>
              <strong>A Legacy of Excellence:</strong> Cementing the "RUH" name as the gold standard in dance education—synonymous with discipline, cultural reverence, and boundless creative freedom.
            </li>
          </ul>
        </section>
      </div>

      <div style={{ marginTop: '60px', textAlign: 'center', opacity: 0.8 }}>
        <p style={{ fontStyle: 'italic', color: '#d1d5db', fontSize: '1.1rem' }}>“To dance is to be out of yourself. Larger, more beautiful, more powerful.”</p>
      </div>
    </div>
  );
};

export default PurposeVision;