import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const InstructorDashboard = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [myClasses, setMyClasses] = useState([]);

  // Profile Editing States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    // 1. Load User
    const storedUser = localStorage.getItem('user');
    let currentUser = null;
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      setUser(currentUser);
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

    // 3. Fetch Classes
    const fetchClasses = async () => {
      try {
        const res = await axios.get('https://ruh-dance-project.onrender.com/api/classes');
        const allClasses = res.data;
        // Filter classes where instructorName loosely matches the logged in user's name
        const myName = currentUser?.fullName || currentUser?.name || currentUser?.username;
        if (myName) {
          const formattedMyName = myName.toLowerCase();
          const filtered = allClasses.filter(c => 
            c.instructorName && c.instructorName.toLowerCase().includes(formattedMyName)
          );
          setMyClasses(filtered);
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };

    fetchEvents();
    fetchClasses();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`https://ruh-dance-project.onrender.com/api/auth/update-profile/${user.id || user._id}`, editFormData);
      
      const updatedUser = res.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditingProfile(false);
      alert("Profile successfully updated!");
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.message || "Server Error"));
    }
  };

  if (!user) return <div className="modern-page-content" style={{ color: '#F1E9E9', textAlign: 'center' }}>Loading Instructor Portal...</div>;

  return (
    <div className="home-aesthetic-container" style={{ minHeight: '100vh' }}>
      {/* Ambient Glowing Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      <div className="fade-in modern-page-content" style={{ position: 'relative', zIndex: 1 }}>
      <header className="dashboard-header">
        <h1 className="hero-title-modern" style={{ color: '#E491C9' }}>
          Instructor Portal: <span style={{ color: '#F1E9E9' }}>{user.fullName || user.username}</span>
        </h1>
        <p className="hero-desc-modern">
          Manage your schedule, stay updated, and inspire the Ruh Dance community.
        </p>
      </header>

      <div className="dashboard-grid">
        
        {/* LEFT COLUMN: Profile & Quick Links */}
        <div className="dashboard-left-col">
          
          {/* Profile Card */}
          <div className="glass-hero-panel" style={{ padding: '30px', textAlign: 'left' }}>
            <div className="profile-card-header">
              <h3 style={{ color: '#E491C9', margin: 0 }}>My Profile</h3>
              {!isEditingProfile && (
                <button onClick={() => { setEditFormData(user); setIsEditingProfile(true); }} style={{ background: 'transparent', color: '#E491C9', border: '1px solid #E491C9', borderRadius: '5px', padding: '5px 15px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
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
                    <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Age / Experience</label>
                    <input type="number" value={editFormData.age || ''} onChange={(e) => setEditFormData({...editFormData, age: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', marginTop: '5px' }} required />
                  </div>
                </div>
                <div>
                  <label style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Specialty</label>
                  <input type="text" value={editFormData.danceStyle || ''} onChange={(e) => setEditFormData({...editFormData, danceStyle: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', marginTop: '5px' }} required />
                </div>
                <div className="dashboard-btn-row">
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
                  <strong>Specialty:</strong> 
                  <span style={{ marginLeft: '10px', background: 'rgba(228,145,201,0.2)', color: '#E491C9', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {user.danceStyle || 'Instructor'}
                  </span>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Studio Feeds & Classes */}
        <div className="dashboard-right-col">
          
          {/* Classes Render Panel */}
          <div className="glass-hero-panel" style={{ padding: '30px', textAlign: 'left' }}>
            <h3 style={{ color: '#E491C9', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px' }}>
              My Assigned Classes
            </h3>
            {myClasses.length === 0 ? (
              <p style={{ color: '#d1d5db' }}>You currently have no classes assigned to your name. Please contact the administrator.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                {myClasses.map(c => (
                  <div key={c._id} style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '10px', borderTop: '4px solid #E491C9' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#F1E9E9', fontSize: '1.2rem' }}>{c.className}</h4>
                    <p style={{ margin: '5px 0', color: '#E491C9', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      🕒 {c.scheduleTime}
                    </p>
                    <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                        <span style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Enrolled: <strong>{c.enrolled}</strong></span>
                        <span style={{ color: '#d1d5db', fontSize: '0.85rem' }}>Capacity: <strong>{c.capacity}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Studio Announcements (Real Events) */}
          <div className="glass-hero-panel" style={{ padding: '30px', textAlign: 'left', background: 'rgba(228,145,201,0.05)' }}>
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

        </div>

      </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
