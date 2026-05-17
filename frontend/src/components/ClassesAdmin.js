import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LuPlus, LuTrash2, LuPencil } from 'react-icons/lu';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

const ClassesAdmin = () => {
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const [formData, setFormData] = useState({
    className: '', instructorName: '', scheduleTime: '', capacity: ''
  });

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get('https://ruh-dance-project.onrender.com/api/classes');
      setClasses(res.data);
    } catch (err) { console.error("Error fetching classes"); }

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const instRes = await axios.get('https://ruh-dance-project.onrender.com/api/auth/instructors', config);
      setInstructors(instRes.data.instructors || instRes.data || []);
    } catch (err) { console.error("Error fetching instructors"); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen === false) {
      setEditingClass(null);
      setFormData({ className: '', instructorName: '', scheduleTime: '', capacity: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await axios.put(`https://ruh-dance-project.onrender.com/api/classes/${editingClass._id}`, formData);
      } else {
        await axios.post('https://ruh-dance-project.onrender.com/api/classes', formData);
      }
      setIsModalOpen(false); setEditingClass(null); setFormData({ className: '', instructorName: '', scheduleTime: '', capacity: '' });
      fetchData();
    } catch (err) { alert("Action Failed."); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this scheduled class?")) {
      try {
        await axios.delete(`https://ruh-dance-project.onrender.com/api/classes/${id}`);
        fetchData();
      } catch (err) { alert("Delete failed"); }
    }
  };

  const userRole = localStorage.getItem('role');

  return (
    <section className="management-card-full fade-in">
      <div className="management-header">
        <h3>Class Scheduler</h3>
        {userRole !== 'instructor' && (
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>
            <LuPlus /> Add Class
          </button>
        )}
      </div>

      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table className="management-table">
          <thead>
            <tr><th>Class Name</th><th>Instructor</th><th>Schedule</th><th>Capacity / Enrolled</th><th>Action</th></tr>
          </thead>
          <tbody>
            {classes.length > 0 ? classes.map(c => (
              <tr key={c._id}>
                <td style={{ fontWeight: 'bold' }}>{c.className}</td>
                <td>{c.instructorName}</td>
                <td>{c.scheduleTime}</td>
                <td>{c.enrolled} / {c.capacity}</td>
                <td>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <LuPencil className="icon-btn edit" onClick={() => { setEditingClass(c); setFormData(c); setIsModalOpen(true); }} />
                    <LuTrash2 className="icon-btn delete" onClick={() => handleDelete(c._id)} />
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No Classes Scheduled</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} toggle={toggleModal} centered className="dark-modal">
        <ModalHeader toggle={toggleModal} className="modal-header">
          <span className="modal-title">{editingClass ? 'Edit Class' : 'Schedule New Class'}</span>
        </ModalHeader>
        <ModalBody className="modal-body">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <input type="text" className="modal-form-input" placeholder="Class Name" required value={formData.className} onChange={e => setFormData({ ...formData, className: e.target.value })} />
            <select className="modal-form-input" style={{ backgroundColor: 'transparent', color: formData.instructorName ? 'white' : '#6c757d' }} required value={formData.instructorName} onChange={e => setFormData({ ...formData, instructorName: e.target.value })}>
              <option value="" disabled style={{ color: '#000' }}>Select Instructor</option>
              {instructors.map(inst => (
                <option key={inst._id} value={inst.fullName || inst.name} style={{ color: '#000' }}>
                  {inst.fullName || inst.name}
                </option>
              ))}
            </select>
            <input type="text" className="modal-form-input" placeholder="Schedule (e.g. Mon 6PM)" required value={formData.scheduleTime} onChange={e => setFormData({ ...formData, scheduleTime: e.target.value })} />
            <input type="number" className="modal-form-input" placeholder="Capacity" required value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} />
            <div className="modal-buttons-grid">
              <button type="submit" className="btn-modal save">Save Class</button>
              <button type="button" className="btn-modal cancel" onClick={toggleModal}>Cancel</button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </section>
  );
};

export default ClassesAdmin;
