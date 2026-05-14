import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Fixes 'axios' is not defined
import { LuPencil, LuPlus, LuX, LuTrash2 } from "react-icons/lu";
// import './Events.css'; // Restore your original CSS file

const Events = ({ isAdmin }) => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    category: '', title: '', date: '', description: ''
  });

  // Define fetchData correctly to fix 'fetchData' is not defined
  const fetchData = useCallback(async () => {
    try {
      // Must match your Backend port 5000
      const res = await axios.get('https://ruh-dance-project.onrender.com/api/events');
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching existing events:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle saving new or updated events to the database
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await axios.put(`https://ruh-dance-project.onrender.com/api/events/${editingEvent._id}`, formData);
      } else {
        await axios.post('https://ruh-dance-project.onrender.com/api/events', formData);
      }
      setIsModalOpen(false);
      setEditingEvent(null);
      fetchData(); // Refresh to show the latest database state
    } catch (err) {
      alert("Database sync failed. Check if server is running.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`https://ruh-dance-project.onrender.com/api/events/${id}`);
        fetchData();
      } catch (err) {
        alert("Failed to delete event.");
      }
    }
  };

  return (
    <div className={isAdmin ? "" : "modern-page-content"} style={{ maxWidth: '1200px', margin: '0 auto', padding: isAdmin ? '20px 0' : '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h2 className={isAdmin ? "" : "hero-title-modern"} style={{ margin: 0, fontSize: '2.5rem', color: isAdmin ? '#722F37' : undefined }}>Upcoming Events</h2>
        {isAdmin && (
          <button className="modern-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }} onClick={() => setIsModalOpen(true)}>
            <LuPlus /> Add Event
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {events.map((event) => (
          <div key={event._id} className={isAdmin ? "" : "glass-hero-panel"} style={{ textAlign: 'left', padding: '30px', position: 'relative', background: isAdmin ? '#ffffff' : undefined, borderRadius: isAdmin ? '10px' : undefined, boxShadow: isAdmin ? '0 4px 15px rgba(0,0,0,0.05)' : undefined, border: isAdmin ? '1px solid #eee' : undefined }}>
            {isAdmin && (
              <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '10px' }}>
                <button style={{ background: 'transparent', border: 'none', color: '#E491C9', cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => {
                  setEditingEvent(event);
                  setFormData({...event});
                  setIsModalOpen(true);
                }}>
                  <LuPencil />
                </button>
                <button style={{ background: 'transparent', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => handleDelete(event._id)}>
                  <LuTrash2 />
                </button>
              </div>
            )}
            <span style={{ display: 'inline-block', padding: '5px 12px', background: isAdmin ? '#f4f4f4' : 'rgba(228, 145, 201, 0.2)', color: isAdmin ? '#722F37' : '#E491C9', borderRadius: '20px', fontSize: '0.8rem', marginBottom: '15px', fontWeight: 'bold', textTransform: 'uppercase' }}>{event.category}</span>
            <h3 style={{ color: isAdmin ? '#333333' : '#F1E9E9', margin: '0 0 10px 0', fontSize: '1.5rem' }}>{event.title}</h3>
            <p style={{ color: isAdmin ? '#722F37' : '#E491C9', fontWeight: 'bold', marginBottom: '15px' }}>{new Date(event.date).toLocaleDateString()}</p>
            <p style={{ color: isAdmin ? '#666666' : '#d1d5db', lineHeight: '1.6' }}>{event.description}</p>
          </div>
        ))}
      </div>

      {/* Event Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ background: 'white', padding: '30px', borderRadius: '15px', color: '#333', maxWidth: '500px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <h2 style={{ color: '#722F37', marginBottom: '20px', fontSize: '1.8rem', fontFamily: "'Playfair Display', serif" }}>
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Event Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', background: '#f9f9f9', color: '#333' }} />
              <input type="text" placeholder="Category (e.g. Workshop, Show)" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', background: '#f9f9f9', color: '#333' }} />
              <input type="date" required value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''} onChange={e => setFormData({...formData, date: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', background: '#f9f9f9', color: '#333' }} />
              <textarea placeholder="Description" rows="4" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', background: '#f9f9f9', color: '#333' }} />
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#722F37', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Save Event</button>
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingEvent(null); setFormData({category:'', title:'', date:'', description:''}); }} style={{ flex: 1, padding: '12px', background: '#ddd', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;