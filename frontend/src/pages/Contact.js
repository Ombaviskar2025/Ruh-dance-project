import React from 'react';
import '../App.css';

const Contact = () => {
  return (
    <div className="fade-in modern-page-content" style={{ marginTop: '30px' }}>
      <header style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 className="hero-title-modern" style={{ fontSize: '3rem' }}>Get In Touch</h1>
        <p className="hero-desc-modern">We would love to hear from you. Connect with us through our aesthetic channels.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* WhatsApp Card */}
        <section className="glass-hero-panel" style={{ padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #25D366, #128C7E)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 10px 20px rgba(37, 211, 102, 0.4)' }}>
             <svg viewBox="0 0 24 24" width="40" height="40" fill="white">
               <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.69 4.19 1.87 5.86L3 22l4.28-.86C8.83 22.05 10.37 22.5 12 22.5c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.5c-1.63 0-3.18-.39-4.57-1.07l-.33-.16-2.52.5.51-2.45-.17-.32A8.44 8.44 0 0 1 3.5 12c0-4.69 3.81-8.5 8.5-8.5 4.69 0 8.5 3.81 8.5 8.5s-3.81 8.5-8.5 8.5zm4.61-6.12c-.25-.13-1.49-.74-1.72-.82-.23-.08-.4-.13-.57.13-.17.25-.65.82-.8 1-.15.18-.3.2-.55.08A6.87 6.87 0 0 1 10 13c-1.12-1.25-1.88-2.8-2.1-3.18-.23-.38 0-.58.13-.7.11-.11.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.33-.02-.45-.06-.13-.57-1.38-.78-1.9-.21-.5-.42-.43-.57-.44H6.87c-.21 0-.55.08-.84.4A2.5 2.5 0 0 0 5 8c0 1.5 1.55 2.94 1.76 3.23.21.28 2.2 3.36 5.33 4.71 1.05.45 1.87.72 2.51.92.51.16 1.06.14 1.48.09.47-.06 1.49-.61 1.7-1.2.21-.6.21-1.12.15-1.2h-.57z"/>
             </svg>
          </div>
          <h2 style={{ color: '#F1E9E9', fontSize: '1.6rem', marginBottom: '10px' }}>WhatsApp</h2>
          <p style={{ color: '#d1d5db', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '20px' }}>
            Reach out instantly for general inquiries and batch details.
          </p>
          <a href="https://wa.me/9822202239" target="_blank" rel="noopener noreferrer" className="modern-btn" style={{ textDecoration: 'none', background: '#25D366', color: '#15173D', width: '100%' }}>Chat with Us</a>
        </section>

        {/* Instagram Card */}
        <section className="glass-hero-panel" style={{ padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 10px 20px rgba(220, 39, 67, 0.4)' }}>
             <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
               <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
               <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
             </svg>
          </div>
          <h2 style={{ color: '#F1E9E9', fontSize: '1.6rem', marginBottom: '10px' }}>Instagram</h2>
          <p style={{ color: '#d1d5db', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '20px' }}>
            Follow our aesthetic journey and latest production reels.
          </p>
          <a href="https://www.instagram.com/rujutaa_wakhare?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="modern-btn" style={{ textDecoration: 'none', width: '100%' }}>@rujutaa_wakhare</a>
        </section>

        {/* Studio & Info Card */}
        <section className="glass-hero-panel" style={{ padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(228, 145, 201, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}>
             <svg viewBox="0 0 24 24" width="40" height="40" fill="#E491C9">
               <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
             </svg>
          </div>
          <h2 style={{ color: '#F1E9E9', fontSize: '1.6rem', marginBottom: '10px' }}>Studio Information</h2>
          <p style={{ color: '#d1d5db', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '20px' }}>
            Experience RUH firsthand at our physical batches.
          </p>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '10px', width: '100%', maxWidth: '100%' }}>
            <p style={{ margin: '10px 0', color: '#E491C9', fontWeight: 'bold', fontSize: '0.9rem' }}>📍 Main Studio Address:</p>
            <p style={{ margin: '5px 0', color: '#F1E9E9', fontSize: '1rem' }}>Ruh Dance Production HQ</p>
            <p style={{ margin: '5px 0', color: '#d1d5db', fontSize: '0.85rem' }}>Available upon inquiry</p>
            <p style={{ margin: '20px 0 10px 0', color: '#E491C9', fontWeight: 'bold', fontSize: '0.9rem' }}>✉️ Email Admissions:</p>
            <p style={{ margin: '5px 0', color: '#F1E9E9', fontSize: '1rem' }}>sneha.hosadodde2004@gmail.com</p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Contact;
