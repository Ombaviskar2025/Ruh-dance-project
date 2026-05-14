import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LuPencil, LuX } from 'react-icons/lu';
import '../App.css';

const defaultProductions = [
  {
    _id: '1',
    title: "Antar-Yatra",
    subtitle: "The Inner Journey",
    year: "2024",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: '2',
    title: "Dhvani",
    subtitle: "The Sound of Silence",
    year: "2025",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: '3',
    title: "Prana",
    subtitle: "Breath of Life",
    year: "Upcoming",
    image: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&w=800&q=80"
  }
];

const Productions = () => {
  const [productions, setProductions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Edit Modal State
  const [editingProd, setEditingProd] = useState(null);
  const [prodFormData, setProdFormData] = useState({ title: '', subtitle: '', year: '', image: '' });
  const [newImageFile, setNewImageFile] = useState(null);

  const fetchProductions = async () => {
    try {
      const res = await axios.get('https://ruh-danceproject.onrender.com/api/productions');
      const data = res.data.productions || res.data.data;
      if (data && data.length > 0) {
        setProductions(data);
      } else {
        setProductions(defaultProductions);
      }
    } catch (err) {
      console.error("Error fetching productions, using default:", err);
      setProductions(defaultProductions);
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
    fetchProductions();
  }, []);

  const handleEditClick = (prod) => {
    setEditingProd(prod);
    setProdFormData({ title: prod.title, subtitle: prod.subtitle, year: prod.year, image: prod.image });
    setNewImageFile(null);
  };

  const handleSaveProd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', prodFormData.title);
    formData.append('subtitle', prodFormData.subtitle);
    formData.append('year', prodFormData.year);
    if (newImageFile) formData.append('image', newImageFile);

    try {
      await axios.put(`https://ruh-danceproject.onrender.com/api/productions/${editingProd._id}`, formData, { 
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        } 
      });
      alert('Production successfully updated directly from page!');
      setEditingProd(null);
      fetchProductions(); // Refresh to show new image/text
    } catch (err) {
      console.error(err);
      alert('Failed to update production. Check console.');
    }
  };

  return (
    <div className="fade-in modern-page-content" style={{ position: 'relative' }}>
      <header style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 className="hero-title-modern" style={{ fontSize: '2.5rem' }}>Stage Productions</h2>
        <p className="hero-desc-modern" style={{ letterSpacing: '2px' }}>WHERE STORYTELLING MEETS SPECTACLE</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', maxWidth: '1100px', margin: 'auto' }}>
        {productions.map((prod) => (
          <div key={prod._id} className="prod-card glass-hero-panel" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
            <div style={{ overflow: 'hidden', borderRadius: '10px 10px 0 0' }}>
              <img 
                src={prod.image?.startsWith('http') ? prod.image : (prod.image ? `https://ruh-danceproject.onrender.com${prod.image}` : 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80')} 
                alt={prod.title} 
                style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }} 
              />
            </div>
            
            {/* ADMIN EDIT BUTTON OVERLAY */}
            {isAdmin && prod._id.length > 5 && (
               <button 
                  onClick={() => handleEditClick(prod)}
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

            <div style={{ padding: '20px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#E491C9' }}>{prod.year}</span>
              <h3 style={{ margin: '5px 0', color: '#F1E9E9' }}>{prod.title}</h3>
              <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#d1d5db' }}>{prod.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL FOR PUBLIC PAGE */}
      {editingProd && (
        <div className="modern-modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modern-modal-content" style={{ background: '#15173D', border: '1px solid #E491C9', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#E491C9', margin: 0, fontFamily: "'Playfair Display', serif" }}>Edit Production</h2>
              <LuX size={24} style={{ cursor: 'pointer', color: '#d1d5db' }} onClick={() => setEditingProd(null)} />
            </div>
            
            <form onSubmit={handleSaveProd} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Production Title</label>
                <input className="modern-form-input" required value={prodFormData.title} onChange={e => setProdFormData({...prodFormData, title: e.target.value})} />
              </div>

              <div>
                <label style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Year</label>
                <input className="modern-form-input" required value={prodFormData.year} onChange={e => setProdFormData({...prodFormData, year: e.target.value})} />
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: '#E491C9', fontSize: '0.9rem' }}>Upload New Image Cover</label>
                <input type="file" style={{ color: 'white' }} onChange={e => setNewImageFile(e.target.files[0])} />
                {prodFormData.image && !newImageFile && (
                   <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#888' }}>Current image: {prodFormData.image.split('/').pop()}</p>
                )}
              </div>

              <div>
                <label style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Subtitle text</label>
                <textarea className="modern-form-input" style={{ minHeight: '60px', resize: 'vertical' }} required value={prodFormData.subtitle} onChange={e => setProdFormData({...prodFormData, subtitle: e.target.value})}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button type="submit" className="modern-btn" style={{ flex: 1, padding: '12px' }}>Save Changes</button>
                <button type="button" onClick={() => setEditingProd(null)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #666', color: '#ccc', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productions;