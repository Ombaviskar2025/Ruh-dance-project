import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { LuPlus, LuTrash2, LuMail } from 'react-icons/lu';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

const FinanceAdmin = () => {
  const [activeSubTab, setActiveSubTab] = useState('Ledger'); // Ledger or Fees
  const [transactions, setTransactions] = useState([]);
  const [students, setStudents] = useState([]);
  const [feeRates, setFeeRates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'INCOME', 
    amount: '', 
    category: '', 
    description: '',
    studentId: '',
    isFeePayment: false,
    sendEmail: true,
    paymentMethod: 'Cash'
  });

  const [feeFormData, setFeeFormData] = useState({
    category: '', amount: '', duration: 'Monthly', id: null
  });

  const fetchData = useCallback(async () => {
    try {
      const [transRes, studentRes, feeRes] = await Promise.all([
        axios.get('https://ruh-dance-project.onrender.com/api/finance'),
        axios.get('https://ruh-dance-project.onrender.com/api/auth/students', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('https://ruh-dance-project.onrender.com/api/finance/fee-rates')
      ]);
      setTransactions(transRes.data);
      setStudents(studentRes.data.students || studentRes.data || []);
      setFeeRates(feeRes.data);
    } catch (err) { console.error("Error fetching finance data", err); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleFeeModal = () => setIsFeeModalOpen(!isFeeModalOpen);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://ruh-dance-project.onrender.com/api/finance', formData);
      setIsModalOpen(false); 
      setFormData({
        type: 'INCOME', amount: '', category: '', description: '', 
        studentId: '', isFeePayment: false, sendEmail: true, paymentMethod: 'Cash'
      });
      fetchData();
      alert("Transaction recorded successfully!");
    } catch (err) { alert("Failed to save transaction."); }
  };

  const handleFeeSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://ruh-dance-project.onrender.com/api/finance/fee-rates', feeFormData);
      setIsFeeModalOpen(false);
      setFeeFormData({ category: '', amount: '', duration: 'Monthly', id: null });
      fetchData();
    } catch (err) { alert("Failed to save fee rate."); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete this financial record?")) {
      try {
        await axios.delete(`https://ruh-dance-project.onrender.com/api/finance/${id}`);
        fetchData();
      } catch (err) { alert("Delete failed"); }
    }
  };

  const handleDeleteFee = async (id) => {
    if (window.confirm("Delete this fee structure?")) {
      try {
        await axios.delete(`https://ruh-dance-project.onrender.com/api/finance/fee-rates/${id}`);
        fetchData();
      } catch (err) { alert("Delete failed"); }
    }
  };

  const handleStudentSelect = (studentId) => {
    const student = students.find(s => s._id === studentId);
    if (student) {
        // Try to find a matching fee rate for their dance style
        const matchingRate = feeRates.find(r => r.category.toLowerCase().includes(student.danceStyle?.toLowerCase()));
        setFormData({
            ...formData,
            studentId,
            isFeePayment: true,
            category: 'Student Fee',
            amount: matchingRate ? matchingRate.amount : '',
            description: `Fee payment for ${student.fullName} (${student.danceStyle})`
        });
    }
  };

  // Calculations
  const metrics = useMemo(() => {
    let income = 0; let expense = 0;
    transactions.forEach(t => {
        if (t.type === 'INCOME') income += t.amount;
        else expense += t.amount;
    });
    return { income, expense, net: income - expense };
  }, [transactions]);

  return (
    <section className="management-card-full fade-in">
      <div className="management-header">
        <div style={{ display: 'flex', gap: '20px' }}>
            <h3 
              onClick={() => setActiveSubTab('Ledger')} 
              style={{ cursor: 'pointer', opacity: activeSubTab === 'Ledger' ? 1 : 0.4, borderBottom: activeSubTab === 'Ledger' ? '2px solid var(--brand-pink)' : 'none', paddingBottom: '10px' }}
            >
                Finance Ledger
            </h3>
            <h3 
              onClick={() => setActiveSubTab('Fees')} 
              style={{ cursor: 'pointer', opacity: activeSubTab === 'Fees' ? 1 : 0.4, borderBottom: activeSubTab === 'Fees' ? '2px solid var(--brand-pink)' : 'none', paddingBottom: '10px' }}
            >
                Fee Structures
            </h3>
        </div>
        <button className="add-btn" onClick={() => activeSubTab === 'Ledger' ? setIsModalOpen(true) : setIsFeeModalOpen(true)}>
          <LuPlus /> {activeSubTab === 'Ledger' ? 'New Record' : 'Add Structure'}
        </button>
      </div>

      {activeSubTab === 'Ledger' ? (
        <>
            <div className="finance-summary-grid" style={{ padding: '0 35px', marginTop: '30px' }}>
                <div className="stat-card-item" style={{ background: 'rgba(40, 167, 69, 0.1)', borderColor: 'rgba(40, 167, 69, 0.2)' }}>
                    <h5 style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Revenue</h5>
                    <h3 style={{ margin: 0, color: '#28a745', fontSize: '1.8rem' }}>₹{metrics.income.toLocaleString()}</h3>
                </div>
                <div className="stat-card-item" style={{ background: 'rgba(220, 53, 69, 0.1)', borderColor: 'rgba(220, 53, 69, 0.2)' }}>
                    <h5 style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Expenses</h5>
                    <h3 style={{ margin: 0, color: '#dc3545', fontSize: '1.8rem' }}>₹{metrics.expense.toLocaleString()}</h3>
                </div>
                <div className="stat-card-item" style={{ background: 'rgba(228, 145, 201, 0.1)', borderColor: 'rgba(228, 145, 201, 0.2)' }}>
                    <h5 style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Net Balance</h5>
                    <h3 style={{ margin: 0, color: 'var(--brand-pink)', fontSize: '1.8rem' }}>₹{metrics.net.toLocaleString()}</h3>
                </div>
            </div>

            <table className="management-table">
                <thead>
                    <tr><th>Date</th><th>Type</th><th>Category</th><th>Description</th><th>Amount</th><th className="text-right">Action</th></tr>
                </thead>
                <tbody>
                    {transactions.map(t => (
                        <tr key={t._id}>
                            <td>{new Date(t.date).toLocaleDateString()}</td>
                            <td>
                                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', background: t.type === 'INCOME' ? 'rgba(40,167,69,0.2)' : 'rgba(220,53,69,0.2)', color: t.type === 'INCOME' ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                                    {t.type}
                                </span>
                            </td>
                            <td>
                                <strong>{t.category}</strong>
                                {t.studentId && <div style={{ fontSize: '11px', color: 'var(--brand-pink)' }}>{t.studentId.fullName}</div>}
                            </td>
                            <td style={{ fontSize: '13px', opacity: 0.7 }}>{t.description}</td>
                            <td style={{ fontWeight: 'bold', color: t.type === 'INCOME' ? '#28a745' : '#dc3545' }}>
                                {t.type === 'INCOME' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                    {t.studentId && t.isFeePayment && <LuMail style={{ color: '#007bff', cursor: 'pointer' }} title="Receipt sent" />}
                                    <LuTrash2 className="icon-btn delete" onClick={() => handleDelete(t._id)} />
                                </div>
                            </td>
                        </tr>
                    ))}
                    {transactions.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', opacity: 0.5 }}>No financial records found.</td></tr>}
                </tbody>
            </table>
        </>
      ) : (
        <table className="management-table">
            <thead>
                <tr><th>Category / Style</th><th>Amount</th><th>Duration</th><th className="text-right">Action</th></tr>
            </thead>
            <tbody>
                {feeRates.map(r => (
                    <tr key={r._id}>
                        <td style={{ fontWeight: 'bold' }}>{r.category}</td>
                        <td style={{ fontSize: '1.1rem', color: 'var(--brand-pink)' }}>₹{r.amount.toLocaleString()}</td>
                        <td><span style={{ background: 'rgba(255,255,255,0.05)', padding: '3px 12px', borderRadius: '15px', fontSize: '11px' }}>{r.duration}</span></td>
                        <td>
                            <LuTrash2 className="icon-btn delete" onClick={() => handleDeleteFee(r._id)} />
                        </td>
                    </tr>
                ))}
                {feeRates.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', opacity: 0.5 }}>No fee structures defined yet.</td></tr>}
            </tbody>
        </table>
      )}

      {/* --- TRANSACTION MODAL --- */}
      <Modal isOpen={isModalOpen} toggle={toggleModal} centered className="dark-modal">
        <ModalHeader toggle={toggleModal} className="modal-header">
           <span className="modal-title">Record New Transaction</span>
        </ModalHeader>
        <ModalBody className="modal-body">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <button 
                        type="button" 
                        onClick={() => setFormData({...formData, type: 'INCOME'})}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: formData.type === 'INCOME' ? 'rgba(40, 167, 69, 0.2)' : 'transparent', color: formData.type === 'INCOME' ? '#28a745' : '#aaa', cursor: 'pointer' }}
                    >
                        Income
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setFormData({...formData, type: 'EXPENSE'})}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: formData.type === 'EXPENSE' ? 'rgba(220, 53, 69, 0.2)' : 'transparent', color: formData.type === 'EXPENSE' ? '#dc3545' : '#aaa', cursor: 'pointer' }}
                    >
                        Expense
                    </button>
                </div>

                <input 
                  type="number" className="modal-form-input" placeholder="Amount (₹)" required 
                  value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} 
                />

                {formData.type === 'INCOME' && (
                  <div style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '11px', color: 'var(--brand-pink)', display: 'block', marginBottom: '5px' }}>Link to Student (Optional)</label>
                      <select 
                        className="modal-form-input"
                        value={formData.studentId}
                        onChange={(e) => handleStudentSelect(e.target.value)}
                      >
                          <option value="">-- Generic Income --</option>
                          {students.map(s => (
                              <option key={s._id} value={s._id}>{s.fullName} ({s.danceStyle})</option>
                          ))}
                      </select>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" className="modal-form-input" placeholder="Category" required 
                      value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} 
                    />
                    <select 
                       className="modal-form-input"
                       value={formData.paymentMethod}
                       onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                    >
                          <option value="Cash">Cash</option>
                          <option value="Online / UPI">Online / UPI</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                </div>

                <textarea 
                  className="modal-form-input" placeholder="Description of the transaction..." 
                  rows="2" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
                  style={{ minHeight: '80px' }}
                />

                {formData.studentId && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                            <LuMail style={{ color: 'var(--brand-pink)' }} />
                            <span>Send payment slip to student?</span>
                        </div>
                        <input 
                          type="checkbox" checked={formData.sendEmail} 
                          onChange={e => setFormData({...formData, sendEmail: e.target.checked})}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--brand-purple)' }}
                        />
                    </div>
                )}

                <div className="modal-buttons-grid">
                    <button type="submit" className="btn-modal save">Save Record</button>
                    <button type="button" className="btn-modal cancel" onClick={toggleModal}>Cancel</button>
                </div>
            </form>
        </ModalBody>
      </Modal>

      {/* --- FEE RATE MODAL --- */}
      <Modal isOpen={isFeeModalOpen} toggle={toggleFeeModal} centered className="dark-modal">
        <ModalHeader toggle={toggleFeeModal} className="modal-header">
           <span className="modal-title">Configure Fee Structure</span>
        </ModalHeader>
        <ModalBody className="modal-body">
            <form onSubmit={handleFeeSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <input 
                    type="text" className="modal-form-input" placeholder="Category (e.g. Kathak Adv)" 
                    required value={feeFormData.category} onChange={e => setFeeFormData({...feeFormData, category: e.target.value})}
                />
                <input 
                    type="number" className="modal-form-input" placeholder="Amount (₹)" 
                    required value={feeFormData.amount} onChange={e => setFeeFormData({...feeFormData, amount: e.target.value})}
                />
                <select 
                    className="modal-form-input"
                    value={feeFormData.duration} onChange={e => setFeeFormData({...feeFormData, duration: e.target.value})}
                >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="One-Time">One-Time Registration</option>
                </select>
                <div className="modal-buttons-grid">
                    <button type="submit" className="btn-modal save">Save Rate</button>
                    <button type="button" className="btn-modal cancel" onClick={toggleFeeModal}>Cancel</button>
                </div>
            </form>
        </ModalBody>
      </Modal>
    </section>
  );
};

export default FinanceAdmin;
