import { Nav, NavItem as ReactstrapNavItem, NavLink, TabContent, TabPane, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  LuLayoutGrid, LuHistory, LuUsers, LuUser, 
  LuListTodo, LuCalendarCheck, LuCreditCard, 
  LuSettings, LuPencil, LuX, LuTrash2, LuUserPlus, LuPlus, LuPlay 
} from "react-icons/lu";
import './AdminDashboard.css';

import Events from './Events'; 
import ClassesAdmin from '../components/ClassesAdmin';
import FinanceAdmin from '../components/FinanceAdmin';

const AdminDashboard = () => {
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Instructors');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [productions, setProductions] = useState([]);
  const [styles, setStyles] = useState([]);
  const [gurus, setGurus] = useState([]);

  // Gurus Management State
  const [showGuruModal, setShowGuruModal] = useState(false);
  const [editingGuru, setEditingGuru] = useState(null);
  const [guruFormData, setGuruFormData] = useState({ name: '', style: '', description: '', instagram: '' });
  const [newGuruImageFile, setNewGuruImageFile] = useState(null);
  
  // Production Edit State
  const [editingProd, setEditingProd] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', year: '', subtitle: ''});
  const [newImageFile, setNewImageFile] = useState(null);

  // Production Add State
  const [showAddProdModal, setShowAddProdModal] = useState(false);
  const [newProdFormData, setNewProdFormData] = useState({ title: '', year: '', subtitle: ''});
  const [addProdImageFile, setAddProdImageFile] = useState(null);

  // Style State
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [editingStyle, setEditingStyle] = useState(null);
  const [styleFormData, setStyleFormData] = useState({ name: '', description: '', image: '', category: 'Classical', videoUrl: '' });
  const [newStyleImageFile, setNewStyleImageFile] = useState(null);

  // Instructor Add State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInstructor, setNewInstructor] = useState({
    fullName: '', email: '', password: '', age: '', danceStyle: '', gender: '', phone: '', bio: ''
  });
  const [newInstructorPhoto, setNewInstructorPhoto] = useState(null);
  const [instructorPhotoPreview, setInstructorPhotoPreview] = useState(null);

  // Settings State
  const [settings, setSettings] = useState({ homeVideoUrl: '' });
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [newVideoFile, setNewVideoFile] = useState(null);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

    // Gallery State
  const [galleryItems, setGalleryItems] = useState([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);
  const [galleryFormData, setGalleryFormData] = useState({ title: '', description: '', type: 'photo', mediaUrl: '' });
  const [galleryFile, setGalleryFile] = useState(null);

  // Signatures (Screen photo) State
  const [signatures, setSignatures] = useState([]);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [editingSignature, setEditingSignature] = useState(null);
  const [signatureFormData, setSignatureFormData] = useState({ title: '', description: '', videoUrl: '' });
  const [newSignatureImageFile, setNewSignatureImageFile] = useState(null);
  const [newSignatureVideoFile, setNewSignatureVideoFile] = useState(null);

  const token = localStorage.getItem('token');
  
  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const handleEditClick = (instructor) => {
    console.log("Edit requested for:", instructor);
  };

  const fetchData = useCallback(async () => {
    try {
      const instRes = await axios.get('https://ruh-dance-project.onrender.com/api/auth/instructors', config);
      setInstructors(instRes.data.instructors || instRes.data || []);
    } catch (err) {}

    try {
      const studentRes = await axios.get('https://ruh-dance-project.onrender.com/api/auth/students', config);
      setStudents(studentRes.data.students || studentRes.data || []);
    } catch (err) {}

    try {
      const prodRes = await axios.get('https://ruh-dance-project.onrender.com/api/productions');
      setProductions(prodRes.data.productions || prodRes.data.data || (Array.isArray(prodRes.data) ? prodRes.data : []));
    } catch (err) {}

    try {
      const styleRes = await axios.get('https://ruh-dance-project.onrender.com/api/styles');
      setStyles(styleRes.data.data || []);
    } catch (err) {}

    try {
      const guruRes = await axios.get('https://ruh-dance-project.onrender.com/api/gurus');
      setGurus(guruRes.data.data || []);
    } catch (err) {}

    try {
      const settingsRes = await axios.get('https://ruh-dance-project.onrender.com/api/settings');
      if (settingsRes.data.success) {
        setSettings(settingsRes.data.data);
        setVideoUrlInput(settingsRes.data.data.homeVideoUrl);
      }
    } catch (err) {}

    try {
      const galleryRes = await axios.get('https://ruh-dance-project.onrender.com/api/gallery');
      setGalleryItems(galleryRes.data.data || []);
    } catch (err) {}

    try {
      const signatureRes = await axios.get('https://ruh-dance-project.onrender.com/api/signatures');
      setSignatures(signatureRes.data.data || []);
    } catch (err) {}
  }, [config]);

  useEffect(() => {
    if (token) fetchData();
    else navigate('/login');
  }, [token, fetchData, navigate]);

  // --- INSTRUCTOR COMMANDS ---
  const handleAddInstructor = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(newInstructor).forEach(([key, val]) => formData.append(key, val));
      if (newInstructorPhoto) formData.append('profilePhoto', newInstructorPhoto);
      await axios.post('https://ruh-dance-project.onrender.com/api/auth/admin/add-instructor', formData, {
        headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
      });
      alert("Instructor added successfully!");
      setShowAddModal(false);
      setNewInstructor({ fullName: '', email: '', password: '', age: '', danceStyle: '', gender: '', phone: '', bio: '' });
      setNewInstructorPhoto(null);
      setInstructorPhotoPreview(null);
      fetchData();
    } catch (err) { alert(err.response?.data?.message || "Server Error"); }
  };

  const handleDeleteInstructor = async (id) => {
    if (window.confirm("Remove instructor?")) {
      try {
        await axios.delete(`https://ruh-dance-project.onrender.com/api/auth/instructor/${id}`, config);
        fetchData();
      } catch (err) { alert("Delete failed"); }
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Remove student?")) {
      try {
        await axios.delete(`https://ruh-dance-project.onrender.com/api/auth/student/${id}`, config);
        fetchData();
      } catch (err) { alert("Delete failed"); }
    }
  };

  // --- PRODUCTION COMMANDS ---
  const handleAddProduction = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newProdFormData.title);
    formData.append('year', newProdFormData.year);
    formData.append('subtitle', newProdFormData.subtitle);
    if (addProdImageFile) formData.append('image', addProdImageFile);

    try {
      await axios.post('https://ruh-dance-project.onrender.com/api/productions', formData, { headers: { ...config.headers } });
      alert('Production Added!');
      setShowAddProdModal(false);
      setNewProdFormData({ title: '', year: '', subtitle: ''});
      setAddProdImageFile(null);
      fetchData();
    } catch (err) { alert('Failed to add production'); }
  };

  const handleEditProdClick = (prod) => {
    setEditingProd(prod);
    setEditFormData({ title: prod.title, year: prod.year, subtitle: prod.subtitle || '', image: prod.image });
  };

  const handleUpdateProduction = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', editFormData.title);
    formData.append('year', editFormData.year);
    formData.append('subtitle', editFormData.subtitle);
    if (newImageFile) formData.append('image', newImageFile);

    try {
        await axios.put(`https://ruh-dance-project.onrender.com/api/productions/${editingProd._id}`, formData, { headers: { ...config.headers } });
        alert("Update successful!");
        setEditingProd(null);
        fetchData(); 
    } catch (err) { alert("Update failed."); }
  };

  const handleDeleteProduction = async (id) => {
    if (window.confirm("Delete this production?")) {
      try {
        await axios.delete(`https://ruh-dance-project.onrender.com/api/productions/${id}`, config);
        fetchData();
      } catch (err) { alert("Delete failed"); }
    }
  };

  // --- STYLE COMMANDS ---
  const handleOpenStyleModal = (styleToEdit = null) => {
    if (styleToEdit) {
      setEditingStyle(styleToEdit);
      setStyleFormData({ name: styleToEdit.name, description: styleToEdit.description, image: styleToEdit.image, category: styleToEdit.category || 'Classical', videoUrl: styleToEdit.videoUrl || '' });
    } else {
      setEditingStyle(null);
      setStyleFormData({ name: '', description: '', image: '', category: 'Classical', videoUrl: '' });
    }
    setNewStyleImageFile(null);
    setShowStyleModal(true);
  };

  const handleSaveStyle = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', styleFormData.name);
    formData.append('description', styleFormData.description);
    formData.append('category', styleFormData.category);
    formData.append('videoUrl', styleFormData.videoUrl);
    if (newStyleImageFile) formData.append('image', newStyleImageFile);

    try {
      if (editingStyle) {
        await axios.put(`https://ruh-dance-project.onrender.com/api/styles/${editingStyle._id}`, formData, { headers: { ...config.headers } });
        alert('Style Updated!');
      } else {
        await axios.post('https://ruh-dance-project.onrender.com/api/styles', formData, { headers: { ...config.headers } });
        alert('Style Added!');
      }
      setShowStyleModal(false);
    } catch (err) { 
        console.error(err);
        alert(err.response?.data?.message || err.message || 'Failed to save style'); 
    }
  };

  const handleDeleteStyle = async (id) => {
    if (window.confirm("Delete this dance style?")) {
      try {
        await axios.delete(`https://ruh-dance-project.onrender.com/api/styles/${id}`, config);
        fetchData();
      } catch (err) { alert("Delete failed"); }
    }
  };

  // --- GURU COMMANDS ---
  const handleOpenGuruModal = (guruToEdit = null) => {
    if (guruToEdit) {
      setEditingGuru(guruToEdit);
      setGuruFormData({ name: guruToEdit.name, style: guruToEdit.style, description: guruToEdit.description, instagram: guruToEdit.instagram || '' });
    } else {
      setEditingGuru(null);
      setGuruFormData({ name: '', style: '', description: '', instagram: '' });
    }
    setNewGuruImageFile(null);
    setShowGuruModal(true);
  };

  const handleSaveGuru = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', guruFormData.name);
    formData.append('style', guruFormData.style);
    formData.append('description', guruFormData.description);
    formData.append('instagram', guruFormData.instagram);
    if (newGuruImageFile) formData.append('image', newGuruImageFile);

    try {
      if (editingGuru) {
        await axios.put(`https://ruh-dance-project.onrender.com/api/gurus/${editingGuru._id}`, formData, { headers: { ...config.headers } });
        alert('Guru Updated!');
      } else {
        await axios.post('https://ruh-dance-project.onrender.com/api/gurus', formData, { headers: { ...config.headers } });
        alert('Guru Added!');
      }
      setShowGuruModal(false);
      fetchData();
    } catch (err) { 
        console.error(err);
        alert(err.response?.data?.message || err.message || 'Failed to save guru'); 
    }
  };

  const handleDeleteGuru = async (id) => {
    if (window.confirm("Delete this Guru from the system?")) {
      try {
        await axios.delete(`https://ruh-dance-project.onrender.com/api/gurus/${id}`, config);
        fetchData();
      } catch (err) { alert("Delete failed"); }
    }
  };

  // --- GALLERY COMMANDS ---
  const handleOpenGalleryModal = (item = null) => {
    if (item) {
      setEditingGalleryItem(item);
      setGalleryFormData({ title: item.title, description: item.description || '', type: item.type || 'photo', mediaUrl: item.mediaUrl });
    } else {
      setEditingGalleryItem(null);
      setGalleryFormData({ title: '', description: '', type: 'photo', mediaUrl: '' });
    }
    setGalleryFile(null);
    setShowGalleryModal(true);
  };

  const handleSaveGallery = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', galleryFormData.title);
    formData.append('description', galleryFormData.description);
    formData.append('type', galleryFormData.type);
    formData.append('mediaUrl', galleryFormData.mediaUrl);
    if (galleryFile) {
      formData.append('media', galleryFile);
    }

    try {
      if (editingGalleryItem) {
        await axios.put(`https://ruh-dance-project.onrender.com/api/gallery/${editingGalleryItem._id}`, formData, { 
          headers: { ...config.headers, 'Content-Type': 'multipart/form-data' } 
        });
        alert('Gallery Item Updated!');
      } else {
        await axios.post('https://ruh-dance-project.onrender.com/api/gallery', formData, { 
          headers: { ...config.headers, 'Content-Type': 'multipart/form-data' } 
        });
        alert('Gallery Item Added!');
      }
      setShowGalleryModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save gallery item');
    }
  };

  const handleDeleteGalleryItem = async (id) => {
    if (window.confirm("Delete this gallery item?")) {
      try {
        await axios.delete(`https://ruh-dance-project.onrender.com/api/gallery/${id}`, config);
        fetchData();
      } catch (err) { alert("Delete failed"); }
    }
  };

  // --- SETTINGS COMMANDS ---
  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setIsUpdatingSettings(true);
    const formData = new FormData();
    if (newVideoFile) {
      formData.append('homeVideoUrl', newVideoFile);
    } else {
      formData.append('homeVideoUrl', videoUrlInput);
    }

    try {
      const res = await axios.post('https://ruh-dance-project.onrender.com/api/settings', formData, {
        headers: { 
          ...config.headers 
        }
      });
      if (res.data.success) {
        alert("Settings updated successfully!");
        setSettings(res.data.data);
        setNewVideoFile(null);
        fetchData();
      }
    } catch (err) {
      alert("Failed to update settings");
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  // --- SIGNATURE (Screen photo) COMMANDS ---
  const handleOpenSignatureModal = (sig = null) => {
    if (sig) {
      setEditingSignature(sig);
      setSignatureFormData({ title: sig.title, description: sig.description, videoUrl: sig.videoUrl || '' });
    } else {
      setEditingSignature(null);
      setSignatureFormData({ title: '', description: '', videoUrl: '' });
    }
    setNewSignatureImageFile(null);
    setNewSignatureVideoFile(null);
    setShowSignatureModal(true);
  };

  const handleSaveSignature = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', signatureFormData.title);
    formData.append('description', signatureFormData.description);
    
    // Add image if selected
    if (newSignatureImageFile) {
      formData.append('image', newSignatureImageFile);
    }
    
    // Add video file if selected
    if (newSignatureVideoFile) {
      formData.append('videoUrl', newSignatureVideoFile);
    }

    try {
      if (editingSignature) {
        await axios.put(`https://ruh-dance-project.onrender.com/api/signatures/${editingSignature._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', ...config.headers }
        });
        alert('Performance Updated!');
      } else {
        // Image is optional now if video is present or if editing
        if (!newSignatureImageFile && !editingSignature && !newSignatureVideoFile) {
          return alert('Please upload at least an image or a video for the new performance.');
        }
        await axios.post('https://ruh-dance-project.onrender.com/api/signatures', formData, {
          headers: { 'Content-Type': 'multipart/form-data', ...config.headers }
        });
        alert('Performance Added!');
      }
      setShowSignatureModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save performance');
    }
  };

  const handleDeleteSignature = async (id) => {
    if (window.confirm("Delete this signature photo?")) {
      try {
        await axios.delete(`https://ruh-dance-project.onrender.com/api/signatures/${id}`, config);
        fetchData();
      } catch (err) { alert("Delete failed"); }
    }
  };


  const SidebarItem = ({ Icon, label, isActive, onClick }) => (
    <div className={`nav-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      <Icon className="nav-icon" /> {label}
    </div>
  );

  return (
    <div className="home-aesthetic-container" style={{ minHeight: '100vh' }}>
      {/* Ambient Glowing Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      <div className="admin-container" style={{ position: 'relative', zIndex: 1 }}>
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
             <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="ru-logo-placeholder">RU</div>
              <div>
                <h2 style={{ color: 'var(--brand-pink)', margin: 0, fontSize: '18px', fontWeight: '800' }}>RUH</h2>
                <p style={{ margin: 0, fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)' }}>DANCE STUDIO</p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button className="admin-hamburger d-md-none" onClick={() => setIsSidebarOpen(false)} style={{ display: window.innerWidth <= 768 ? 'block' : 'none' }}>
              <LuX size={28} />
            </button>
          </div>
        <nav className="nav-menu">
          <SidebarItem Icon={LuLayoutGrid} label="Overview" isActive={activeTab === 'Overview'} onClick={() => { setActiveTab('Overview'); setIsSidebarOpen(false); }} />
          <SidebarItem Icon={LuHistory} label="Productions" isActive={activeTab === 'Productions'} onClick={() => { setActiveTab('Productions'); setIsSidebarOpen(false); }} />
          <SidebarItem Icon={LuLayoutGrid} label="Dance Styles" isActive={activeTab === 'Dance Styles'} onClick={() => { setActiveTab('Dance Styles'); setIsSidebarOpen(false); }} />
          <SidebarItem Icon={LuUsers} label="Students" isActive={activeTab === 'Students'} onClick={() => { setActiveTab('Students'); setIsSidebarOpen(false); }} />
          <SidebarItem Icon={LuUser} label="Instructors" isActive={activeTab === 'Instructors'} onClick={() => { setActiveTab('Instructors'); setIsSidebarOpen(false); }} />
          <SidebarItem Icon={LuUser} label="Gurus" isActive={activeTab === 'Gurus'} onClick={() => { setActiveTab('Gurus'); setIsSidebarOpen(false); }} />
          <SidebarItem Icon={LuListTodo} label="Classes" isActive={activeTab === 'Classes'} onClick={() => { setActiveTab('Classes'); setIsSidebarOpen(false); }} />
          <SidebarItem Icon={LuLayoutGrid} label="Gallery" isActive={activeTab === 'Gallery'} onClick={() => { setActiveTab('Gallery'); setIsSidebarOpen(false); }} />
          <SidebarItem Icon={LuCalendarCheck} label="Events" isActive={activeTab === 'Events'} onClick={() => { setActiveTab('Events'); setIsSidebarOpen(false); }} />
          <SidebarItem Icon={LuCreditCard} label="Finance" isActive={activeTab === 'Finance'} onClick={() => { setActiveTab('Finance'); setIsSidebarOpen(false); }} />
          <SidebarItem Icon={LuSettings} label="Background Photos & Video" isActive={activeTab === 'Background Photos & Video'} onClick={() => { setActiveTab('Background Photos & Video'); setIsSidebarOpen(false); }} />
        </nav>
      </aside>

      <main className="main-content">
        {window.innerWidth <= 768 && (
          <div className="admin-mobile-header d-md-none">
             <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="ru-logo-placeholder" style={{width: 30, height: 30, fontSize: 14}}>RU</div>
              <h2 style={{marginLeft: 10}}>Admin</h2>
             </div>
             <button className="admin-hamburger" onClick={() => setIsSidebarOpen(true)}>
               <LuMenu size={28} />
             </button>
          </div>
        )}
        {activeTab === 'Overview' && (
          <>
            <header className="dashboard-header" style={{ display: window.innerWidth <= 768 ? 'none' : 'flex' }}>
              <h2>Admin Control Panel</h2>
            </header>

            <div className="stats-row-container">
                <div className="stat-card-item"><h3>TOTAL STUDENTS</h3><p>{students.length}</p></div>
                <div className="stat-card-item"><h3>INSTRUCTORS</h3><p>{instructors.length}</p></div>
                <div className="stat-card-item"><h3>PRODUCTIONS</h3><p>{productions.length}</p></div>
            </div>
          </>
        )}        {activeTab === 'Gallery' && (
          <div className="admin-content-main">
            <section className="management-card-full">
              <div className="section-header-flex" style={{ padding: '20px 25px' }}>
                <h3>Gallery Management</h3>
                <button className="add-btn" onClick={() => handleOpenGalleryModal(null)}><LuPlus /> Add Media</button>
              </div>
              <table className="management-table">
                <thead>
                  <tr><th>Type</th><th>Preview</th><th>Title</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {galleryItems.length > 0 ? galleryItems.map(item => (
                    <tr key={item._id}>
                      <td style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{item.type}</td>
                      <td>
                        {item.type === 'video' ? (
                          <div style={{width: '60px', height: '40px', background:'#333', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'4px'}}>??</div>
                        ) : (
                          <img src={item.mediaUrl} alt={item.title} style={{width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} />
                        )}
                      </td>
                      <td>{item.title}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                           <LuPencil style={{ cursor: 'pointer', color: '#722F37' }} onClick={() => handleOpenGalleryModal(item)} />
                           <LuTrash2 className="trash-delete-btn" onClick={() => handleDeleteGalleryItem(item._id)} />
                        </div>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="4" style={{textAlign:'center'}}>No gallery items found</td></tr>}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {activeTab === 'Events' && (
          <div className="admin-content-main fade-in">
            <Events isAdmin={true} fetchData={fetchData} />
          </div>
        )}

        {activeTab === 'Classes' && (
          <div className="admin-content-main fade-in">
            <ClassesAdmin />
          </div>
        )}

        {activeTab === 'Finance' && (
          <div className="admin-content-main fade-in">
            <FinanceAdmin />
          </div>
        )}

        {activeTab === 'Instructors' && (
          <div className="admin-content-main">
            <section className="management-card-full">
              <div className="management-header">
                <h3>Instructors Management</h3>
                <button className="add-btn" onClick={() => setShowAddModal(true)}><LuUserPlus /> Add Instructor</button>
              </div>
              <table className="management-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Expertise</th><th>Phone</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {instructors.length > 0 ? instructors.map(inst => (
                    <tr key={inst._id}>
                      <td>{inst.fullName || inst.name}</td>
                      <td>{inst.email}</td>
                      <td>{inst.danceStyle || inst.expertise}</td>
                      <td>{inst.phone || 'N/A'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                           <LuPencil style={{ cursor: 'pointer', color: '#722F37' }} onClick={() => handleEditClick(inst)} />
                           <LuTrash2 className="trash-delete-btn" onClick={() => handleDeleteInstructor(inst._id)} />
                        </div>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="5" style={{textAlign:'center'}}>No instructors found</td></tr>}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {activeTab === 'Students' && (
          <div className="admin-content-main">
            <section className="management-card-full">
              <div className="management-header"><h3>Registered Students</h3></div>
              <table className="management-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Dance Style</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {students.length > 0 ? students.map((s) => (
                    <tr key={s._id}>
                      <td>{s.fullName || s.name}</td>
                      <td>{s.email}</td>
                      <td>{s.danceStyle || 'N/A'}</td>
                      <td><span className="status-badge-active">Active</span></td>
                      <td><LuTrash2 className="trash-delete-btn" onClick={() => handleDeleteStudent(s._id)} /></td>
                    </tr>
                  )) : <tr><td colSpan="5" style={{textAlign:'center'}}>No students found</td></tr>}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {activeTab === 'Dance Styles' && (
          <div className="admin-content-main">
            <section className="management-card-full">
              <div className="section-header-flex" style={{ padding: '20px 25px' }}>
                <h3>Dance Styles Management</h3>
                <button className="add-btn" onClick={() => handleOpenStyleModal(null)}><LuPlus /> Add Style</button>
              </div>
              <table className="management-table">
                <thead>
                  <tr><th>Style Name</th><th>Description Snippet</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {styles.length > 0 ? styles.map(s => (
                    <tr key={s._id}>
                      <td style={{ fontWeight: 'bold' }}>{s.name}</td>
                      <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.description}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                           <LuPencil style={{ cursor: 'pointer', color: '#722F37' }} onClick={() => handleOpenStyleModal(s)} />
                           <LuTrash2 className="trash-delete-btn" onClick={() => handleDeleteStyle(s._id)} />
                        </div>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="3" style={{textAlign:'center'}}>No dance styles found</td></tr>}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {activeTab === 'Gurus' && (
          <div className="admin-content-main">
            <section className="management-card-full">
              <div className="section-header-flex" style={{ padding: '20px 25px' }}>
                <h3>Gurus Management</h3>
                <button className="add-btn" onClick={() => handleOpenGuruModal(null)}><LuPlus /> Add Guru</button>
              </div>
              <table className="management-table">
                <thead>
                  <tr><th>Name</th><th>Style</th><th>Description Snippet</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {gurus.length > 0 ? gurus.map(g => (
                    <tr key={g._id}>
                      <td style={{ fontWeight: 'bold' }}>{g.name}</td>
                      <td>{g.style}</td>
                      <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.description}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                           <LuPencil style={{ cursor: 'pointer', color: '#722F37' }} onClick={() => handleOpenGuruModal(g)} />
                           <LuTrash2 className="trash-delete-btn" onClick={() => handleDeleteGuru(g._id)} />
                        </div>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="4" style={{textAlign:'center'}}>No Gurus found</td></tr>}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {activeTab === 'Productions' && (
          <div className="fade-in" style={{ padding: '20px' }}>
            <header style={{ textAlign: 'center', marginBottom: '30px', position: 'relative' }}>
              <h2 style={{ color: '#722F37', fontSize: '2.5rem' }}>Stage Productions</h2>
              <p style={{ letterSpacing: '2px', color: '#666', fontSize: '12px' }}>WHERE STORYTELLING MEETS SPECTACLE</p>
              <button className="add-btn" style={{ position: 'absolute', right: '0', top: '10px' }} onClick={() => setShowAddProdModal(true)}>
                <LuPlus /> Add Production
              </button>
            </header>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
              maxWidth: '1100px',
              margin: 'auto'
            }}>
              {productions.length > 0 ? productions.map((prod) => (
                <div key={prod._id} className="prod-card" style={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}>
                  <div style={{ overflow: 'hidden', borderRadius: '10px 10px 0 0', position: 'relative' }}>
                    <img 
                      src={prod.image?.startsWith('http') ? prod.image : `https://ruh-dance-project.onrender.com${prod.image}`}
                      alt={prod.title} 
                      style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }} 
                    />
                    <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '10px', zIndex: 2 }}>
                        <button 
                          className="pencil-edit-overlay" 
                          onClick={() => handleEditProdClick(prod)}
                          style={{
                            backgroundColor: '#722F37', color: 'white', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}
                        >
                          <LuPencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduction(prod._id)}
                          style={{
                            backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                          }}
                        >
                          <LuTrash2 size={18} />
                        </button>
                    </div>
                  </div>

                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#722F37', fontWeight: 'bold' }}>{prod.year}</span>
                    <h3 style={{ margin: '5px 0', color: '#4B0082', fontSize: '1.4rem' }}>{prod.title}</h3>
                    <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#555' }}>{prod.subtitle}</p>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>
                  <p>No productions found in the database. Please check backend routes.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Background Photos & Video' && (
          <div className="admin-content-main fade-in">
            <div className="media-settings-split-container">
              {/* Left Column: Background Video */}
              <section className="management-card-premium video-config-card">
                <div className="section-header-flex">
                  <h3>Home Page Background Video</h3>
                </div>
                <div className="card-body-content">
                  <form onSubmit={handleUpdateSettings}>
                    <div className="settings-group">
                      <p className="helper-text">
                        Choose to either upload a video file or provide a direct video URL (MP4).
                      </p>
                      <div className="input-stack">
                        <div className="input-field-wrapper">
                          <label>Direct Video URL</label>
                          <input 
                            type="text" 
                            className="modal-form-input" 
                            placeholder="https://example.com/video.mp4"
                            value={videoUrlInput}
                            onChange={(e) => {
                              setVideoUrlInput(e.target.value);
                              setNewVideoFile(null);
                            }}
                          />
                        </div>
                        <div className="divider-or">
                          <span className="line"></span>
                          <span className="text">OR</span>
                          <span className="line"></span>
                        </div>
                        <div className="file-drop-area">
                          <label className="file-label">Upload Video File</label>
                          <input 
                            type="file" 
                            accept="video/*" 
                            onChange={(e) => {
                              setNewVideoFile(e.target.files[0]);
                              setVideoUrlInput('');
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                    {settings.homeVideoUrl && (
                      <div className="preview-video-container">
                        <label className="preview-label">Current Video Preview</label>
                        <video 
                          src={settings.homeVideoUrl.startsWith('http') ? settings.homeVideoUrl : `https://ruh-dance-project.onrender.com${settings.homeVideoUrl}`} 
                          controls 
                          muted 
                        />
                      </div>
                    )}
                    <button type="submit" className="save-btn-premium" disabled={isUpdatingSettings}>
                      {isUpdatingSettings ? 'Updating...' : 'Save Background Video'}
                    </button>
                  </form>
                </div>
              </section>

              {/* Right Column: Signature Gallery */}
              <section className="management-card-premium gallery-config-card">
                <div className="section-header-flex">
                  <div className="title-stack">
                    <h3>Signature Performances Gallery</h3>
                    <span className="subtitle">Interactive 3D Carousel</span>
                  </div>
                  <button className="add-btn-circle" onClick={() => handleOpenSignatureModal()}>
                    <LuPlus size={20} />
                  </button>
                </div>
                <div className="data-table-wrapper-glass">
                  <table className="modern-table-compact">
                    <thead>
                      <tr>
                        <th>Preview</th>
                        <th>Title</th>
                        <th>Content Status</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {signatures.map((sig) => (
                        <tr key={sig._id}>
                          <td>
                            <div className="table-img-wrapper" style={{ position: 'relative' }}>
                              {sig.image ? (
                                <img 
                                  src={sig.image.startsWith('http') ? sig.image : `https://ruh-dance-project.onrender.com${sig.image}`} 
                                  alt=""
                                />
                              ) : (
                                <div style={{ width: '50px', height: '50px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                                   <LuPlus style={{ color: '#666' }} />
                                </div>
                              )}
                              {sig.videoUrl && (
                                <div style={{ position: 'absolute', bottom: '2px', right: '2px', background: 'rgba(114, 47, 55, 0.9)', borderRadius: '50%', padding: '3px', display: 'flex' }}>
                                  <LuPlay size={10} style={{ color: 'white' }} />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="font-medium text-white-80">{sig.title}</td>
                          <td>
                            <span style={{ fontSize: '10px', color: '#aaa' }}>
                              {sig.image ? '📸 Photo ' : ''}
                              {sig.videoUrl ? '🎬 Video' : ''}
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="action-btn-row">
                              <button className="icon-btn-edit-small" onClick={() => handleOpenSignatureModal(sig)}><LuPencil /></button>
                              <button className="icon-btn-delete-small" onClick={() => handleDeleteSignature(sig._id)}><LuTrash2 /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>      {/* --- GALLERY MODAL --- */}
      <Modal isOpen={showGalleryModal} toggle={() => setShowGalleryModal(false)} centered className="dark-modal">
        <ModalHeader toggle={() => setShowGalleryModal(false)}>
          {editingGalleryItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
        </ModalHeader>
        <Form onSubmit={handleSaveGallery}>
          <ModalBody>
            <FormGroup>
              <Label>Title</Label>
              <Input className="modal-form-input" required value={galleryFormData.title} onChange={e => setGalleryFormData({...galleryFormData, title: e.target.value})} />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <Input type="textarea" className="modal-form-input" value={galleryFormData.description} onChange={e => setGalleryFormData({...galleryFormData, description: e.target.value})} />
            </FormGroup>
            <FormGroup>
              <Label>Media Type</Label>
              <Input type="select" className="modal-form-input" value={galleryFormData.type} onChange={e => setGalleryFormData({...galleryFormData, type: e.target.value})}>
                <option value="photo">Photo</option>
                <option value="video">Video</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Or Upload File (Persistent)</Label>
              <Input type="file" onChange={e => setGalleryFile(e.target.files[0])} />
            </FormGroup>
            <FormGroup>
              <Label>Direct URL (Bypass Upload)</Label>
              <Input className="modal-form-input" value={galleryFormData.mediaUrl} onChange={e => setGalleryFormData({...galleryFormData, mediaUrl: e.target.value})} placeholder="https://..." />
              <small style={{color: '#aaa', marginTop: '5px', display: 'block'}}>Providing a URL will bypass the file upload if both are present.</small>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" className="save-btn-premium">Save Item</Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* --- SIGNATURE MODALS --- */}
      <Modal isOpen={showSignatureModal} toggle={() => setShowSignatureModal(false)} centered className="dark-modal">
        <ModalHeader toggle={() => setShowSignatureModal(false)}>
          {editingSignature ? 'Edit Screen photo' : 'Add New Screen photo'}
        </ModalHeader>
        <Form onSubmit={handleSaveSignature}>
          <ModalBody>
            <FormGroup>
              <Label>Title</Label>
              <Input 
                className="modal-form-input" 
                required value={signatureFormData.title} 
                onChange={e => setSignatureFormData({...signatureFormData, title: e.target.value})} 
              />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <Input 
                type="textarea" 
                className="modal-form-input" 
                required value={signatureFormData.description} 
                onChange={e => setSignatureFormData({...signatureFormData, description: e.target.value})} 
              />
            </FormGroup>
            
            <FormGroup className="mt-3">
              <Label className="fw-bold">Upload Performance Video</Label>
              <Input 
                type="file" 
                accept="video/*"
                onChange={e => setNewSignatureVideoFile(e.target.files[0])} 
              />
              <small className="text-muted">Direct video file upload (MP4/WebM)</small>

              {(newSignatureVideoFile || signatureFormData.videoUrl) && (
                <div className="mt-2 p-2" style={{ background: '#000', borderRadius: '8px', textAlign: 'center' }}>
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    controls 
                    style={{ maxHeight: '150px', maxWidth: '100%' }}
                    src={newSignatureVideoFile ? URL.createObjectURL(newSignatureVideoFile) : (signatureFormData.videoUrl?.startsWith('http') ? signatureFormData.videoUrl : `https://ruh-dance-project.onrender.com${signatureFormData.videoUrl}`)}
                  />
                </div>
              )}
            </FormGroup>

            <FormGroup className="mt-4" style={{ padding: '15px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <Label className="fw-bold d-block mb-2">Upload Preview Image</Label>
              <Input 
                type="file" 
                accept="image/*"
                required={false} 
                onChange={e => setNewSignatureImageFile(e.target.files[0])} 
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit" className="modal-btn">Save</Button>
            <Button color="secondary" onClick={() => setShowSignatureModal(false)} className="modal-btn-cancel">Cancel</Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* --- PRODUCTION MODALS --- */}
      {editingProd && (
        <div className="PROD-MODAL-OVERLAY">
          <div className="PROD-MODAL-CONTENT">
            <h2 className="PROD-MODAL-TITLE">Edit Production</h2>
            <div className="PROD-MODAL-PREVIEW">
              <img 
                src={editFormData.image?.startsWith('http') ? editFormData.image : `https://ruh-dance-project.onrender.com${editFormData.image}`} 
                alt="Preview" 
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
            <form onSubmit={handleUpdateProduction} className="PROD-MODAL-FORM">
              <input type="text" required value={editFormData.year} onChange={e => setEditFormData({...editFormData, year: e.target.value})} placeholder="Year" />
              <input type="text" required value={editFormData.title} onChange={e => setEditFormData({...editFormData, title: e.target.value})} placeholder="Title" />
              <textarea value={editFormData.subtitle} onChange={e => setEditFormData({...editFormData, subtitle: e.target.value})} placeholder="Subtitle" />
              <div className="PROD-MODAL-UPLOAD">
                <label>Change Image (Optional):</label>
                <input type="file" onChange={e => setNewImageFile(e.target.files[0])} />
              </div>
              <div className="PROD-MODAL-ACTIONS">
                <button type="submit" className="PROD-SAVE-BTN">Save</button>
                <button type="button" className="PROD-CANCEL-BTN" onClick={() => setEditingProd(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddProdModal && (
        <div className="PROD-MODAL-OVERLAY">
          <div className="PROD-MODAL-CONTENT">
            <h2 className="PROD-MODAL-TITLE">Add Production</h2>
            <form onSubmit={handleAddProduction} className="PROD-MODAL-FORM">
              <input type="text" required value={newProdFormData.year} onChange={e => setNewProdFormData({...newProdFormData, year: e.target.value})} placeholder="Year (e.g. 2026)" />
              <input type="text" required value={newProdFormData.title} onChange={e => setNewProdFormData({...newProdFormData, title: e.target.value})} placeholder="Title of Production" />
              <textarea required value={newProdFormData.subtitle} onChange={e => setNewProdFormData({...newProdFormData, subtitle: e.target.value})} placeholder="Brief subtitle or description" />
              <div className="PROD-MODAL-UPLOAD">
                <label>Cover Image (Required):</label>
                <input type="file" required onChange={e => setAddProdImageFile(e.target.files[0])} />
              </div>
              <div className="PROD-MODAL-ACTIONS">
                <button type="submit" className="PROD-SAVE-BTN">Create</button>
                <button type="button" className="PROD-CANCEL-BTN" onClick={() => setShowAddProdModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- STYLE MODAL --- */}
      {showStyleModal && (
        <div className="modal-overlay">
          <div className="modal-content add-instructor-modal">
            <div className="modal-header">
              <h2 className="modal-title">{editingStyle ? 'Edit Dance Style' : 'Add Dance Style'}</h2>
              <LuX className="close-icon" onClick={() => setShowStyleModal(false)} />
            </div>
            <form onSubmit={handleSaveStyle} className="modal-form-grid">
              <input className="modal-form-input" style={{ gridColumn: '1 / -1' }} placeholder="Style Name (e.g., Kathak)" required value={styleFormData.name} onChange={e => setStyleFormData({...styleFormData, name: e.target.value})} />
              
              <select className="modal-form-input" style={{ gridColumn: '1 / -1' }} value={styleFormData.category} required onChange={e => setStyleFormData({...styleFormData, category: e.target.value})}>
                <option value="Classical">Classical</option>
                <option value="Contemporary">Contemporary</option>
                <option value="Folk">Folk</option>
                <option value="Jazz">Jazz</option>
                <option value="Ballet">Ballet</option>
              </select>
              
              <input 
                className="modal-form-input" 
                style={{ gridColumn: '1 / -1' }} 
                placeholder="Performance Video URL (YouTube/Direct Link)" 
                value={styleFormData.videoUrl} 
                onChange={e => setStyleFormData({...styleFormData, videoUrl: e.target.value})} 
              />
              
              <div style={{ gridColumn: '1 / -1', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '5px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#E491C9', fontSize: '0.9rem' }}>Upload Image</label>
                <input type="file" style={{ color: 'white' }} onChange={e => setNewStyleImageFile(e.target.files[0])} />
                {editingStyle && styleFormData.image && !newStyleImageFile && (
                   <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#d1d5db' }}>Current image: {styleFormData.image.split('/').pop()}</p>
                )}
              </div>

              <textarea className="modal-form-input" style={{ gridColumn: '1 / -1', minHeight: '100px', resize: 'vertical' }} placeholder="Detailed description of the style" required value={styleFormData.description} onChange={e => setStyleFormData({...styleFormData, description: e.target.value})}></textarea>
              <div className="modal-buttons-grid" style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="btn-modal save">Save Style</button>
                <button type="button" className="btn-modal cancel" onClick={() => setShowStyleModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- INSTRUCTOR MODAL --- */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content add-instructor-modal" style={{ maxWidth: '480px', padding: '30px' }}>
            <div className="modal-header" style={{ marginBottom: '15px' }}>
              <h2 className="modal-title" style={{ fontSize: '1.5rem', marginBottom: '0' }}>Add New Instructor</h2>
              <LuX className="close-icon" onClick={() => setShowAddModal(false)} />
            </div>
            <form onSubmit={handleAddInstructor} className="modal-form-grid">
              <input className="modal-form-input" placeholder="Full Name" required value={newInstructor.fullName} onChange={e => setNewInstructor({...newInstructor, fullName: e.target.value})} />
              <input className="modal-form-input" type="email" placeholder="Email Address" required value={newInstructor.email} onChange={e => setNewInstructor({...newInstructor, email: e.target.value})} />
              <input className="modal-form-input" type="password" placeholder="Initial Password" required value={newInstructor.password} onChange={e => setNewInstructor({...newInstructor, password: e.target.value})} />
              <div className="form-row-split">
                <input className="modal-form-input" type="number" placeholder="Age" required value={newInstructor.age} onChange={e => setNewInstructor({...newInstructor, age: e.target.value})} />
                <select className="modal-form-input modal-select" value={newInstructor.gender} onChange={e => setNewInstructor({...newInstructor, gender: e.target.value})} required>
                  <option value="" disabled>Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <input className="modal-form-input" placeholder="Expertise (e.g. Kathak, Bharatanatyam)" required value={newInstructor.danceStyle} onChange={e => setNewInstructor({...newInstructor, danceStyle: e.target.value})} />
              <input className="modal-form-input" type="tel" placeholder="Phone Number" required value={newInstructor.phone} onChange={e => setNewInstructor({...newInstructor, phone: e.target.value})} />
              <div className="modal-buttons-grid" style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="btn-modal save">Save Instructor</button>
                <button type="button" className="btn-modal cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- GURU MODAL --- */}
      {showGuruModal && (
        <div className="modal-overlay">
          <div className="modal-content add-instructor-modal">
            <div className="modal-header">
              <h2 className="modal-title">{editingGuru ? 'Edit Guru' : 'Add Guru'}</h2>
              <LuX className="close-icon" onClick={() => setShowGuruModal(false)} />
            </div>
            <form onSubmit={handleSaveGuru} className="modal-form-grid">
              <input className="modal-form-input" style={{ gridColumn: '1 / -1' }} placeholder="Guru Name" required value={guruFormData.name} onChange={e => setGuruFormData({...guruFormData, name: e.target.value})} />
              <input className="modal-form-input" style={{ gridColumn: '1 / -1' }} placeholder="Dance Style (e.g., Kathak)" required value={guruFormData.style} onChange={e => setGuruFormData({...guruFormData, style: e.target.value})} />
              <input className="modal-form-input" style={{ gridColumn: '1 / -1' }} placeholder="Instagram Link (Optional)" value={guruFormData.instagram} onChange={e => setGuruFormData({...guruFormData, instagram: e.target.value})} />
              
              <div style={{ gridColumn: '1 / -1', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '5px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#E491C9', fontSize: '0.9rem' }}>Upload Image</label>
                <input type="file" style={{ color: 'white' }} onChange={e => setNewGuruImageFile(e.target.files[0])} />
                {editingGuru && editingGuru.image && !newGuruImageFile && (
                   <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#d1d5db' }}>Current image uploaded.</p>
                )}
              </div>

              <textarea className="modal-form-input" style={{ gridColumn: '1 / -1', minHeight: '100px', resize: 'vertical' }} placeholder="Detailed description" required value={guruFormData.description} onChange={e => setGuruFormData({...guruFormData, description: e.target.value})}></textarea>
              <div className="modal-buttons-grid" style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="btn-modal save">Save Guru</button>
                <button type="button" className="btn-modal cancel" onClick={() => setShowGuruModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;

