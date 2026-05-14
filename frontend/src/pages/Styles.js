import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LuPencil, LuX } from 'react-icons/lu';
import '../App.css';

const defaultStyles = [
  {
    _id: '1',
    name: 'Kathak',
    image: 'https://images.unsplash.com/photo-1543886567-27b5fc7e4088?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'An ancient Indian classical dance form characterized by rhythmic footwork, spectacular spins, and dramatic storytelling. We focus on the Lucknow and Jaipur gharanas, bringing historical narratives to life through precise facial expressions (abhinaya) and complex mathematical footwork.'
  },
  {
    _id: '2',
    name: 'Semi-Classical',
    image: 'https://images.unsplash.com/photo-1518919630739-1667b93f1155?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A beautiful fusion bridging the gap between classical rigidity and modern fluidity. Our semi-classical choreography borrows the grace, mudras, and poise from Kathak/Bharatanatyam while utilizing contemporary Bollywood or indie music to create a soulful performance.'
  },
  {
    _id: '3',
    name: 'Contemporary',
    image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A highly expressive style that combines elements of modern, jazz, lyrical, and ballet traditions. Our contemporary classes focus on floor work, fall and recovery, core strength, and utilizing raw emotion to drive physical movement.'
  },
  {
    _id: '4',
    name: 'Bollywood',
    image: 'https://images.unsplash.com/photo-1600181516264-3ea80fa2a6ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'High-energy, expressive, and incredibly fun. Bollywood dance merges traditional Indian folk styles (like Bhangra and Garba) with modern hip-hop, jazz, and R&B elements. It is an excellent cardio workout and a gateway to cinematic Indian culture.'
  },
  {
    _id: '5',
    name: 'Hip-Hop',
    image: 'https://images.unsplash.com/photo-1535592201886-25f0ac7e2343?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A street dance style that evolved from hip-hop culture. Our curriculum covers isolations, popping, locking, breaking, and commercial choreography. We emphasize musicality, groove, and individual freestyle expression.'
  },
  {
    _id: '6',
    name: 'Ballet Foundation',
    image: 'https://images.unsplash.com/photo-1518834107812-6afb15f03d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'The foundation of all classical western dance. We offer technical training focused on posture, barre work, center work, and allegro. Ballet training dramatically improves balance, flexibility, and the core strength required for any other dance discipline.'
  }
];

const Styles = () => {
  const [styles, setStyles] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Edit Modal State
  const [editingStyle, setEditingStyle] = useState(null);
  const [styleFormData, setStyleFormData] = useState({ name: '', description: '', image: '', category: 'Classical' });
  const [newStyleImageFile, setNewStyleImageFile] = useState(null);

  const fetchStyles = async () => {
    try {
      const res = await axios.get('https://ruh-danceproject.onrender.com/api/styles');
      if (res.data.data && res.data.data.length > 0) {
        setStyles(res.data.data);
      } else {
        setStyles(defaultStyles);
      }
    } catch (err) {
      console.error("Error fetching styles, using default:", err);
      setStyles(defaultStyles);
    }
  };

  useEffect(() => {
    // Check if current user is admin
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'admin') setIsAdmin(true);
      } catch(e) {}
    }
    fetchStyles();
  }, []);

  const handleEditClick = (style) => {
    setEditingStyle(style);
    setStyleFormData({ name: style.name, description: style.description, image: style.image, category: style.category || 'Classical' });
    setNewStyleImageFile(null);
  };

  const handleSaveStyle = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', styleFormData.name);
    formData.append('description', styleFormData.description);
    formData.append('category', styleFormData.category);
    if (newStyleImageFile) formData.append('image', newStyleImageFile);

    try {
      await axios.put(`https://ruh-danceproject.onrender.com/api/styles/${editingStyle._id}`, formData, { 
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        } 
      });
      alert('Style successfully updated directly from page!');
      setEditingStyle(null);
      fetchStyles(); // Refresh to show new image/text
    } catch (err) {
      console.error(err);
      alert('Failed to update style. Check console.');
    }
  };

  return (
    <div className="fade-in modern-page-content" style={{ marginTop: '30px', position: 'relative' }}>
      <header style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 className="hero-title-modern" style={{ fontSize: '3rem' }}>Our Dance Disciplines</h1>
        <p className="hero-desc-modern">Explore the rich tapestry of classical, contemporary, and commercial art forms taught by our expert faculty.</p>
      </header>
      
      <div className="styles-grid" style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto'
      }}>
        {styles.map((s) => (
          <div key={s._id} className="glass-hero-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <img 
               src={s.image?.startsWith('http') ? s.image : (s.image ? `https://ruh-danceproject.onrender.com${s.image}` : 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=800&q=80')} 
               alt={s.name} 
               style={{ width: '100%', height: '250px', objectFit: 'cover' }} 
               onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=800&q=80'; }} 
            />
            {/* ADMIN EDIT BUTTON OVERLAY */}
            {isAdmin && s._id.length > 5 && (
               <button 
                  onClick={() => handleEditClick(s)}
                  style={{
                    position: 'absolute', top: '15px', right: '15px', backgroundColor: '#982598',
                    color: 'white', border: '2px solid white', borderRadius: '50%', padding: '10px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.4)', transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <LuPencil size={20} />
                </button>
            )}

            <div style={{ padding: '30px', textAlign: 'left', flexGrow: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                 <div style={{ width: '30px', height: '2px', background: '#E491C9' }}></div>
                 <h3 style={{ color: '#E491C9', fontSize: '1.6rem', margin: '0' }}>{s.name}</h3>
              </div>
              <p style={{ fontSize: '1.05rem', color: '#d1d5db', lineHeight: '1.7' }}>
                {s.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL FOR PUBLIC PAGE */}
      {editingStyle && (
        <div className="modern-modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modern-modal-content" style={{ background: '#15173D', border: '1px solid #E491C9', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#E491C9', margin: 0, fontFamily: "'Playfair Display', serif" }}>Edit Quick Style</h2>
              <LuX size={24} style={{ cursor: 'pointer', color: '#d1d5db' }} onClick={() => setEditingStyle(null)} />
            </div>
            
            <form onSubmit={handleSaveStyle} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Style Name</label>
                <input className="modern-form-input" required value={styleFormData.name} onChange={e => setStyleFormData({...styleFormData, name: e.target.value})} />
              </div>
              
              <div>
                <label style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Category</label>
                <select className="modern-form-input" value={styleFormData.category} required onChange={e => setStyleFormData({...styleFormData, category: e.target.value})}>
                  <option value="Classical">Classical</option>
                  <option value="Contemporary">Contemporary</option>
                  <option value="Folk">Folk</option>
                  <option value="Jazz">Jazz</option>
                  <option value="Ballet">Ballet</option>
                </select>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: '#E491C9', fontSize: '0.9rem' }}>Upload New Image Cover</label>
                <input type="file" style={{ color: 'white' }} onChange={e => setNewStyleImageFile(e.target.files[0])} />
                {styleFormData.image && !newStyleImageFile && (
                   <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#888' }}>Current image: {styleFormData.image.split('/').pop()}</p>
                )}
              </div>

              <div>
                <label style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Description text</label>
                <textarea className="modern-form-input" style={{ minHeight: '120px', resize: 'vertical' }} required value={styleFormData.description} onChange={e => setStyleFormData({...styleFormData, description: e.target.value})}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button type="submit" className="modern-btn" style={{ flex: 1, padding: '12px' }}>Save Changes</button>
                <button type="button" onClick={() => setEditingStyle(null)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #666', color: '#ccc', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Styles;