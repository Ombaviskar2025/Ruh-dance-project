import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import './ReportAdmin.css';

const API = 'https://ruh-dance-project.onrender.com/api';

const ReportAdmin = () => {
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [classes, setClasses] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [financeData, setFinanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const config = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [sRes, iRes, cRes, gRes, eRes, fRes] = await Promise.allSettled([
          axios.get(`${API}/auth/students`, config),
          axios.get(`${API}/auth/instructors`, config),
          axios.get(`${API}/classes`, config),
          axios.get(`${API}/gallery`),
          axios.get(`${API}/events`),
          axios.get(`${API}/finance`, config),
        ]);
        if (sRes.status === 'fulfilled') setStudents(sRes.value.data.students || sRes.value.data || []);
        if (iRes.status === 'fulfilled') setInstructors(iRes.value.data.instructors || iRes.value.data || []);
        if (cRes.status === 'fulfilled') setClasses(cRes.value.data.data || cRes.value.data || []);
        if (gRes.status === 'fulfilled') setGalleryItems(gRes.value.data.data || gRes.value.data || []);
        if (eRes.status === 'fulfilled') setEvents(eRes.value.data.data || eRes.value.data || []);
        if (fRes.status === 'fulfilled') setFinanceData(fRes.value.data.data || fRes.value.data || []);
      } catch (err) {
        console.error('Report fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [config]);

  // Derived stats
  const totalPhotos = galleryItems.filter(g => g.type === 'photo').length;
  const totalVideos = galleryItems.filter(g => g.type === 'video').length;
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length;

  // Group classes by instructor
  const classByInstructor = useMemo(() => {
    const map = {};
    classes.forEach(cls => {
      const key = cls.instructorName || cls.instructor || 'Unknown';
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [classes]);

  // Dance style distribution from students
  const styleDistribution = useMemo(() => {
    const map = {};
    students.forEach(s => {
      const key = s.danceStyle || 'General';
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [students]);

  // Monthly student registrations (last 6 months)
  const monthlyRegistrations = useMemo(() => {
    const months = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      months[key] = 0;
    }
    students.forEach(s => {
      if (s.createdAt) {
        const d = new Date(s.createdAt);
        const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
        if (months[key] !== undefined) months[key]++;
      }
    });
    return Object.entries(months);
  }, [students]);

  const maxMonthlyReg = Math.max(...monthlyRegistrations.map(([, v]) => v), 1);

  // Recent 5 students
  const recentStudents = [...students]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="report-loading">
        <div className="report-spinner" />
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="report-wrapper fade-in">
      <div className="report-page-header">
        <h2>📊 Analytics & Reports</h2>
        <p>Comprehensive overview of your studio's performance</p>
      </div>

      {/* ── KPI SUMMARY CARDS ── */}
      <div className="report-kpi-grid">
        <KpiCard icon="🎓" label="Total Students" value={students.length} color="pink" />
        <KpiCard icon="👩‍🏫" label="Total Instructors" value={instructors.length} color="purple" />
        <KpiCard icon="📚" label="Total Classes" value={classes.length} color="blue" />
        <KpiCard icon="✅" label="Active Students" value={students.filter(s => s.isActive !== false).length} color="green" />
        <KpiCard icon="🎭" label="Upcoming Events" value={upcomingEvents} color="orange" />
        <KpiCard icon="🖼️" label="Photos Uploaded" value={totalPhotos} color="teal" />
        <KpiCard icon="🎬" label="Videos Uploaded" value={totalVideos} color="rose" />
        <KpiCard icon="💰" label="Finance Records" value={financeData.length} color="gold" />
      </div>

      {/* ── ROW: Monthly Registrations + Style Distribution ── */}
      <div className="report-two-col">
        {/* Monthly Registrations Bar Chart */}
        <div className="report-card">
          <h3 className="report-card-title">📈 Monthly Student Registrations</h3>
          <div className="bar-chart-container">
            {monthlyRegistrations.map(([month, count]) => (
              <div key={month} className="bar-group">
                <div className="bar-wrapper">
                  <div
                    className="bar"
                    style={{ height: `${(count / maxMonthlyReg) * 100}%` }}
                    title={`${count} students`}
                  >
                    <span className="bar-value">{count}</span>
                  </div>
                </div>
                <span className="bar-label">{month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Popular Dance Styles */}
        <div className="report-card">
          <h3 className="report-card-title">💃 Most Popular Dance Styles</h3>
          {styleDistribution.length > 0 ? (
            <div className="progress-list">
              {styleDistribution.slice(0, 6).map(([style, count]) => (
                <div key={style} className="progress-item">
                  <div className="progress-label">
                    <span>{style}</span>
                    <span className="progress-count">{count} students</span>
                  </div>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${(count / students.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="report-empty">No dance style data available</p>
          )}
        </div>
      </div>

      {/* ── ROW: Instructor-wise Classes + Recent Registrations ── */}
      <div className="report-two-col">
        {/* Instructor Classes */}
        <div className="report-card">
          <h3 className="report-card-title">👩‍🏫 Instructor-wise Classes</h3>
          {classByInstructor.length > 0 ? (
            <div className="report-table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Instructor</th>
                    <th>Classes</th>
                    <th>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {classByInstructor.map(([name, count]) => (
                    <tr key={name}>
                      <td>{name}</td>
                      <td><span className="badge-count">{count}</span></td>
                      <td>
                        <div className="mini-bar-track">
                          <div
                            className="mini-bar-fill"
                            style={{ width: `${(count / classes.length) * 100}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="report-empty">No class data available</p>
          )}
        </div>

        {/* Recent Student Registrations */}
        <div className="report-card">
          <h3 className="report-card-title">🆕 Recent Student Registrations</h3>
          {recentStudents.length > 0 ? (
            <div className="report-table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Style</th>
                    <th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map(s => (
                    <tr key={s._id}>
                      <td>{s.fullName || s.name}</td>
                      <td>{s.danceStyle || 'N/A'}</td>
                      <td>
                        {s.createdAt
                          ? new Date(s.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="report-empty">No student registrations yet</p>
          )}
        </div>
      </div>

      {/* ── ROW: Media & Events Summary ── */}
      <div className="report-two-col">
        {/* Media Summary */}
        <div className="report-card">
          <h3 className="report-card-title">🗂️ Total Media Uploaded</h3>
          <div className="media-summary-grid">
            <div className="media-summary-card photos">
              <span className="media-icon">🖼️</span>
              <span className="media-number">{totalPhotos}</span>
              <span className="media-label">Photos</span>
            </div>
            <div className="media-summary-card videos">
              <span className="media-icon">🎬</span>
              <span className="media-number">{totalVideos}</span>
              <span className="media-label">Videos</span>
            </div>
            <div className="media-summary-card total">
              <span className="media-icon">📁</span>
              <span className="media-number">{galleryItems.length}</span>
              <span className="media-label">Total</span>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="report-card">
          <h3 className="report-card-title">📅 Events Overview</h3>
          <div className="media-summary-grid">
            <div className="media-summary-card photos">
              <span className="media-icon">📅</span>
              <span className="media-number">{events.length}</span>
              <span className="media-label">Total Events</span>
            </div>
            <div className="media-summary-card videos">
              <span className="media-icon">⏳</span>
              <span className="media-number">{upcomingEvents}</span>
              <span className="media-label">Upcoming</span>
            </div>
            <div className="media-summary-card total">
              <span className="media-icon">✅</span>
              <span className="media-number">{events.length - upcomingEvents}</span>
              <span className="media-label">Past Events</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Finance / Payment Summary ── */}
      <div className="report-card full-width">
        <h3 className="report-card-title">💰 Finance & Payment Status Report</h3>
        {financeData.length > 0 ? (
          <div className="report-table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student / Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {financeData.slice(0, 10).map((f, i) => (
                  <tr key={f._id || i}>
                    <td>{i + 1}</td>
                    <td>{f.studentName || f.description || 'N/A'}</td>
                    <td>₹{f.amount || 0}</td>
                    <td>
                      <span className={`payment-badge ${(f.status || 'paid').toLowerCase()}`}>
                        {f.status || 'Paid'}
                      </span>
                    </td>
                    <td>{f.createdAt ? new Date(f.createdAt).toLocaleDateString('en-IN') : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="report-empty">No finance records available</p>
        )}
      </div>

      {/* ── Admin Activity Overview ── */}
      <div className="report-card full-width">
        <h3 className="report-card-title">🛡️ Admin Activity Overview</h3>
        <div className="activity-grid">
          <ActivityItem icon="🎓" label="Students Registered" value={students.length} />
          <ActivityItem icon="👩‍🏫" label="Instructors Onboarded" value={instructors.length} />
          <ActivityItem icon="📚" label="Classes Created" value={classes.length} />
          <ActivityItem icon="🖼️" label="Gallery Items Added" value={galleryItems.length} />
          <ActivityItem icon="📅" label="Events Scheduled" value={events.length} />
          <ActivityItem icon="💰" label="Finance Records" value={financeData.length} />
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ icon, label, value, color }) => (
  <div className={`kpi-card kpi-${color}`}>
    <div className="kpi-icon">{icon}</div>
    <div className="kpi-info">
      <p className="kpi-label">{label}</p>
      <h3 className="kpi-value">{value}</h3>
    </div>
  </div>
);

const ActivityItem = ({ icon, label, value }) => (
  <div className="activity-item">
    <span className="activity-icon">{icon}</span>
    <div className="activity-info">
      <span className="activity-label">{label}</span>
      <span className="activity-value">{value}</span>
    </div>
  </div>
);

export default ReportAdmin;
