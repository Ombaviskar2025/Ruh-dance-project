import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [inquiries, setInquiries] = useState([]);
  const [styles, setStyles] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  
  // State for editing a style
  const [editingStyle, setEditingStyle] = useState(null);
  // ADDED: videoUrl to editFormData state
  const [editFormData, setEditFormData] = useState({ name: '', description: '', image: '', videoUrl: '' });
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'ruh-admin-2026') setIsLoggedIn(true);
    else alert("Incorrect Access Key");
  };

  const [contacts, setContacts] = useState([
    { id: 1, name: "Instructor Rahul", role: "Kathak", email: "rahul@ruh.com" },
    { id: 2, name: "Instructor Simran", role: "Contemporary", email: "sim@ruh.com" }
  ]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const fetchData = async () => {
    try {
      const inquiryRes = await axios.get('https://ruh-dance-project.onrender.com/api/inquiries');
      const styleRes = await axios.get('https://ruh-dance-project.onrender.com/api/styles');
      setInquiries(inquiryRes.data.data);
      setStyles(styleRes.data.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  // Function to start editing
  const startEdit = (style) => {
    setEditingStyle(style._id);
    // UPDATED: Include videoUrl when opening the edit modal
    setEditFormData({ 
      name: style.name, 
      description: style.description, 
      image: style.image, 
      videoUrl: style.videoUrl || '' 
    });
  };

  // Function to save the update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://ruh-dance-project.onrender.com/api/styles/${editingStyle}`, editFormData);
      setEditingStyle(null);
      fetchData(); // Refresh list
      alert("Style updated successfully!");
    } catch (err) {
      alert("Update failed");
    }
  };

  // ADDED: Function to delete old inquiries
  const deleteInquiry = async (id) => {
    if (window.confirm("Delete this inquiry?")) {
      try {
        await axios.delete(`https://ruh-dance-project.onrender.com/api/inquiries/${id}`);
        fetchData();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login" style={{ padding: '100px', textAlign: 'center' }}>
        <h2 style={{ color: '#722F37' }}>Ruh Admin Portal</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="password" 
            placeholder="Enter Admin Key" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px' }}
          />
          <button className="soulful-btn" style={{ marginLeft: '10px' }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px' }} className="fade-in">
      <h2 style={{ color: '#722F37' }}>Admin Dashboard</h2>
      
      {/* SECTION: Instructor Directory */}
      <section style={{ marginTop: '40px' }}>
        <h3>Instructor & User Directory</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {contacts.map(c => (
            <div key={c.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '10px' }}>
              <strong>{c.name}</strong> ({c.role})
              <br />
              <a href={`mailto:${c.email}`} className="soulful-btn" style={{ fontSize: '0.7rem', textDecoration: 'none', display: 'inline-block', marginTop: '5px' }}>
                Email Now
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: Manage Dance Styles */}
      <section style={{ margin: '50px 0' }}>
        <h3>Manage Dance Styles</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image Preview</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {styles.map((s) => (
              <tr key={s._id}>
                <td><img src={s.image} alt="style" style={{ width: '60px', borderRadius: '5px' }} /></td>
                <td>{s.name}</td>
                <td style={{ fontSize: '0.8rem' }}>{s.description.substring(0, 50)}...</td>
                <td>
                  <button onClick={() => startEdit(s)} style={{ cursor: 'pointer', background: '#D8BFD8', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* EDIT MODAL */}
      {editingStyle && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Edit {editFormData.name}</h3>
            <form onSubmit={handleUpdate}>
              <label>Image URL:</label>
              <input type="text" style={inputStyle} value={editFormData.image} onChange={(e) => setEditFormData({...editFormData, image: e.target.value})} />
              
              <label>Performance Video (YouTube Link):</label>
              <input 
                type="text" 
                style={inputStyle} 
                value={editFormData.videoUrl} 
                onChange={(e) => setEditFormData({...editFormData, videoUrl: e.target.value})} 
                placeholder="https://youtube.com/..."
              />

              <label>Description:</label>
              <textarea style={inputStyle} rows="4" value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} />
              
              <div style={{ marginTop: '15px' }}>
                <button type="submit" className="soulful-btn">Save Changes</button>
                <button type="button" onClick={() => setEditingStyle(null)} style={{ marginLeft: '10px', padding: '8px 15px', borderRadius: '5px', border: '1px solid #ddd' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION: Expanded Inquiries Table */}
      <section>
        <h3>User Inquiries</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>Full Name</th>
              <th>Phone</th>
              <th>Gender/Age</th>
              <th>Dance Style</th>
              <th>Email</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq._id}>
                {/* DISPLAY: Auto-formatted Date and Time */}
                <td style={{ fontSize: '0.75rem' }}>{new Date(inq.dateReceived).toLocaleString()}</td>
                <td>{inq.fullName}</td>
                <td>{inq.phone}</td>
                <td>{inq.gender} / {inq.age}</td>
                <td><span style={{ background: '#f0e6ff', padding: '3px 7px', borderRadius: '10px', fontSize: '0.8rem' }}>{inq.danceStyle}</span></td>
                <td><a href={`mailto:${inq.email}`} style={{ color: '#722F37' }}>{inq.email}</a></td>
                <td style={{ fontSize: '0.8rem', maxWidth: '150px' }}>{inq.message}</td>
                <td>
                  <button onClick={() => deleteInquiry(inq._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <button onClick={() => setIsLoggedIn(false)} style={{ marginTop: '40px', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
    </div>
  );
};

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { background: 'white', padding: '30px', borderRadius: '15px', width: '450px', maxHeight: '90vh', overflowY: 'auto' };
const inputStyle = { width: '100%', padding: '10px', margin: '10px 0', display: 'block', borderRadius: '5px', border: '1px solid #ddd' };

export default Admin;