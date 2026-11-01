import { Nav, NavItem as ReactstrapNavItem, NavLink, TabContent, TabPane, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  LuLayoutGrid, LuHistory, LuUsers, LuUser, 
  LuListTodo, LuCalendarCheck, LuCreditCard, 
  LuSettings, LuPencil, LuX, LuTrash2, LuUserPlus, LuPlus, LuPlay, LuMenu,
  LuPalette, LuImage, LuRotateCcw, LuCheck, LuBookmark, LuSave, LuSparkles
} from "react-icons/lu";
import './AdminDashboard.css';

import Events from './Events'; 
import ClassesAdmin from '../components/ClassesAdmin';
import FinanceAdmin from '../components/FinanceAdmin';
import { resolveMediaUrl } from '../utils/media';
import ReportAdmin from '../components/ReportAdmin';

const THEME_PRESETS = [
  {
    name: 'Midnight Glow (Default)',
    theme: {
      wine: '#722F37',
      brandPurple: '#982598',
      brandPink: '#E491C9',
      darkNavy: '#15173D',
      deepPurple: '#4B0082',
      lightPurple: '#D8BFD8',
      lightGray: '#F1E9E9'
    }
  },
  {
    name: 'Royal Velvet',
    theme: {
      wine: '#5C0612',
      brandPurple: '#7A1C50',
      brandPink: '#C97A9E',
      darkNavy: '#0F0914',
      deepPurple: '#3B0F2A',
      lightPurple: '#EBCBE3',
      lightGray: '#F5ECEE'
    }
  },
  {
    name: 'Emerald Oasis',
    theme: {
      wine: '#0F5132',
      brandPurple: '#146C43',
      brandPink: '#B7E4C7',
      darkNavy: '#081C15',
      deepPurple: '#1B4332',
      lightPurple: '#D8F3DC',
      lightGray: '#F4FAF6'
    }
  },
  {
    name: 'Classic Crimson',
    theme: {
      wine: '#A30000',
      brandPurple: '#B8860B',
      brandPink: '#E9C46A',
      darkNavy: '#1F1111',
      deepPurple: '#4D1212',
      lightPurple: '#F4A261',
      lightGray: '#FAECEB'
    }
  }
];

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

  // Instructor Edit State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [editInstructorData, setEditInstructorData] = useState({
    fullName: '', age: '', danceStyle: '', gender: '', phone: '', bio: '', profilePhoto: ''
  });
  const [editInstructorPhoto, setEditInstructorPhoto] = useState(null);

  // Settings State
  const [settings, setSettings] = useState({ homeVideoUrl: '' });
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [newVideoFile, setNewVideoFile] = useState(null);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [themeState, setThemeState] = useState({
    wine: '#722F37',
    brandPurple: '#982598',
    brandPink: '#E491C9',
    darkNavy: '#15173D',
    deepPurple: '#4B0082',
    lightPurple: '#D8BFD8',
    lightGray: '#F1E9E9'
  });
  const [savedThemes, setSavedThemes] = useState([]);
  const [previousTheme, setPreviousTheme] = useState(null);
  const [newThemeName, setNewThemeName] = useState('');
  const [isSavingCustomTheme, setIsSavingCustomTheme] = useState(false);

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
    setEditingInstructor(instructor);
    setEditInstructorData({
      fullName: instructor.fullName || instructor.name || '',
      age: instructor.age || '',
      danceStyle: instructor.danceStyle || instructor.expertise || '',
      gender: instructor.gender || '',
      phone: instructor.phone || '',
      bio: instructor.bio || '',
      profilePhoto: instructor.profilePhoto || ''
    });
    setEditInstructorPhoto(null);
    setShowEditModal(true);
  };

  const handleSaveInstructorEdit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('fullName', editInstructorData.fullName);
      formData.append('age', editInstructorData.age);
      formData.append('danceStyle', editInstructorData.danceStyle);
      formData.append('gender', editInstructorData.gender);
      formData.append('phone', editInstructorData.phone);
      formData.append('bio', editInstructorData.bio || '');
      
      if (editInstructorPhoto) {
        formData.append('profilePhoto', editInstructorPhoto);
      } else if (editInstructorData.profilePhoto) {
        formData.append('profilePhotoUrl', editInstructorData.profilePhoto);
      }
      
      await axios.put(`https://ruh-dance-project.onrender.com/api/auth/update-profile/${editingInstructor._id}`, formData, {
        headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
      });
      
      alert("Instructor updated successfully!");
      setShowEditModal(false);
      setEditingInstructor(null);
      setEditInstructorPhoto(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Server Error");
    }
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
        if (settingsRes.data.data.theme) {
          setThemeState(prev => ({ ...prev, ...settingsRes.data.data.theme }));
        }

        // Safely load savedThemes from server and sync with browser localStorage
        const backendSaved = settingsRes.data.data.savedThemes || [];
        let localSaved = [];
        try {
          localSaved = JSON.parse(localStorage.getItem('ruh_saved_themes') || '[]');
        } catch (e) {}

        const themeMap = new Map();
        [...backendSaved, ...localSaved].forEach(t => {
          if (t && t.name && (t.colors || t.wine)) {
            const key = t.id || t.name;
            if (!themeMap.has(key)) {
              themeMap.set(key, {
                id: t.id || ('theme_' + Date.now() + Math.random().toString(36).substr(2, 5)),
                name: t.name,
                colors: t.colors || {
                  wine: t.wine,
                  brandPurple: t.brandPurple,
                  brandPink: t.brandPink,
                  darkNavy: t.darkNavy,
                  deepPurple: t.deepPurple,
                  lightPurple: t.lightPurple,
                  lightGray: t.lightGray
                },
                createdAt: t.createdAt || new Date().toISOString()
              });
            }
          }
        });
        const finalSaved = Array.from(themeMap.values());
        setSavedThemes(finalSaved);
        localStorage.setItem('ruh_saved_themes', JSON.stringify(finalSaved));

        // Load previousTheme from server or localStorage
        let loadedPrev = settingsRes.data.data.previousTheme || null;
        if (!loadedPrev || (!loadedPrev.colors && !loadedPrev.wine)) {
          try {
            loadedPrev = JSON.parse(localStorage.getItem('ruh_previous_theme') || 'null');
          } catch (e) {}
        }
        if (loadedPrev) {
          setPreviousTheme(loadedPrev);
          localStorage.setItem('ruh_previous_theme', JSON.stringify(loadedPrev));
        }
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
      Object.entries(newInstructor).forEach(([key, val]) => {
        if (key !== 'profilePhoto') formData.append(key, val);
      });
      if (newInstructorPhoto) {
        formData.append('profilePhoto', newInstructorPhoto);
      } else if (newInstructor.profilePhoto) {
        formData.append('profilePhotoUrl', newInstructor.profilePhoto);
      }
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
    if (addProdImageFile) {
      formData.append('image', addProdImageFile);
    } else if (newProdFormData.image) {
      formData.append('imageUrl', newProdFormData.image);
    }

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
    if (newImageFile) {
      formData.append('image', newImageFile);
    } else if (editFormData.image) {
      formData.append('imageUrl', editFormData.image);
    }

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
    if (newStyleImageFile) {
      formData.append('image', newStyleImageFile);
    } else if (styleFormData.image) {
      formData.append('imageUrl', styleFormData.image);
    }

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
      setGuruFormData({ 
        name: guruToEdit.name, 
        style: guruToEdit.style, 
        description: guruToEdit.description, 
        instagram: guruToEdit.instagram || '',
        image: guruToEdit.image || ''
      });
    } else {
      setEditingGuru(null);
      setGuruFormData({ name: '', style: '', description: '', instagram: '', image: '' });
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
    if (newGuruImageFile) {
      formData.append('image', newGuruImageFile);
    } else if (guruFormData.image) {
      formData.append('imageUrl', guruFormData.image);
    }

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

    // Validate: must have either a file or a URL
    if (!galleryFile && !galleryFormData.mediaUrl.trim()) {
      return alert('Please either upload a file OR provide a direct media URL.');
    }

    const formData = new FormData();
    formData.append('title', galleryFormData.title);
    formData.append('description', galleryFormData.description);
    formData.append('type', galleryFormData.type);

    if (galleryFile) {
      // File takes priority — upload it, backend will set the Cloudinary URL
      formData.append('media', galleryFile);
    } else {
      // No file — send the URL directly
      formData.append('mediaUrl', galleryFormData.mediaUrl.trim());
    }

    try {
      if (editingGalleryItem) {
        await axios.put(`https://ruh-dance-project.onrender.com/api/gallery/${editingGalleryItem._id}`, formData, { 
          headers: { ...config.headers }
        });
        alert('Gallery Item Updated!');
      } else {
        await axios.post('https://ruh-dance-project.onrender.com/api/gallery', formData, { 
          headers: { ...config.headers }
        });
        alert('Gallery Item Added!');
      }
      setShowGalleryModal(false);
      fetchData();
    } catch (err) {
      console.error('Gallery save error details:', err.response?.data || err);
      const errorMsg = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data.replace(/<[^>]+>/g, ' ').trim() : null) || err.message || 'Unknown error';
      alert(`Failed to save gallery item: ${errorMsg}`);
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

  // --- THEME MANAGEMENT & CUSTOMIZER COMMANDS ---
  const isThemeActive = useCallback((colors) => {
    if (!colors) return false;
    const c = colors.colors || colors;
    const keys = ['wine', 'brandPurple', 'brandPink', 'darkNavy', 'deepPurple', 'lightPurple', 'lightGray'];
    return keys.every(key => (c[key] || '').toLowerCase() === (themeState[key] || '').toLowerCase());
  }, [themeState]);

  const handleColorChange = (key, value) => {
    setThemeState(prev => ({ ...prev, [key]: value }));
    const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    document.documentElement.style.setProperty(cssVarName, value);
  };

  // 1. Save Theme: Save current palette into Saved Themes list
  const handleSaveCurrentTheme = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const name = newThemeName.trim() || `My Theme #${savedThemes.length + 1}`;

    const newThemeObj = {
      id: 'theme_' + Date.now(),
      name,
      colors: { ...themeState },
      createdAt: new Date().toISOString()
    };

    const updated = [newThemeObj, ...savedThemes.filter(t => t.name.toLowerCase() !== name.toLowerCase())];
    setSavedThemes(updated);
    setNewThemeName('');
    localStorage.setItem('ruh_saved_themes', JSON.stringify(updated));

    setIsSavingCustomTheme(true);
    try {
      const res = await axios.post('https://ruh-dance-project.onrender.com/api/settings', {
        savedThemes: updated
      }, {
        headers: config.headers
      });
      if (res.data.success) {
        setSettings(res.data.data);
      }
      alert(`Theme "${name}" saved successfully to Saved Themes!`);
    } catch (err) {
      console.warn("Backend save failed, saved locally:", err);
      alert(`Theme "${name}" saved to your browser!`);
    } finally {
      setIsSavingCustomTheme(false);
    }
  };

  // 2. Apply Theme: Switch between saved themes or presets (auto-saves previousTheme)
  const handleApplyTheme = async (themeTarget, themeName) => {
    const colorsToApply = themeTarget.colors || themeTarget;
    if (!colorsToApply) return;

    // Automatically snapshot current active theme so user can switch back anytime
    const currentThemeSnapshot = {
      name: 'Previous Palette (' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ')',
      colors: { ...themeState },
      savedAt: new Date().toISOString()
    };

    setPreviousTheme(currentThemeSnapshot);
    localStorage.setItem('ruh_previous_theme', JSON.stringify(currentThemeSnapshot));

    // Instantly update UI and active CSS variables
    setThemeState(colorsToApply);
    Object.entries(colorsToApply).forEach(([key, val]) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      document.documentElement.style.setProperty(cssVarName, val);
    });

    // Save active theme & previousTheme to backend
    try {
      const res = await axios.post('https://ruh-dance-project.onrender.com/api/settings', {
        theme: colorsToApply,
        previousTheme: currentThemeSnapshot
      }, {
        headers: config.headers
      });
      if (res.data.success) {
        setSettings(res.data.data);
      }
      alert(`Theme "${themeName || 'Selected'}" applied successfully!\nYour previous theme has been saved and can be restored anytime.`);
    } catch (err) {
      console.warn("Applied locally, backend sync note:", err);
      alert(`Theme "${themeName || 'Selected'}" applied to preview! Previous theme preserved.`);
    }
  };

  // 3. Delete Theme: Remove theme from Saved Themes
  const handleDeleteTheme = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the saved theme "${name}"?`)) {
      return;
    }

    const updated = savedThemes.filter(t => t.id !== id);
    setSavedThemes(updated);
    localStorage.setItem('ruh_saved_themes', JSON.stringify(updated));

    try {
      const res = await axios.post('https://ruh-dance-project.onrender.com/api/settings', {
        savedThemes: updated
      }, {
        headers: config.headers
      });
      if (res.data.success) {
        setSettings(res.data.data);
      }
      alert(`Theme "${name}" deleted successfully.`);
    } catch (err) {
      console.warn("Backend sync failed on delete, updated locally:", err);
      alert(`Theme "${name}" deleted.`);
    }
  };

  // 4. Restore Previous Theme: Revert to the palette active prior to latest switch
  const handleRestorePreviousTheme = async () => {
    let prev = previousTheme;
    if (!prev || (!prev.colors && !prev.wine)) {
      try {
        prev = JSON.parse(localStorage.getItem('ruh_previous_theme') || 'null');
      } catch (e) {}
    }

    if (!prev || (!prev.colors && !prev.wine)) {
      alert("No previous theme found to restore yet.\nWhen you apply a new theme or preset, your previous theme is automatically captured here.");
      return;
    }

    const prevColors = prev.colors || prev;

    // Snapshot current as the new previous for undo flexibility
    const currentSnapshot = {
      name: 'Theme before restore',
      colors: { ...themeState },
      savedAt: new Date().toISOString()
    };

    setPreviousTheme(currentSnapshot);
    localStorage.setItem('ruh_previous_theme', JSON.stringify(currentSnapshot));

    setThemeState(prevColors);
    Object.entries(prevColors).forEach(([key, val]) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      document.documentElement.style.setProperty(cssVarName, val);
    });

    try {
      const res = await axios.post('https://ruh-dance-project.onrender.com/api/settings', {
        theme: prevColors,
        previousTheme: currentSnapshot
      }, {
        headers: config.headers
      });
      if (res.data.success) {
        setSettings(res.data.data);
      }
      alert("Previous theme restored successfully!");
    } catch (err) {
      alert("Previous theme restored to current preview!");
    }
  };

  // 5. Save Website Theme: Save current customized colors to live website
  const handleSaveTheme = async (e) => {
    e.preventDefault();
    setIsUpdatingSettings(true);

    const prevToSave = {
      name: 'Palette before update (' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ')',
      colors: { ...(settings.theme || themeState) },
      savedAt: new Date().toISOString()
    };
    setPreviousTheme(prevToSave);
    localStorage.setItem('ruh_previous_theme', JSON.stringify(prevToSave));

    try {
      const res = await axios.post('https://ruh-dance-project.onrender.com/api/settings', { 
        theme: themeState,
        previousTheme: prevToSave
      }, {
        headers: config.headers
      });
      if (res.data.success) {
        alert("Color theme saved successfully!");
        setSettings(res.data.data);
        fetchData();
      }
    } catch (err) {
      alert("Failed to save color theme");
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  // Revert to default preset
  const handleRevertTheme = () => {
    if (window.confirm("Reset colors to Midnight Glow (Default) preset?")) {
      handleApplyTheme(THEME_PRESETS[0].theme, THEME_PRESETS[0].name);
    }
  };

  // --- SIGNATURE (Screen photo) COMMANDS ---
  const handleOpenSignatureModal = (sig = null) => {
    if (sig) {
      setEditingSignature(sig);
      setSignatureFormData({ title: sig.title, description: sig.description, videoUrl: sig.videoUrl || '', imageUrl: sig.image || '' });
    } else {
      setEditingSignature(null);
      setSignatureFormData({ title: '', description: '', videoUrl: '', imageUrl: '' });
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
    
    // Image: prefer file, fallback to URL
    if (newSignatureImageFile) {
      formData.append('image', newSignatureImageFile);
    } else if (signatureFormData.imageUrl) {
      formData.append('imageUrl', signatureFormData.imageUrl);
    }
    
    // Video: prefer file, fallback to URL
    if (newSignatureVideoFile) {
      formData.append('videoUrl', newSignatureVideoFile);
    } else if (signatureFormData.videoUrl) {
      formData.append('videoUrl', signatureFormData.videoUrl);
    }

    try {
      if (editingSignature) {
        await axios.put(`https://ruh-dance-project.onrender.com/api/signatures/${editingSignature._id}`, formData, {
          headers: { ...config.headers }
        });
        alert('Performance Updated!');
      } else {
        const hasImage = newSignatureImageFile || signatureFormData.imageUrl;
        const hasVideo = newSignatureVideoFile || signatureFormData.videoUrl;
        if (!hasImage && !hasVideo) {
          return alert('Please upload at least an image or a video (file or URL) for the new performance.');
        }
        await axios.post('https://ruh-dance-project.onrender.com/api/signatures', formData, {
          headers: { ...config.headers }
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

      <div className="admin-container" style={{ position: 'relative' }}>
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
          <SidebarItem Icon={LuListTodo} label="Report" isActive={activeTab === 'Report'} onClick={() => { setActiveTab('Report'); setIsSidebarOpen(false); }} />
          <SidebarItem Icon={LuCalendarCheck} label="Events" isActive={activeTab === 'Events'} onClick={() => { setActiveTab('Events'); setIsSidebarOpen(false); }} />
          <SidebarItem Icon={LuCreditCard} label="Finance" isActive={activeTab === 'Finance'} onClick={() => { setActiveTab('Finance'); setIsSidebarOpen(false); }} />
          <SidebarItem Icon={LuImage} label="Background Photos & Video" isActive={activeTab === 'Background Photos & Video'} onClick={() => { setActiveTab('Background Photos & Video'); setIsSidebarOpen(false); }} />
          <SidebarItem Icon={LuPalette} label="Theme" isActive={activeTab === 'Theme'} onClick={() => { setActiveTab('Theme'); setIsSidebarOpen(false); }} />
        </nav>
      </aside>

      <main className="main-content">
        {window.innerWidth <= 768 && (
          <div className="admin-mobile-header d-md-none">
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
               <button className="admin-hamburger" onClick={() => setIsSidebarOpen(true)} style={{ marginRight: '4px' }}>
                 <LuMenu size={28} />
               </button>
               <div className="ru-logo-placeholder" style={{width: 30, height: 30, fontSize: 14}}>RU</div>
               <h2 style={{margin: 0}}>Admin</h2>
             </div>
          </div>
        )}
        {activeTab === 'Overview' && (
          <div className="admin-content-main fade-in">
             <header className="dashboard-header" style={{ display: window.innerWidth <= 768 ? 'none' : 'flex', justifyContent: 'space-between' }}>
               <h2>Admin Control Panel <span style={{fontSize: '12px', opacity: 0.5}}>(v3.2)</span></h2>
               <div style={{fontSize: '12px', color: 'var(--brand-pink)'}}>Cloud Storage Active</div>
             </header>

             <div className="stats-row-container" style={{ marginBottom: '30px' }}>
                <div className="stat-card-item"><h3>TOTAL STUDENTS</h3><p>{students.length}</p></div>
                <div className="stat-card-item"><h3>INSTRUCTORS</h3><p>{instructors.length}</p></div>
                <div className="stat-card-item"><h3>PRODUCTIONS</h3><p>{productions.length}</p></div>
             </div>

             <section className="management-card-full" style={{padding: '40px', textAlign: 'center'}}>
                <h2 style={{color: 'var(--brand-pink)'}}>Welcome to Ruh Dance Studio Admin</h2>
                <p style={{color: 'rgba(255,255,255,0.6)', marginTop: '10px'}}>Use the sidebar to manage your website content, students, and media.</p>
             </section>
          </div>
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
                          <img src={resolveMediaUrl(item.mediaUrl)} alt={item.title} style={{width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} />
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

        {activeTab === 'Report' && (
          <div className="admin-content-main fade-in">
            <ReportAdmin />
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
                      src={resolveMediaUrl(prod.image)}
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
                        <label>Direct Video URL (MP4 Only)</label>
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
                        <small style={{color: '#E491C9', fontSize: '10px', marginTop: '4px', display: 'block'}}>
                          ⚠️ NOTE: YouTube/Vimeo links do NOT work here. Use direct .mp4 links.
                        </small>
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

                    {settings.homeVideoUrl && (
                      <div className="preview-video-container">
                        <label className="preview-label">Current Video Preview</label>
                        <video 
                          src={resolveMediaUrl(settings.homeVideoUrl)} 
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
                                  src={resolveMediaUrl(sig.image)} 
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

        {activeTab === 'Theme' && (
          <div className="admin-content-main fade-in">
            {/* Theme Settings Customizer */}
            <section className="management-card-premium theme-config-card" style={{ width: '100%' }}>
              <div className="section-header-flex">
                <div className="title-stack">
                  <h3>Live Color Palette & Theme Management</h3>
                  <span className="subtitle" style={{ color: 'var(--brand-pink)' }}>
                    Re-theme the entire website and dashboards in real-time. Save custom themes, switch palettes, and restore previous themes safely.
                  </span>
                </div>
              </div>

              <div className="card-body-content" style={{ marginTop: '20px' }}>
                
                {/* 1. Restore Previous Theme Banner */}
                <div className="theme-restore-banner">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(228, 145, 201, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-pink)' }}>
                      <LuRotateCcw size={20} />
                    </div>
                    <div>
                      <h5 style={{ margin: 0, color: 'white', fontSize: '0.95rem', fontWeight: 600 }}>
                        {previousTheme ? `Previous Theme: ${previousTheme.name || 'Available'}` : 'Restore Previous Theme'}
                      </h5>
                      <p style={{ margin: '3px 0 0', color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.8rem' }}>
                        {previousTheme 
                          ? 'Quickly switch back to the theme that was active before your latest change.'
                          : 'Whenever you apply a new theme or preset, your previous theme is saved here so you can revert anytime.'}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {previousTheme && (
                      <div className="theme-palette-dots" title="Previous theme colors">
                        {['wine', 'brandPink', 'brandPurple', 'darkNavy', 'deepPurple', 'lightPurple', 'lightGray'].map((key) => {
                          const c = (previousTheme.colors || previousTheme)[key];
                          return c ? <span key={key} className="theme-dot" style={{ backgroundColor: c }} title={`${key}: ${c}`} /> : null;
                        })}
                      </div>
                    )}
                    <button 
                      type="button" 
                      className="btn-theme-action btn-theme-restore"
                      onClick={handleRestorePreviousTheme}
                      disabled={!previousTheme}
                    >
                      <LuRotateCcw size={16} /> Restore Previous Theme
                    </button>
                  </div>
                </div>

                {/* 2. Save Theme: Save Current Palette */}
                <section className="theme-section-card">
                  <div className="theme-card-title">
                    <LuBookmark style={{ color: 'var(--brand-pink)' }} />
                    <span>Save Theme: Save Current Palette</span>
                  </div>
                  <div className="theme-card-subtitle">
                    Save your current customized colors into your personal Saved Themes list before switching or testing new themes.
                  </div>
                  <form onSubmit={handleSaveCurrentTheme} className="theme-save-form">
                    <input 
                      type="text" 
                      className="theme-name-input"
                      placeholder="Enter theme name (e.g., Royal Maroon Velvet, Deep Sunset, Neon Dusk)..."
                      value={newThemeName}
                      onChange={(e) => setNewThemeName(e.target.value)}
                    />
                    <button 
                      type="submit" 
                      className="btn-theme-action btn-theme-save"
                      disabled={isSavingCustomTheme}
                    >
                      <LuSave size={16} /> {isSavingCustomTheme ? 'Saving Theme...' : 'Save Theme'}
                    </button>
                  </form>
                </section>

                {/* 3. Saved Themes: List previously saved themes with Apply & Delete */}
                <section className="theme-section-card">
                  <div className="theme-card-title">
                    <LuPalette style={{ color: 'var(--brand-pink)' }} />
                    <span>Saved Themes ({savedThemes.length})</span>
                  </div>
                  <div className="theme-card-subtitle">
                    Display of previously saved themes. Click "Apply Theme" to switch palettes, or "Delete Theme" to remove ones you no longer need.
                  </div>

                  {savedThemes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px 20px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '12px', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                      <LuSparkles size={28} style={{ color: 'var(--brand-pink)', marginBottom: '8px' }} />
                      <p style={{ color: 'white', margin: '0 0 5px', fontWeight: 600 }}>No custom saved themes yet</p>
                      <p style={{ color: 'rgba(255, 255, 255, 0.5)', margin: 0, fontSize: '0.85rem' }}>
                        Pick your colors below and click <strong>"Save Theme"</strong> to save your favorite palettes here!
                      </p>
                    </div>
                  ) : (
                    <div className="saved-themes-grid">
                      {savedThemes.map((saved) => {
                        const active = isThemeActive(saved.colors || saved);
                        return (
                          <div key={saved.id || saved.name} className={`saved-theme-card ${active ? 'active-card' : ''}`}>
                            <div className="theme-card-head">
                              <div>
                                <h6 className="theme-card-name">{saved.name}</h6>
                                <div className="theme-card-date">
                                  {saved.createdAt ? new Date(saved.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Saved Palette'}
                                </div>
                              </div>
                              {active && (
                                <span className="theme-active-tag">
                                  <LuCheck size={12} /> Active
                                </span>
                              )}
                            </div>

                            <div className="theme-palette-dots" title="Color palette preview">
                              {['wine', 'brandPink', 'brandPurple', 'darkNavy', 'deepPurple', 'lightPurple', 'lightGray'].map((key) => {
                                const colorVal = (saved.colors || saved)[key];
                                return colorVal ? (
                                  <span key={key} className="theme-dot" style={{ backgroundColor: colorVal }} title={`${key}: ${colorVal}`} />
                                ) : null;
                              })}
                            </div>

                            <div className="theme-card-actions">
                              <button 
                                type="button" 
                                className={`btn-card-apply ${active ? 'is-active' : ''}`}
                                onClick={() => handleApplyTheme(saved.colors || saved, saved.name)}
                              >
                                {active ? <><LuCheck size={14} /> Applied</> : <><LuSparkles size={14} /> Apply Theme</>}
                              </button>
                              <button 
                                type="button" 
                                className="btn-card-delete"
                                title="Delete this saved theme"
                                onClick={() => handleDeleteTheme(saved.id, saved.name)}
                              >
                                <LuTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

                {/* 4. Curated Presets */}
                <div className="presets-container" style={{ marginBottom: '30px' }}>
                  <h5 style={{ color: 'white', fontSize: '1rem', marginBottom: '15px' }}>One-Click Curated Presets:</h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {THEME_PRESETS.map((preset) => {
                      const active = isThemeActive(preset.theme);
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          className="modern-btn"
                          style={{
                            padding: '8px 18px',
                            fontSize: '0.85rem',
                            background: active ? 'linear-gradient(135deg, var(--wine), var(--brand-purple))' : 'rgba(255, 255, 255, 0.05)',
                            border: active ? '1px solid var(--brand-pink)' : '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            color: 'white',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onClick={() => handleApplyTheme(preset.theme, preset.name)}
                        >
                          {active && <LuCheck size={14} />} {preset.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Live Color Customizer */}
                <form onSubmit={handleSaveTheme}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    <div className="settings-group" style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <h6 style={{ color: 'var(--brand-pink)', marginBottom: '15px', fontWeight: 'bold' }}>Core Brand Accents</h6>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ fontSize: '0.9rem', color: '#ccc' }}>Primary Accent (Wine):</label>
                          <input type="color" value={themeState.wine} onChange={(e) => handleColorChange('wine', e.target.value)} style={{ border: 'none', background: 'transparent', width: '50px', height: '35px', cursor: 'pointer' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ fontSize: '0.9rem', color: '#ccc' }}>Brand Accent (Pink):</label>
                          <input type="color" value={themeState.brandPink} onChange={(e) => handleColorChange('brandPink', e.target.value)} style={{ border: 'none', background: 'transparent', width: '50px', height: '35px', cursor: 'pointer' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ fontSize: '0.9rem', color: '#ccc' }}>Glow Overlay (Purple):</label>
                          <input type="color" value={themeState.brandPurple} onChange={(e) => handleColorChange('brandPurple', e.target.value)} style={{ border: 'none', background: 'transparent', width: '50px', height: '35px', cursor: 'pointer' }} />
                        </div>
                      </div>
                    </div>

                    <div className="settings-group" style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <h6 style={{ color: 'var(--brand-pink)', marginBottom: '15px', fontWeight: 'bold' }}>Website Base & Cards</h6>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ fontSize: '0.9rem', color: '#ccc' }}>Base Background (Navy):</label>
                          <input type="color" value={themeState.darkNavy} onChange={(e) => handleColorChange('darkNavy', e.target.value)} style={{ border: 'none', background: 'transparent', width: '50px', height: '35px', cursor: 'pointer' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ fontSize: '0.9rem', color: '#ccc' }}>Deep Accent (Purple):</label>
                          <input type="color" value={themeState.deepPurple} onChange={(e) => handleColorChange('deepPurple', e.target.value)} style={{ border: 'none', background: 'transparent', width: '50px', height: '35px', cursor: 'pointer' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ fontSize: '0.9rem', color: '#ccc' }}>Secondary Overlay (Light Purple):</label>
                          <input type="color" value={themeState.lightPurple} onChange={(e) => handleColorChange('lightPurple', e.target.value)} style={{ border: 'none', background: 'transparent', width: '50px', height: '35px', cursor: 'pointer' }} />
                        </div>
                      </div>
                    </div>

                    <div className="settings-group" style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <h6 style={{ color: 'var(--brand-pink)', marginBottom: '15px', fontWeight: 'bold' }}>Typography Colors</h6>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ fontSize: '0.9rem', color: '#ccc' }}>Text Primary (Light Gray):</label>
                          <input type="color" value={themeState.lightGray} onChange={(e) => handleColorChange('lightGray', e.target.value)} style={{ border: 'none', background: 'transparent', width: '50px', height: '35px', cursor: 'pointer' }} />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px', lineHeight: '1.4' }}>
                          💡 <strong>Real-time Preview:</strong> Changing these colors instantly updates your current screen styling so you can view how it feels before saving.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <button type="submit" className="save-btn-premium" style={{ flex: 2, minWidth: '220px' }} disabled={isUpdatingSettings}>
                      {isUpdatingSettings ? 'Saving Theme...' : 'Save Website Theme'}
                    </button>
                    <button 
                      type="button" 
                      className="save-btn-premium" 
                      style={{ flex: 1, minWidth: '180px', background: 'rgba(228, 145, 201, 0.15)', border: '1px solid rgba(228, 145, 201, 0.3)', color: 'var(--brand-pink)' }} 
                      onClick={handleRestorePreviousTheme}
                      disabled={!previousTheme}
                    >
                      <LuRotateCcw size={15} style={{ marginRight: '6px' }} /> Restore Previous Theme
                    </button>
                    <button 
                      type="button" 
                      className="save-btn-premium" 
                      style={{ flex: 1, minWidth: '150px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }} 
                      onClick={handleRevertTheme}
                    >
                      Reset to Default
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* --- GALLERY MODAL --- */}
      <Modal isOpen={showGalleryModal} toggle={() => setShowGalleryModal(false)} centered className="dark-modal">
        <ModalHeader toggle={() => setShowGalleryModal(false)}>
          {editingGalleryItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
        </ModalHeader>
        <Form onSubmit={handleSaveGallery}>
          <ModalBody>
            <FormGroup>
              <Label>Title *</Label>
              <Input className="modal-form-input" required value={galleryFormData.title} onChange={e => setGalleryFormData({...galleryFormData, title: e.target.value})} placeholder="e.g. Kathak Performance" />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <Input type="textarea" className="modal-form-input" value={galleryFormData.description} onChange={e => setGalleryFormData({...galleryFormData, description: e.target.value})} placeholder="Brief caption..." />
            </FormGroup>
            <FormGroup>
              <Label>Media Type</Label>
              <Input type="select" className="modal-form-input" value={galleryFormData.type} onChange={e => setGalleryFormData({...galleryFormData, type: e.target.value})}>
                <option value="photo">📸 Photo</option>
                <option value="video">🎬 Video</option>
              </Input>
            </FormGroup>

            {/* Dual upload option */}
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
              <Label style={{ color: '#E491C9', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>📁 Upload File</Label>
              <Input
                type="file"
                accept={galleryFormData.type === 'video' ? 'video/*' : 'image/*'}
                onChange={e => {
                  setGalleryFile(e.target.files[0]);
                  setGalleryFormData({...galleryFormData, mediaUrl: ''});
                }}
              />
              {galleryFile && <small style={{ color: '#aaa', display: 'block', marginTop: '6px' }}>✅ File selected: {galleryFile.name}</small>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0', color: 'rgba(255,255,255,0.3)' }}>
              <span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>OR</span>
              <span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px' }}>
              <Label style={{ color: '#E491C9', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>🔗 Direct URL</Label>
              <Input
                className="modal-form-input"
                value={galleryFormData.mediaUrl}
                onChange={e => {
                  setGalleryFormData({...galleryFormData, mediaUrl: e.target.value});
                  if (e.target.value) setGalleryFile(null);
                }}
                placeholder="https://res.cloudinary.com/... or any direct media URL"
              />
              <small style={{ color: '#aaa', marginTop: '5px', display: 'block' }}>Paste a Cloudinary, CDN, or direct image/video link.</small>
            </div>
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
            
            {/* Performance Video — File OR URL */}
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '15px', marginBottom: '12px' }}>
              <Label style={{ color: '#E491C9', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>🎬 Performance Video</Label>
              <Input 
                type="file" 
                accept="video/*"
                onChange={e => {
                  setNewSignatureVideoFile(e.target.files[0]);
                  setSignatureFormData({...signatureFormData, videoUrl: ''});
                }} 
              />
              <small style={{ color: 'rgba(255,255,255,0.5)', display: 'block', marginTop: '4px', marginBottom: '10px' }}>Upload MP4/WebM file</small>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0', color: 'rgba(255,255,255,0.3)' }}>
                <span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>OR PASTE URL</span>
                <span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              </div>
              
              <Input
                className="modal-form-input"
                placeholder="https://res.cloudinary.com/... (direct .mp4 URL)"
                value={signatureFormData.videoUrl}
                onChange={e => {
                  setSignatureFormData({...signatureFormData, videoUrl: e.target.value});
                  if (e.target.value) setNewSignatureVideoFile(null);
                }}
              />

              {(newSignatureVideoFile || signatureFormData.videoUrl) && (
                <div className="mt-2 p-2" style={{ background: '#000', borderRadius: '8px', textAlign: 'center' }}>
                  <video 
                    autoPlay loop muted controls 
                    style={{ maxHeight: '150px', maxWidth: '100%' }}
                    src={newSignatureVideoFile ? URL.createObjectURL(newSignatureVideoFile) : resolveMediaUrl(signatureFormData.videoUrl)}
                  />
                </div>
              )}
            </div>

            {/* Preview Image — File OR URL */}
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '15px' }}>
              <Label style={{ color: '#E491C9', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>📸 Preview Image</Label>
              <Input 
                type="file" 
                accept="image/*"
                onChange={e => setNewSignatureImageFile(e.target.files[0])} 
              />
              <small style={{ color: 'rgba(255,255,255,0.5)', display: 'block', marginTop: '4px', marginBottom: '10px' }}>Upload image file</small>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0', color: 'rgba(255,255,255,0.3)' }}>
                <span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>OR PASTE URL</span>
                <span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              </div>

              <Input
                className="modal-form-input"
                placeholder="https://res.cloudinary.com/... (direct image URL)"
                value={signatureFormData.imageUrl || ''}
                onChange={e => setSignatureFormData({...signatureFormData, imageUrl: e.target.value})}
              />
            </div>
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
                src={resolveMediaUrl(editFormData.image)} 
                alt="Preview" 
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
            <form onSubmit={handleUpdateProduction} className="PROD-MODAL-FORM">
              <input type="text" required value={editFormData.year} onChange={e => setEditFormData({...editFormData, year: e.target.value})} placeholder="Year" />
              <input type="text" required value={editFormData.title} onChange={e => setEditFormData({...editFormData, title: e.target.value})} placeholder="Title" />
              <textarea value={editFormData.subtitle} onChange={e => setEditFormData({...editFormData, subtitle: e.target.value})} placeholder="Subtitle" />
              <div className="PROD-MODAL-UPLOAD">
                <label>Change Image (Choose File):</label>
                <input type="file" onChange={e => setNewImageFile(e.target.files[0])} />
                <div style={{marginTop: '10px'}}>
                  <label>Or Paste Image URL:</label>
                  <input type="text" value={editFormData.image} onChange={e => setEditFormData({...editFormData, image: e.target.value})} placeholder="https://..." style={{width: '100%', padding: '8px', background: '#333', border: '1px solid #555', color: 'white'}} />
                </div>
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
                <label>Cover Image (Choose File):</label>
                <input type="file" onChange={e => setAddProdImageFile(e.target.files[0])} />
                <div style={{marginTop: '10px'}}>
                  <label>Or Paste Image URL:</label>
                  <input type="text" value={newProdFormData.image} onChange={e => setNewProdFormData({...newProdFormData, image: e.target.value})} placeholder="https://..." style={{width: '100%', padding: '8px', background: '#333', border: '1px solid #555', color: 'white'}} />
                </div>
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
              
              <div style={{ gridColumn: '1 / -1', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#E491C9', fontSize: '0.9rem', fontWeight: 'bold' }}>Style Image</label>
                <input type="file" style={{ color: 'white', marginBottom: '10px' }} onChange={e => setNewStyleImageFile(e.target.files[0])} />
                <input 
                  className="modal-form-input" 
                  placeholder="Or Paste Image URL (https://...)" 
                  value={styleFormData.image} 
                  onChange={e => setStyleFormData({...styleFormData, image: e.target.value})} 
                />
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
              
              <div style={{ gridColumn: '1 / -1', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#E491C9', fontSize: '0.9rem', fontWeight: 'bold' }}>Profile Photo</label>
                <input type="file" style={{ color: 'white', marginBottom: '10px' }} onChange={e => setNewInstructorPhoto(e.target.files[0])} />
                <input 
                  className="modal-form-input" 
                  placeholder="Or Paste Photo URL (https://...)" 
                  value={newInstructor.profilePhoto} 
                  onChange={e => setNewInstructor({...newInstructor, profilePhoto: e.target.value})} 
                />
              </div>
              <div className="modal-buttons-grid" style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="btn-modal save">Save Instructor</button>
                <button type="button" className="btn-modal cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT INSTRUCTOR MODAL --- */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content add-instructor-modal" style={{ maxWidth: '480px', padding: '30px' }}>
            <div className="modal-header" style={{ marginBottom: '15px' }}>
              <h2 className="modal-title" style={{ fontSize: '1.5rem', marginBottom: '0' }}>Edit Instructor</h2>
              <LuX className="close-icon" onClick={() => { setShowEditModal(false); setEditingInstructor(null); }} />
            </div>
            <form onSubmit={handleSaveInstructorEdit} className="modal-form-grid">
              <input className="modal-form-input" placeholder="Full Name" required value={editInstructorData.fullName} onChange={e => setEditInstructorData({...editInstructorData, fullName: e.target.value})} />
              
              <div className="form-row-split">
                <input className="modal-form-input" type="number" placeholder="Age" required value={editInstructorData.age} onChange={e => setEditInstructorData({...editInstructorData, age: e.target.value})} />
                <select className="modal-form-input modal-select" value={editInstructorData.gender} onChange={e => setEditInstructorData({...editInstructorData, gender: e.target.value})} required>
                  <option value="" disabled>Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <input className="modal-form-input" placeholder="Expertise (e.g. Kathak, Bharatanatyam)" required value={editInstructorData.danceStyle} onChange={e => setEditInstructorData({...editInstructorData, danceStyle: e.target.value})} />
              <input className="modal-form-input" type="tel" placeholder="Phone Number" required value={editInstructorData.phone} onChange={e => setEditInstructorData({...editInstructorData, phone: e.target.value})} />
              <textarea className="modal-form-input" placeholder="Bio" style={{ gridColumn: '1 / -1', minHeight: '80px', resize: 'vertical' }} value={editInstructorData.bio} onChange={e => setEditInstructorData({...editInstructorData, bio: e.target.value})}></textarea>
              
              <div style={{ gridColumn: '1 / -1', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#E491C9', fontSize: '0.9rem', fontWeight: 'bold' }}>Profile Photo</label>
                <input type="file" style={{ color: 'white', marginBottom: '10px' }} onChange={e => setEditInstructorPhoto(e.target.files[0])} />
                <input 
                  className="modal-form-input" 
                  placeholder="Or Paste Photo URL (https://...)" 
                  value={editInstructorData.profilePhoto} 
                  onChange={e => setEditInstructorData({...editInstructorData, profilePhoto: e.target.value})} 
                />
              </div>
              <div className="modal-buttons-grid" style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="btn-modal save">Update Instructor</button>
                <button type="button" className="btn-modal cancel" onClick={() => { setShowEditModal(false); setEditingInstructor(null); }}>Cancel</button>
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
              
              <div style={{ gridColumn: '1 / -1', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#E491C9', fontSize: '0.9rem', fontWeight: 'bold' }}>Guru Image</label>
                <input type="file" style={{ color: 'white', marginBottom: '10px' }} onChange={e => setNewGuruImageFile(e.target.files[0])} />
                <input 
                  className="modal-form-input" 
                  placeholder="Or Paste Image URL (https://...)" 
                  value={guruFormData.image} 
                  onChange={e => setGuruFormData({...guruFormData, image: e.target.value})} 
                />
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

