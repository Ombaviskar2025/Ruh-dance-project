import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import WhatsAppSuccessPopup from '../components/WhatsAppSuccessPopup';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  
  // Profile Editing States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // DMT Booking States
  const [isDmtModalOpen, setIsDmtModalOpen] = useState(false);
  const [dmtBookings, setDmtBookings] = useState([]);
  const [dmtFormData, setDmtFormData] = useState({ date: '', time: '', notes: '' });

  // WhatsApp Success Popup states
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupConfig, setSuccessPopupConfig] = useState({
    title: '', subtitle: '', details: {}, whatsappMessage: ''
  });

  // Payment Reporting states
  const [isPaymentReportModalOpen, setIsPaymentReportModalOpen] = useState(false);
  const [paymentReportFormData, setPaymentReportFormData] = useState({ amount: '', category: 'Monthly Fee', date: '', method: 'Online / UPI' });

  const handlePaymentReportSubmit = (e) => {
    e.preventDefault();
    
    const pmMessage = `Hey Team Ruh 💃✨\nI just completed a fee payment online!\n\nHere are my payment details:\n- Student Name: ${user.fullName || user.username}\n- Email: ${user.email}\n- Amount: ₹${Number(paymentReportFormData.amount).toLocaleString()}\n- Category / Style: ${paymentReportFormData.category}\n- Date of Payment: ${paymentReportFormData.date}\n- Payment Method: ${paymentReportFormData.method}\n\nPlease verify and record this in my ledger. Thank you! 💃🔥`;
    
    setSuccessPopupConfig({
      title: 'Payment Reported!',
      subtitle: `Your payment of ₹${Number(paymentReportFormData.amount).toLocaleString()} has been reported to Team Ruh. Please click below to send the confirmation to us on WhatsApp!`,
      details: {
        'Student Name': user.fullName || user.username,
        'Amount': `₹${Number(paymentReportFormData.amount).toLocaleString()}`,
        'Category / Style': paymentReportFormData.category,
        'Payment Date': paymentReportFormData.date,
        'Method': paymentReportFormData.method
      },
      whatsappMessage: pmMessage
    });
    
    setIsPaymentReportModalOpen(false);
    setPaymentReportFormData({ amount: '', category: 'Monthly Fee', date: '', method: 'Online / UPI' });
    setShowSuccessPopup(true);
  };

  // Payment History State
  const [payments, setPayments] = useState([]);

  // Testimonial State
  const [testimonialData, setTestimonialData] = useState({ rating: 5, text: '' });
  const [testimonialSubmitted, setTestimonialSubmitted] = useState(false);

  useEffect(() => {
    // 1. Load User
    const storedUser = localStorage.getItem('user');
    let loadedUser = null;
    if (storedUser) {
      loadedUser = JSON.parse(storedUser);
      setUser(loadedUser);
    }

    // 2. Fetch Events for "Studio Announcements"
    const fetchEvents = async () => {
      try {
        const res = await axios.get('https://ruh-dance-project.onrender.com/api/events');
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };
    fetchEvents();

    // 3. Fetch DMT Bookings
    const fetchDmtBookings = async () => {
      if (!loadedUser) return;
      try {
        const res = await axios.get(`https://ruh-dance-project.onrender.com/api/dmt-bookings/my-bookings/${loadedUser.id || loadedUser._id}`);
        setDmtBookings(res.data);
      } catch (err) {
        console.error("Error fetching DMT bookings:", err);
      }
    };
    fetchDmtBookings();
    // 4. Fetch Payment History
    const fetchPayments = async () => {
      if (!loadedUser) return;
      try {
        const res = await axios.get('https://ruh-dance-project.onrender.com/api/finance');
        // Filter transactions for this student only
        const myPayments = res.data.filter(t => t.studentId?._id === (loadedUser.id || loadedUser._id));
        setPayments(myPayments);
      } catch (err) {
        console.error("Error fetching payments:", err);
      }
    };
    fetchPayments();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`https://ruh-dance-project.onrender.com/api/auth/update-profile/${user.id || user._id}`, editFormData);
      
      // Update local storage and current session so user doesn't have to re-login
      const updatedUser = res.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditingProfile(false);
      alert("Profile successfully updated!");
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.message || "Server Error"));
    }
  };

  const handleDmtSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        studentId: user.id || user._id,
        name: user.fullName || user.username,
        email: user.email,
        phone: user.phone || 'N/A',
        sessionType: 'Individual',
        sessionGoal: 'Emotional Healing',
        date: dmtFormData.date,
        time: dmtFormData.time,
        notes: dmtFormData.notes
      };
      
      const res = await axios.post('https://ruh-dance-project.onrender.com/api/dmt-bookings', payload);
      
      const dmtMessage = `Hey Team Ruh 🧘‍♀️🌿\nI just booked a Dance Movement Therapy (DMT) session on your website!\n\nHere are my session details:\n- Name: ${user.fullName || user.username}\n- Preferred Date: ${dmtFormData.date}\n- Time Slot: ${dmtFormData.time}\n- Focus Area / Notes: ${dmtFormData.notes || 'None'}\n\nPlease confirm my session booking. Thank you! 🌿✨`;
      
      setSuccessPopupConfig({
        title: 'Booking Requested!',
        subtitle: `Hi ${user.fullName || user.username}, your Dance Movement Therapy session has been successfully booked. Let's auto-confirm on WhatsApp!`,
        details: {
          'Student Name': user.fullName || user.username,
          'Therapy Date': dmtFormData.date,
          'Time Slot': dmtFormData.time,
          'Focus Area': dmtFormData.notes || 'None'
        },
        whatsappMessage: dmtMessage
      });
      
      setDmtBookings([res.data.booking, ...dmtBookings]);
      setIsDmtModalOpen(false);
      setDmtFormData({ date: '', time: '', notes: '' });
      setShowSuccessPopup(true);
    } catch (err) {
      alert("Booking failed: " + (err.response?.data?.message || "Server Error"));
    }
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    if (!testimonialData.text.trim()) {
      alert("Please write a review.");
      return;
    }
    try {
      const payload = {
        studentId: user.id || user._id,
        rating: testimonialData.rating,
        text: testimonialData.text
      };
      await axios.post('https://ruh-dance-project.onrender.com/api/testimonials', payload);
      setTestimonialSubmitted(true);
      setTestimonialData({ rating: 5, text: '' });
    } catch (err) {
      alert("Failed to submit review: " + (err.response?.data?.message || "Server Error"));
    }
  };

  if (!user) return <div className="modern-page-content" style={{ color: 'var(--light-gray)', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div className="home-aesthetic-container" style={{ minHeight: '100vh' }}>
      {/* Ambient Glowing Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      <div className="fade-in modern-page-content" style={{ position: 'relative', zIndex: 1 }}>
      <header className="dashboard-header">
        <h1 className="hero-title-modern">
          Welcome back, {user.fullName || user.username}!
        </h1>
        <p className="hero-desc-modern">
          Your personal portal to the Ruh Dance community.
        </p>
      </header>

      <div className="dashboard-grid">
        
        {/* LEFT COLUMN: Profile & Quick Links */}
        <div className="dashboard-left-col">
          
          {/* Profile Card */}
          <div className="glass-hero-panel" style={{ padding: '30px', textAlign: 'left' }}>
            <div className="profile-card-header">
              <h3 style={{ color: 'var(--brand-pink)', margin: 0 }}>My Profile</h3>
              {!isEditingProfile && (
                <button onClick={() => { setEditFormData(user); setIsEditingProfile(true); }} style={{ background: 'transparent', color: 'var(--brand-pink)', border: '1px solid var(--brand-pink)', borderRadius: '5px', padding: '5px 15px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Edit Profile
                </button>
              )}
            </div>
            
            {isEditingProfile ? (
              <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Full Name</label>
                  <input type="text" value={editFormData.fullName || editFormData.username || ''} onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', marginTop: '5px' }} required />
                </div>
                <div>
                  <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Phone</label>
                  <input type="text" value={editFormData.phone || ''} onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', marginTop: '5px' }} required />
                </div>
                <div className="dashboard-form-row">
                  <div>
                    <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Gender</label>
                    <select value={editFormData.gender || ''} onChange={(e) => setEditFormData({...editFormData, gender: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', marginTop: '5px' }}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Age</label>
                    <input type="number" value={editFormData.age || ''} onChange={(e) => setEditFormData({...editFormData, age: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', marginTop: '5px' }} required />
                  </div>
                </div>
                <div>
                  <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Discipline</label>
                  <input type="text" value={editFormData.danceStyle || ''} onChange={(e) => setEditFormData({...editFormData, danceStyle: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', marginTop: '5px' }} required />
                </div>
                <div className="dashboard-btn-row">
                  <button type="submit" className="modern-btn" style={{ flex: 1, padding: '10px' }}>Save Changes</button>
                  <button type="button" onClick={() => setIsEditingProfile(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid #666', color: '#ccc', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            ) : (
              <ul style={{ listStyleType: 'none', padding: 0, color: 'var(--light-gray)', lineHeight: '2' }}>
                <li><strong>Email:</strong> <span style={{ color: '#d1d5db' }}>{user.email} (Locked)</span></li>
                <li><strong>Phone:</strong> {user.phone}</li>
                <li><strong>Gender:</strong> {user.gender}</li>
                <li><strong>Age:</strong> {user.age}</li>
                <li>
                  <strong>Discipline:</strong> 
                  <span style={{ marginLeft: '10px', background: 'rgba(228,145,201,0.2)', color: 'var(--brand-pink)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {user.danceStyle || 'Student'}
                  </span>
                </li>
              </ul>
            )}
          </div>

          {/* DMT Bookings Section */}
          <div className="glass-hero-panel" style={{ padding: '30px', textAlign: 'left', background: 'rgba(228,145,201,0.05)' }}>
            <h3 style={{ color: 'var(--brand-pink)', marginBottom: '15px' }}>DMT Bookings</h3>
            {dmtBookings.length === 0 ? (
               <p style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '15px' }}>
                 No upcoming therapy sessions booked. Schedule one to explore mindfulness through movement.
               </p>
            ) : (
              <div className="dashboard-scroll-box" style={{ marginBottom: '15px', maxHeight: '200px' }}>
                {dmtBookings.map(b => (
                  <div key={b._id} style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', marginBottom: '10px', borderLeft: `3px solid ${b.status === 'Confirmed' ? '#25D366' : 'var(--brand-pink)'}` }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: 'var(--light-gray)' }}><strong>{new Date(b.date).toLocaleDateString()}</strong> at {b.time}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#d1d5db' }}>Status: <span style={{ color: b.status === 'Confirmed' ? '#25D366' : '#d1d5db' }}>{b.status}</span></p>
                  </div>
                ))}
              </div>
            )}

            <button className="modern-btn" style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }} onClick={() => setIsDmtModalOpen(true)}>
              Book a Session
            </button>
          </div>

          <div className="glass-hero-panel" style={{ padding: '30px', textAlign: 'left', background: 'rgba(40, 167, 69, 0.05)' }}>
            <h3 style={{ color: '#2ecc71', marginBottom: '15px' }}>Payment History</h3>
            {payments.length === 0 ? (
               <p style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '15px' }}>
                 No payment records found. Your fee receipts will appear here once recorded by the admin.
               </p>
            ) : (
              <div className="dashboard-scroll-box" style={{ marginBottom: '15px' }}>
                {payments.map(p => (
                  <div key={p._id} style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '10px', marginBottom: '10px', borderLeft: '3px solid #2ecc71' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{new Date(p.date).toLocaleDateString()}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2ecc71' }}>₹{p.amount.toLocaleString()}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--light-gray)' }}>{p.category}</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.75rem', color: '#888' }}>via {p.paymentMethod}</p>
                  </div>
                ))}
              </div>
            )}
            <button 
              className="modern-btn" 
              style={{ width: '100%', padding: '10px', fontSize: '0.9rem', background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)', boxShadow: '0 4px 15px rgba(46, 204, 113, 0.2)' }} 
              onClick={() => setIsPaymentReportModalOpen(true)}
            >
              Report New Payment
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Studio Feeds */}
        <div className="dashboard-right-col">
          
          {/* Stu          <div className="glass-hero-panel" style={{ padding: '30px', textAlign: 'left' }}>
            <h3 style={{ color: 'var(--brand-pink)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px' }}>
              Studio Announcements
            </h3>
            {events.length === 0 ? (
               <p style={{ color: '#d1d5db' }}>No new announcements at this time.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {events.map((evt) => (
                  <div key={evt._id} style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', borderLeft: '4px solid var(--brand-purple)' }}>
                    <h4 style={{ margin: '0 0 5px 0', color: 'var(--light-gray)' }}>{evt.title}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--brand-pink)', fontWeight: 'bold' }}>
                      {new Date(evt.date).toLocaleDateString()} | {evt.category}
                    </span>
                    <p style={{ margin: '10px 0 0 0', color: '#d1d5db', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {evt.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
              </div>
            )}
          </div>

          {/* Schedule Placeholder */}
          <div className="glass-hero-panel" style={{ padding: '30px', textAlign: 'left' }}>
            <h3 style={{ color: 'var(--brand-pink)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px' }}>
              My Upcoming Classes
            </h3>
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <svg viewBox="0 0 24 24" width="50" height="50" fill="var(--brand-pink)" opacity="0.3" style={{ marginBottom: '15px' }}>
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
              </svg>
              <p style={{ color: '#d1d5db' }}>Your class schedule integration is currently under construction.</p>
              <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}>Please consult your instructor for direct timings.</p>
            </div>
          </div>

          {/* Testimonial / Review Form */}
          <div className="glass-hero-panel" style={{ padding: '30px', textAlign: 'left', background: 'rgba(216, 191, 216, 0.05)' }}>
            <h3 style={{ color: 'var(--light-purple)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px' }}>
              Write a Review
            </h3>
            {testimonialSubmitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ color: '#2ecc71', fontSize: '3rem', marginBottom: '10px' }}>✓</div>
                <p style={{ color: '#d1d5db' }}>Thank you for your review! It will be featured on our site.</p>
              </div>
            ) : (
              <form onSubmit={handleTestimonialSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Rating (1-5)</label>
                  <select 
                    value={testimonialData.rating} 
                    onChange={(e) => setTestimonialData({...testimonialData, rating: Number(e.target.value)})}
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', marginTop: '5px' }}
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Poor</option>
                    <option value={1}>1 - Terrible</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Your Experience</label>
                  <textarea 
                    rows="4" 
                    placeholder="Share your dance journey with us..."
                    value={testimonialData.text} 
                    onChange={(e) => setTestimonialData({...testimonialData, text: e.target.value})}
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', marginTop: '5px', resize: 'vertical' }}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="modern-btn" style={{ width: '100%' }}>Submit Review</button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      {isDmtModalOpen && (
        <div className="modern-modal-overlay">
          <div className="modern-modal-content">
            <button className="modern-close-btn" onClick={() => setIsDmtModalOpen(false)}>&times;</button>
            <h3 style={{ color: 'var(--brand-pink)', fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: '20px' }}>Book DMT Session</h3>
            <form onSubmit={handleDmtSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Preferred Date</label>
                <input type="date" required className="modern-form-input" style={{ marginTop: '5px' }}
                       value={dmtFormData.date} onChange={(e) => setDmtFormData({...dmtFormData, date: e.target.value})} />
              </div>
              <div>
                <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Preferred Time Slot</label>
                <select required className="modern-form-select" style={{ marginTop: '5px' }}
                        value={dmtFormData.time} onChange={(e) => setDmtFormData({...dmtFormData, time: e.target.value})}>
                  <option value="">Select Time</option>
                  <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                  <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                  <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Any specific notes or focus areas?</label>
                <textarea className="modern-form-input" rows="3" style={{ marginTop: '5px', resize: 'none' }}
                          value={dmtFormData.notes} onChange={(e) => setDmtFormData({...dmtFormData, notes: e.target.value})}
                          placeholder="e.g., anxiety relief, flexibility, etc."></textarea>
              </div>
              <button type="submit" className="modern-btn" style={{ width: '100%', marginTop: '10px' }}>Submit Request</button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Report Modal */}
      {isPaymentReportModalOpen && (
        <div className="modern-modal-overlay">
          <div className="modern-modal-content">
            <button className="modern-close-btn" onClick={() => setIsPaymentReportModalOpen(false)}>&times;</button>
            <h3 style={{ color: '#2ecc71', fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: '20px' }}>Report Online Payment</h3>
            <form onSubmit={handlePaymentReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Amount Paid (₹)</label>
                <input 
                  type="number" required className="modern-form-input" style={{ marginTop: '5px' }}
                  placeholder="e.g., 2000"
                  value={paymentReportFormData.amount} 
                  onChange={(e) => setPaymentReportFormData({...paymentReportFormData, amount: e.target.value})} 
                />
              </div>
              <div>
                <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Category / Style</label>
                <input 
                  type="text" required className="modern-form-input" style={{ marginTop: '5px' }}
                  placeholder="e.g., Monthly Fee - Kathak"
                  value={paymentReportFormData.category} 
                  onChange={(e) => setPaymentReportFormData({...paymentReportFormData, category: e.target.value})} 
                />
              </div>
              <div>
                <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Payment Date</label>
                <input 
                  type="date" required className="modern-form-input" style={{ marginTop: '5px' }}
                  value={paymentReportFormData.date} 
                  onChange={(e) => setPaymentReportFormData({...paymentReportFormData, date: e.target.value})} 
                />
              </div>
              <div>
                <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Payment Method</label>
                <select 
                  required className="modern-form-select" style={{ marginTop: '5px' }}
                  value={paymentReportFormData.method} 
                  onChange={(e) => setPaymentReportFormData({...paymentReportFormData, method: e.target.value})}
                >
                  <option value="Online / UPI">Online / UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="modern-btn" 
                style={{ width: '100%', marginTop: '10px', background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)' }}
              >
                Send to WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Success Popup */}
      <WhatsAppSuccessPopup 
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        title={successPopupConfig.title}
        subtitle={successPopupConfig.subtitle}
        details={successPopupConfig.details}
        whatsappMessage={successPopupConfig.whatsappMessage}
        buttonText="Send Confirmation to WhatsApp"
      />
      </div>
    </div>
  );
};

export default StudentDashboard;
