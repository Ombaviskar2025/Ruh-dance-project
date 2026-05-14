import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

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

  // Payment History State
  const [payments, setPayments] = useState([]);

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
      alert('Booking Requested Successfully!');
      setDmtBookings([res.data.booking, ...dmtBookings]);
      setIsDmtModalOpen(false);
      setDmtFormData({ date: '', time: '', notes: '' });
    } catch (err) {
      alert("Booking failed: " + (err.response?.data?.message || "Server Error"));
    }
  };

  if (!user) return <div className="modern-page-content" style={{ color: '#F1E9E9', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div className="home-aesthetic-container" style={{ minHeight: '100vh' }}>
      {/* Ambient Glowing Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      <div className="fade-in modern-page-content" style={{ position: 'relative', zIndex: 1 }}>
      <header style={{ marginBottom: '50px' }}>
        <h1 className="hero-title-modern" style={{ fontSize: '2.5rem', textAlign: 'left', margin: 0 }}>
          Welcome back, {user.fullName || user.username}!
        </h1>
        <p className="hero-desc-modern" style={{ textAlign: 'left', marginTop: '10px' }}>
          Your personal portal to the Ruh Dance community.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px' }}>
        
        {/* LEFT COLUMN: Profile & Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Profile Card */}
          <div className="glass-hero-panel" style={{ padding: '30px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px' }}>
              <h3 style={{ color: '#E491C9', margin: 0 }}>My Profile</h3>
              {!isEditingProfile && (
                <button onClick={() => { setEditFormData(user); setIsEditingProfile(true); }} style={{ background: 'transparent', color: '#E491C9', border: '1px solid #E491C9', borderRadius: '5px', padding: '5px 15px', cursor: 'pointer' }}>
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
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Gender</label>
                    <select value={editFormData.gender || ''} onChange={(e) => setEditFormData({...editFormData, gender: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', marginTop: '5px' }}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Age</label>
                    <input type="number" value={editFormData.age || ''} onChange={(e) => setEditFormData({...editFormData, age: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', marginTop: '5px' }} required />
                  </div>
                </div>
                <div>
                  <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Discipline</label>
                  <input type="text" value={editFormData.danceStyle || ''} onChange={(e) => setEditFormData({...editFormData, danceStyle: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', marginTop: '5px' }} required />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="modern-btn" style={{ flex: 1, padding: '10px' }}>Save Changes</button>
                  <button type="button" onClick={() => setIsEditingProfile(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid #666', color: '#ccc', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            ) : (
              <ul style={{ listStyleType: 'none', padding: 0, color: '#F1E9E9', lineHeight: '2' }}>
                <li><strong>Email:</strong> <span style={{ color: '#d1d5db' }}>{user.email} (Locked)</span></li>
                <li><strong>Phone:</strong> {user.phone}</li>
                <li><strong>Gender:</strong> {user.gender}</li>
                <li><strong>Age:</strong> {user.age}</li>
                <li>
                  <strong>Discipline:</strong> 
                  <span style={{ marginLeft: '10px', background: 'rgba(228,145,201,0.2)', color: '#E491C9', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {user.danceStyle || 'Student'}
                  </span>
                </li>
              </ul>
            )}
          </div>

          {/* DMT Bookings Section */}
          <div className="glass-hero-panel" style={{ padding: '30px', textAlign: 'left', background: 'rgba(228,145,201,0.05)' }}>
            <h3 style={{ color: '#E491C9', marginBottom: '15px' }}>DMT Bookings</h3>
            {dmtBookings.length === 0 ? (
               <p style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '15px' }}>
                 No upcoming therapy sessions booked. Schedule one to explore mindfulness through movement.
               </p>
            ) : (
              <div style={{ marginBottom: '15px', maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
                {dmtBookings.map(b => (
                  <div key={b._id} style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', marginBottom: '10px', borderLeft: `3px solid ${b.status === 'Confirmed' ? '#25D366' : '#E491C9'}` }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#F1E9E9' }}><strong>{new Date(b.date).toLocaleDateString()}</strong> at {b.time}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#d1d5db' }}>Status: <span style={{ color: b.status === 'Confirmed' ? '#25D366' : '#d1d5db' }}>{b.status}</span></p>
                  </div>
                ))}
              </div>
            )}

            <button className="modern-btn" style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }} onClick={() => setIsDmtModalOpen(true)}>
              Book a Session
            </button>
          </div>

          {/* Payment History Section */}
          <div className="glass-hero-panel" style={{ padding: '30px', textAlign: 'left', background: 'rgba(40, 167, 69, 0.05)' }}>
            <h3 style={{ color: '#2ecc71', marginBottom: '15px' }}>Payment History</h3>
            {payments.length === 0 ? (
               <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}>
                 No payment records found. Your fee receipts will appear here once recorded by the admin.
               </p>
            ) : (
              <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '5px' }}>
                {payments.map(p => (
                  <div key={p._id} style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '10px', marginBottom: '10px', borderLeft: '3px solid #2ecc71' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{new Date(p.date).toLocaleDateString()}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2ecc71' }}>₹{p.amount.toLocaleString()}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#F1E9E9' }}>{p.category}</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.75rem', color: '#888' }}>via {p.paymentMethod}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Studio Feeds */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Studio Announcements (Real Events) */}
          <div className="glass-hero-panel" style={{ padding: '30px', textAlign: 'left' }}>
            <h3 style={{ color: '#E491C9', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px' }}>
              Studio Announcements
            </h3>
            {events.length === 0 ? (
              <p style={{ color: '#d1d5db' }}>No new announcements at this time.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {events.map((evt) => (
                  <div key={evt._id} style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', borderLeft: '4px solid #982598' }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#F1E9E9' }}>{evt.title}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#E491C9', fontWeight: 'bold' }}>
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

          {/* Schedule Placeholder */}
          <div className="glass-hero-panel" style={{ padding: '30px', textAlign: 'left' }}>
            <h3 style={{ color: '#E491C9', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px' }}>
              My Upcoming Classes
            </h3>
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <svg viewBox="0 0 24 24" width="50" height="50" fill="rgba(228,145,201,0.3)" style={{ marginBottom: '15px' }}>
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
              </svg>
              <p style={{ color: '#d1d5db' }}>Your class schedule integration is currently under construction.</p>
              <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}>Please consult your instructor for direct timings.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      {isDmtModalOpen && (
        <div className="modern-modal-overlay">
          <div className="modern-modal-content">
            <button className="modern-close-btn" onClick={() => setIsDmtModalOpen(false)}>&times;</button>
            <h3 style={{ color: '#E491C9', fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: '20px' }}>Book DMT Session</h3>
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
      </div>
    </div>
  );
};

export default StudentDashboard;
