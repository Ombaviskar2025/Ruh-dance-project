import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import './Dmt.css';

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM',
];

const SESSION_TYPES = ['Individual', 'Group', 'Online'];

const SESSION_GOALS = [
  'Emotional Healing',
  'Stress Reduction',
  'Trauma Recovery',
  'Self-Exploration',
  'Physical Rehabilitation',
  'Other',
];

const BENEFITS = [
  { icon: '💫', title: 'Emotional Healing', desc: 'Express feelings that words cannot capture through mindful, creative movement.' },
  { icon: '🌿', title: 'Stress Reduction', desc: 'Use rhythm and flow to release physical tension and calm mental anxiety.' },
  { icon: '🔄', title: 'Trauma Recovery', desc: 'Gently process past experiences through body-based therapeutic movement.' },
  { icon: '🧘', title: 'Self-Exploration', desc: 'Discover deeper layers of yourself through expressive movement and mindfulness.' },
  { icon: '💪', title: 'Physical Rehab', desc: 'Restore mobility and coordination through therapeutic movement practices.' },
  { icon: '🎵', title: 'Mind-Body Unity', desc: 'Align your mental and physical self for holistic well-being and balance.' },
];

const initialForm = {
  name: '', email: '', phone: '',
  sessionType: 'Individual', sessionGoal: 'Emotional Healing',
  date: '', time: '', notes: '',
};

const Dmt = () => {
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState(initialForm);
  const [step, setStep]             = useState(1); // 1 = details, 2 = schedule, 3 = success
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [myBookings, setMyBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);

  // Pre-fill from localStorage if user is logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.fullName)  setForm(f => ({ ...f, name: user.fullName }));
    if (user?.email)     setForm(f => ({ ...f, email: user.email }));
    if (user?.phone)     setForm(f => ({ ...f, phone: user.phone || '' }));
  }, []);

  const fetchMyBookings = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?._id) return;
    try {
      const res = await axios.get(`https://ruh-dance-project.onrender.com/api/dmt-bookings/my-bookings/${user._id}`);
      setMyBookings(res.data);
    } catch { /* silent */ }
  };

  const openModal = () => {
    setStep(1); setError(''); setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => { setStep(1); setError(''); }, 300);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNextStep = () => {
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in Name, Email and Phone before continuing.'); return;
    }
    setError(''); setStep(2);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.date || !form.time) { setError('Please choose a date and time slot.'); return; }
    setLoading(true); setError('');
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await axios.post('https://ruh-dance-project.onrender.com/api/dmt-bookings', {
        ...form,
        studentId: user?._id || null,
      });
      setStep(3);
      fetchMyBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusColor = s => ({ Pending: '#f59e0b', Confirmed: '#10b981', Cancelled: '#ef4444' }[s] || '#aaa');

  // Today's date in YYYY-MM-DD for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="dmt-page fade-in">
      {/* ── HERO ─────────────────────────────────── */}
      <header className="dmt-hero">
        <div className="dmt-hero-orb dmt-orb-1" />
        <div className="dmt-hero-orb dmt-orb-2" />
        <div className="dmt-hero-inner">
          <span className="dmt-eyebrow">Therapeutic Movement</span>
          <h1 className="dmt-hero-title">Dance Movement<br />Therapy</h1>
          <p className="dmt-hero-quote">"Embodying the soul through mindful motion."</p>
          <div className="dmt-hero-actions">
            <button className="dmt-cta-btn" onClick={openModal}>Book a Session</button>
            <button
              className="dmt-outline-btn"
              onClick={() => { setShowBookings(!showBookings); fetchMyBookings(); }}
            >
              {showBookings ? 'Hide' : 'My Bookings'}
            </button>
          </div>
        </div>
      </header>

      {/* ── WHAT IS DMT ──────────────────────────── */}
      <section className="dmt-section">
        <div className="dmt-what-grid">
          <div className="dmt-what-text">
            <h2 className="dmt-section-title">What is DMT?</h2>
            <p className="dmt-body-text">
              Dance/Movement Therapy (DMT) is the psychotherapeutic use of movement to promote
              emotional, social, cognitive, and physical integration. At Ruh, we believe the
              body and mind are inseparable — movement unlocks what words alone cannot reach.
            </p>
            <p className="dmt-body-text">
              Our certified therapists guide each session with compassion and expertise,
              creating a safe space for authentic expression and meaningful transformation.
            </p>
            <button className="dmt-cta-btn" style={{ marginTop: '20px' }} onClick={openModal}>
              Start Your Journey →
            </button>
          </div>
          <div className="dmt-what-card">
            <div className="dmt-stat"><span className="dmt-stat-num">500+</span><span>Sessions Completed</span></div>
            <div className="dmt-stat"><span className="dmt-stat-num">95%</span><span>Client Satisfaction</span></div>
            <div className="dmt-stat"><span className="dmt-stat-num">3</span><span>Session Formats</span></div>
            <div className="dmt-stat"><span className="dmt-stat-num">∞</span><span>Healing Potential</span></div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ─────────────────────────────── */}
      <section className="dmt-section dmt-benefits-section">
        <h2 className="dmt-section-title" style={{ textAlign: 'center' }}>How DMT Helps You</h2>
        <p className="dmt-body-text" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px' }}>
          Every session is tailored to your unique needs. Here's what our clients experience:
        </p>
        <div className="dmt-benefits-grid">
          {BENEFITS.map(b => (
            <div key={b.title} className="dmt-benefit-card">
              <span className="dmt-benefit-icon">{b.icon}</span>
              <h4 className="dmt-benefit-title">{b.title}</h4>
              <p className="dmt-benefit-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SESSION TYPES ────────────────────────── */}
      <section className="dmt-section">
        <h2 className="dmt-section-title" style={{ textAlign: 'center' }}>Session Formats</h2>
        <div className="dmt-formats-grid">
          {[
            { icon: '👤', type: 'Individual', desc: 'One-on-one with your therapist. Deeply personal and private.' },
            { icon: '👥', type: 'Group', desc: '4–8 participants. Share, connect, and heal in community.' },
            { icon: '💻', type: 'Online', desc: 'Virtual sessions from the comfort of your home via video call.' },
          ].map(f => (
            <div key={f.type} className="dmt-format-card" onClick={() => { setForm(v => ({...v, sessionType: f.type})); openModal(); }}>
              <span style={{ fontSize: '2.5rem' }}>{f.icon}</span>
              <h4 style={{ color: 'var(--brand-pink)', margin: '15px 0 10px' }}>{f.type}</h4>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: '1.6' }}>{f.desc}</p>
              <button className="dmt-outline-btn" style={{ marginTop: '20px', fontSize: '0.8rem', padding: '9px 22px' }}>
                Book {f.type}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── MY BOOKINGS ──────────────────────────── */}
      {showBookings && (
        <section className="dmt-section">
          <h2 className="dmt-section-title">My Sessions</h2>
          {myBookings.length === 0 ? (
            <div className="dmt-empty-state">
              <span style={{ fontSize: '3rem' }}>🗓️</span>
              <p>You haven't booked any sessions yet.</p>
              <button className="dmt-cta-btn" onClick={openModal}>Book Your First Session</button>
            </div>
          ) : (
            <div className="dmt-bookings-list">
              {myBookings.map(b => (
                <div key={b._id} className="dmt-booking-row">
                  <div className="dmt-booking-info">
                    <span className="dmt-booking-type">{b.sessionType}</span>
                    <strong>{new Date(b.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                    <span style={{ opacity: 0.7 }}>⏰ {b.time}</span>
                    <span style={{ opacity: 0.7 }}>🎯 {b.sessionGoal}</span>
                  </div>
                  <span className="dmt-status-badge" style={{ background: statusColor(b.status) }}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── BOOKING MODAL ─────────────────────────── */}
      {showModal && (
        <div className="dmt-modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="dmt-modal">
            {/* Header */}
            <div className="dmt-modal-header">
              <div>
                <h3 className="dmt-modal-title">
                  {step === 3 ? '🎉 Booking Confirmed!' : 'Book a DMT Session'}
                </h3>
                {step !== 3 && (
                  <div className="dmt-steps">
                    <span className={`dmt-step ${step >= 1 ? 'active' : ''}`}>1. Your Details</span>
                    <span className="dmt-step-sep">›</span>
                    <span className={`dmt-step ${step >= 2 ? 'active' : ''}`}>2. Schedule</span>
                  </div>
                )}
              </div>
              <button className="dmt-modal-close" onClick={closeModal}>✕</button>
            </div>

            {/* ── STEP 1: Contact Info ── */}
            {step === 1 && (
              <div className="dmt-modal-body">
                <div className="dmt-form-group">
                  <label>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className="dmt-input" required />
                </div>
                <div className="dmt-form-row">
                  <div className="dmt-form-group">
                    <label>Email Address *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className="dmt-input" required />
                  </div>
                  <div className="dmt-form-group">
                    <label>Phone Number *</label>
                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className="dmt-input" required />
                  </div>
                </div>
                <div className="dmt-form-row">
                  <div className="dmt-form-group">
                    <label>Session Type</label>
                    <div className="dmt-pill-group">
                      {SESSION_TYPES.map(t => (
                        <button key={t} type="button"
                          className={`dmt-pill ${form.sessionType === t ? 'active' : ''}`}
                          onClick={() => setForm({...form, sessionType: t})}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="dmt-form-group">
                  <label>Primary Goal</label>
                  <div className="dmt-pill-group" style={{ flexWrap: 'wrap' }}>
                    {SESSION_GOALS.map(g => (
                      <button key={g} type="button"
                        className={`dmt-pill ${form.sessionGoal === g ? 'active' : ''}`}
                        onClick={() => setForm({...form, sessionGoal: g})}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="dmt-form-group">
                  <label>Additional Notes <span style={{ opacity: 0.5 }}>(optional)</span></label>
                  <textarea name="notes" value={form.notes} onChange={handleChange}
                    placeholder="Share anything you'd like us to know before the session..."
                    className="dmt-input dmt-textarea" rows="3" />
                </div>
                {error && <p className="dmt-error">{error}</p>}
                <button className="dmt-cta-btn dmt-full-btn" onClick={handleNextStep}>
                  Next: Choose Date & Time →
                </button>
              </div>
            )}

            {/* ── STEP 2: Schedule ── */}
            {step === 2 && (
              <form className="dmt-modal-body" onSubmit={handleSubmit}>
                <div className="dmt-form-group">
                  <label>Preferred Date *</label>
                  <input name="date" type="date" value={form.date} onChange={handleChange}
                    min={today} className="dmt-input" required />
                </div>
                <div className="dmt-form-group">
                  <label>Preferred Time Slot *</label>
                  <div className="dmt-timeslot-grid">
                    {TIME_SLOTS.map(t => (
                      <button key={t} type="button"
                        className={`dmt-timeslot ${form.time === t ? 'active' : ''}`}
                        onClick={() => setForm({...form, time: t})}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary card */}
                <div className="dmt-summary-card">
                  <h5>📋 Booking Summary</h5>
                  <div className="dmt-summary-row"><span>Name</span><strong>{form.name}</strong></div>
                  <div className="dmt-summary-row"><span>Type</span><strong>{form.sessionType}</strong></div>
                  <div className="dmt-summary-row"><span>Goal</span><strong>{form.sessionGoal}</strong></div>
                  <div className="dmt-summary-row"><span>Date</span><strong>{form.date ? new Date(form.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) : '—'}</strong></div>
                  <div className="dmt-summary-row"><span>Time</span><strong>{form.time || '—'}</strong></div>
                </div>

                {error && <p className="dmt-error">{error}</p>}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" className="dmt-outline-btn dmt-full-btn" onClick={() => setStep(1)}>← Back</button>
                  <button type="submit" className="dmt-cta-btn dmt-full-btn" disabled={loading}>
                    {loading ? 'Booking...' : 'Confirm Booking ✓'}
                  </button>
                </div>
              </form>
            )}

            {/* ── STEP 3: Success ── */}
            {step === 3 && (
              <div className="dmt-modal-body dmt-success">
                <div className="dmt-success-icon">🎉</div>
                <h3>You're all set, {form.name.split(' ')[0]}!</h3>
                <p>Your <strong>{form.sessionType}</strong> DMT session has been requested for:</p>
                <div className="dmt-success-detail">
                  <span>📅 {new Date(form.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>⏰ {form.time}</span>
                  <span>🎯 {form.sessionGoal}</span>
                </div>
                <p style={{ opacity: 0.7, fontSize: '0.9rem', marginTop: '15px' }}>
                  A confirmation will be sent to <strong>{form.email}</strong>. Our therapist will reach out to confirm the appointment.
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
                  <button className="dmt-cta-btn dmt-full-btn" onClick={() => { closeModal(); setShowBookings(true); }}>
                    View My Bookings
                  </button>
                  <button className="dmt-outline-btn dmt-full-btn" onClick={() => { setForm(initialForm); setStep(1); }}>
                    Book Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dmt;