import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  BarChart3,
  Plus,
  Search,
  Sun,
  Moon,
  Bell,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  Sparkles,
  Filter,
  X,
  ArrowRight,
  Loader2,
  Database,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const API_BASE = 'https://edu-track-project-2.onrender.com';

// Mock initial data for fallback and seeding
const MOCK_BATCHES = [
  { id: 'b1', name: 'Full Stack Java Core', trainerName: 'Dr. Sarah Connor', startDate: '2026-01-10', endDate: '2026-06-15', totalStudents: 18, status: 'ongoing' },
  { id: 'b2', name: 'Advanced Cloud Architecture', trainerName: 'Alex Rivera', startDate: '2026-02-01', endDate: '2026-08-30', totalStudents: 12, status: 'active' },
  { id: 'b3', name: 'UI/UX Interactive Design', trainerName: 'Elena Rostova', startDate: '2025-10-01', endDate: '2026-03-01', totalStudents: 25, status: 'completed' },
  { id: 'b4', name: 'Data Science & Machine Learning', trainerName: 'Prof. Marcus Aurelius', startDate: '2026-06-01', endDate: '2026-12-01', totalStudents: 0, status: 'pending' }
];

const MOCK_STUDENTS = [
  { id: 's1', name: 'Emily Watson', email: 'emily.w@edu.com', phone: '+1 555-0192', course: 'Java Spring Boot', batchId: 'b1', enrollmentDate: '2026-01-11' },
  { id: 's2', name: 'Devon Lane', email: 'devon.l@edu.com', phone: '+1 555-0143', course: 'React & Vite', batchId: 'b1', enrollmentDate: '2026-01-12' },
  { id: 's3', name: 'Jane Cooper', email: 'jane.c@edu.com', phone: '+1 555-0178', course: 'AWS Practitioner', batchId: 'b2', enrollmentDate: '2026-02-03' },
  { id: 's4', name: 'Cody Fisher', email: 'cody.f@edu.com', phone: '+1 555-0121', course: 'Figma Core', batchId: 'b3', enrollmentDate: '2025-10-02' },
  { id: 's5', name: 'Esther Howard', email: 'esther.h@edu.com', phone: '+1 555-0109', course: 'Figma AutoLayout', batchId: 'b3', enrollmentDate: '2025-10-05' }
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Search & Filter States
  const [batchSearch, setBatchSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('all');
  const [studentSearch, setStudentSearch] = useState('');
  
  // Modal States
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedBatchIdForDetail, setSelectedBatchIdForDetail] = useState(null);

  // Form States
  const [newBatch, setNewBatch] = useState({
    name: '',
    trainerName: '',
    startDate: '',
    endDate: '',
    status: 'active'
  });
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    batchId: ''
  });

  // Toggle Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch Data from Spring Boot
  const fetchData = async () => {
    setLoading(true);
    try {
      const batchesRes = await fetch(`${API_BASE}/batches`);
      const studentsRes = await fetch(`${API_BASE}/students`);
      
      if (!batchesRes.ok || !studentsRes.ok) {
        throw new Error('API server error response');
      }

      const batchesData = await batchesRes.json();
      const studentsData = await studentsRes.json();

      setBatches(batchesData);
      setStudents(studentsData);
      setUsingMockData(false);
      addNotification('Connected to active Spring Boot backend!', 'success');
    } catch (err) {
      console.warn('Backend connection failed. Falling back to local offline storage/demo.', err);
      // Load from localStorage or mock
      const localBatches = localStorage.getItem('edu_batches');
      const localStudents = localStorage.getItem('edu_students');
      
      if (localBatches && localStudents) {
        setBatches(JSON.parse(localBatches));
        setStudents(JSON.parse(localStudents));
      } else {
        setBatches(MOCK_BATCHES);
        setStudents(MOCK_STUDENTS);
        localStorage.setItem('edu_batches', JSON.stringify(MOCK_BATCHES));
        localStorage.setItem('edu_students', JSON.stringify(MOCK_STUDENTS));
      }
      setUsingMockData(true);
      addNotification('Spring Boot backend offline. Running in premium Local Demo Mode.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync to localstorage if offline mode
  useEffect(() => {
    if (usingMockData && batches.length > 0) {
      localStorage.setItem('edu_batches', JSON.stringify(batches));
    }
  }, [batches, usingMockData]);

  useEffect(() => {
    if (usingMockData && students.length > 0) {
      localStorage.setItem('edu_students', JSON.stringify(students));
    }
  }, [students, usingMockData]);

  const addNotification = (text, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  // Seed data directly to Spring Boot backend or local storage
  const handleSeedData = async () => {
    setLoading(true);
    if (!usingMockData) {
      try {
        // Send seeds to backend
        for (const batch of MOCK_BATCHES) {
          await fetch(`${API_BASE}/batches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: batch.name,
              trainerName: batch.trainerName,
              startDate: batch.startDate,
              endDate: batch.endDate,
              totalStudents: batch.totalStudents,
              status: batch.status
            })
          });
        }
        for (const stud of MOCK_STUDENTS) {
          await fetch(`${API_BASE}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: stud.name,
              email: stud.email,
              phone: stud.phone,
              course: stud.course,
              batchId: stud.batchId,
              enrollmentDate: stud.enrollmentDate
            })
          });
        }
        addNotification('Sample data successfully seeded to MongoDB!', 'success');
        fetchData();
      } catch (err) {
        addNotification('Failed to seed backend database.', 'danger');
      }
    } else {
      setBatches(MOCK_BATCHES);
      setStudents(MOCK_STUDENTS);
      addNotification('Local workspace populated with demo data!', 'success');
    }
    setLoading(false);
  };

  // Create Batch
  const handleCreateBatch = async (e) => {
    e.preventDefault();
    if (!newBatch.name || !newBatch.trainerName) {
      addNotification('Please fill in all required fields', 'warning');
      return;
    }

    const batchPayload = {
      ...newBatch,
      totalStudents: 0
    };

    if (!usingMockData) {
      try {
        const res = await fetch(`${API_BASE}/batches`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(batchPayload)
        });
        if (res.ok) {
          addNotification('New batch created successfully!', 'success');
          fetchData();
          setShowBatchModal(false);
          setNewBatch({ name: '', trainerName: '', startDate: '', endDate: '', status: 'active' });
        } else {
          addNotification('Failed to create batch on server.', 'danger');
        }
      } catch (err) {
        addNotification('Network error, could not save batch.', 'danger');
      }
    } else {
      const localNewBatch = {
        ...batchPayload,
        id: 'b' + (batches.length + 1)
      };
      setBatches([...batches, localNewBatch]);
      addNotification('Batch added to local memory!', 'success');
      setShowBatchModal(false);
      setNewBatch({ name: '', trainerName: '', startDate: '', endDate: '', status: 'active' });
    }
  };

  // Create Student
  const handleCreateStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email || !newStudent.batchId) {
      addNotification('Please fill in Name, Email and Batch', 'warning');
      return;
    }

    const studentPayload = {
      ...newStudent,
      enrollmentDate: new Date().toISOString().split('T')[0]
    };

    if (!usingMockData) {
      try {
        const res = await fetch(`${API_BASE}/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentPayload)
        });
        if (res.ok) {
          addNotification('Student enrolled successfully!', 'success');
          
          // Increment total students in the selected batch
          const updatedBatches = batches.map(b => {
            if (b.id === studentPayload.batchId) {
              return { ...b, totalStudents: (b.totalStudents || 0) + 1 };
            }
            return b;
          });
          setBatches(updatedBatches);
          
          fetchData();
          setShowStudentModal(false);
          setNewStudent({ name: '', email: '', phone: '', course: '', batchId: '' });
        } else {
          addNotification('Server failed to enroll student.', 'danger');
        }
      } catch (err) {
        addNotification('Network error, could not enroll student.', 'danger');
      }
    } else {
      const localNewStudent = {
        ...studentPayload,
        id: 's' + (students.length + 1)
      };
      
      // Update local count
      const updatedBatches = batches.map(b => {
        if (b.id === studentPayload.batchId) {
          return { ...b, totalStudents: (b.totalStudents || 0) + 1 };
        }
        return b;
      });
      setBatches(updatedBatches);
      setStudents([...students, localNewStudent]);
      addNotification('Student enrolled in local memory!', 'success');
      setShowStudentModal(false);
      setNewStudent({ name: '', email: '', phone: '', course: '', batchId: '' });
    }
  };

  // Filter and Search Operations
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.name.toLowerCase().includes(batchSearch.toLowerCase()) || 
                          batch.trainerName.toLowerCase().includes(batchSearch.toLowerCase());
    const matchesFilter = batchFilter === 'all' || batch.status === batchFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredStudents = students.filter(student => {
    return student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
           student.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
           student.course.toLowerCase().includes(studentSearch.toLowerCase());
  });

  // Calculate statistics
  const totalStudentsCount = students.length;
  const activeBatchesCount = batches.filter(b => b.status === 'active' || b.status === 'ongoing').length;
  const completedBatchesCount = batches.filter(b => b.status === 'completed').length;
  const totalBatchesCount = batches.length;
  const averageClassSize = totalBatchesCount ? Math.round(totalStudentsCount / totalBatchesCount) : 0;

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      
      {/* Notifications Toast */}
      <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notifications.map((n) => (
          <div key={n.id} className="glass-panel" style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', 
            borderRadius: 'var(--border-radius-md)', borderLeft: `4px solid ${n.type === 'success' ? 'var(--success)' : n.type === 'warning' ? 'var(--warning)' : 'var(--info)'}`,
            boxShadow: 'var(--shadow-md)', animation: 'scaleIn 0.3s ease-out'
          }}>
            {n.type === 'success' ? <CheckCircle size={18} color="var(--success)" /> : <AlertCircle size={18} color="var(--warning)" />}
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{n.text}</span>
          </div>
        ))}
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside className="glass-panel" style={{
        width: '280px', margin: '20px 0 20px 20px', padding: '30px 20px', 
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        borderRadius: 'var(--border-radius-lg)', zIndex: 10
      }}>
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '45px', padding: '0 8px' }}>
            <div className="gradient-bg" style={{
              width: '42px', height: '42px', borderRadius: '12px', 
              display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center',
              boxShadow: '0 8px 16px -4px rgba(139, 92, 246, 0.4)'
            }}>
              <GraduationCap size={24} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.03em' }} className="gradient-text">EDU-TRACK</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>ACADEMIC CONTROL</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              style={navItemStyle(activeTab === 'dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('batches')}
              className={`nav-item ${activeTab === 'batches' ? 'active' : ''}`}
              style={navItemStyle(activeTab === 'batches')}
            >
              <FolderKanban size={18} />
              <span>Batches</span>
            </button>

            <button 
              onClick={() => setActiveTab('students')}
              className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
              style={navItemStyle(activeTab === 'students')}
            >
              <Users size={18} />
              <span>Students</span>
            </button>

            <button 
              onClick={() => setActiveTab('analytics')}
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              style={navItemStyle(activeTab === 'analytics')}
            >
              <BarChart3 size={18} />
              <span>Analytics</span>
            </button>
          </nav>
        </div>

        {/* Database Sync Banner */}
        <div className="glass-panel" style={{
          padding: '16px', borderRadius: 'var(--border-radius-md)', background: 'rgba(255, 255, 255, 0.02)',
          display: 'flex', flexDirection: 'column', gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={16} color={usingMockData ? 'var(--warning)' : 'var(--success)'} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {usingMockData ? 'Local Memory Mode' : 'Connected to DB'}
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            {usingMockData ? 'Backend offline. Data saved in browser memory.' : 'Live synchronized with MongoDB Atlas.'}
          </p>
          {usingMockData && (
            <button onClick={fetchData} className="btn-glow" style={{ padding: '8px 12px', fontSize: '11px', width: '100%' }}>
              Retry Server Sync
            </button>
          )}
        </div>
      </aside>

      {/* MAIN MAIN CONTENT CONTAINER */}
      <main style={{ flex: 1, padding: '20px 30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              EDU-TRACK DASHBOARD
            </span>
            <h1 style={{ fontSize: '32px', fontWeight: 800, marginTop: '2px' }} className="gradient-text">
              {activeTab === 'dashboard' && 'Welcome Back, Admin'}
              {activeTab === 'batches' && 'Manage Batches'}
              {activeTab === 'students' && 'Student Records'}
              {activeTab === 'analytics' && 'Operational Analytics'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Dark/Light Toggle */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="glass-panel" 
              style={{
                width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', borderRadius: 'var(--border-radius-md)', color: 'var(--text-primary)'
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notification bell */}
            <div className="glass-panel" style={{
              width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', borderRadius: 'var(--border-radius-md)', color: 'var(--text-primary)'
            }}>
              <Bell size={18} />
              <span style={{
                position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px',
                background: 'var(--secondary)', borderRadius: '50%', boxShadow: '0 0 8px var(--secondary)'
              }}></span>
            </div>

            {/* Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                  alt="Admin Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="desktop-only" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Sarah Connor</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>System Director</span>
              </div>
            </div>
          </div>
        </header>

        {/* LOADING STATE */}
        {loading ? (
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
            <Loader2 size={40} className="animate-float" style={{ color: 'var(--primary)' }} />
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Configuring Workspace & Syncing Data...</span>
          </div>
        ) : (
          <div style={{ animation: 'scaleIn 0.4s ease-out' }}>
            
            {/* 1. DASHBOARD VIEW */}
            {activeTab === 'dashboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* Seed Banner if databases are empty */}
                {batches.length === 0 && (
                  <div className="glass-panel" style={{
                    padding: '24px 30px', borderRadius: 'var(--border-radius-lg)', 
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <Sparkles size={32} style={{ color: 'var(--primary)' }} className="animate-float" />
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Get Started Instantly!</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          Your database workspace is currently empty. Seed high-quality simulated batch and student records in one click.
                        </p>
                      </div>
                    </div>
                    <button onClick={handleSeedData} className="btn-glow" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={16} />
                      <span>Seed Sample Data</span>
                    </button>
                  </div>
                )}

                {/* STATS ROW */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  
                  {/* Card 1 */}
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--border-radius-lg)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-glow)', zIndex: 0 }}></div>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>TOTAL STUDENTS</span>
                    <h2 style={{ fontSize: '36px', fontWeight: 800, marginTop: '8px', color: 'var(--text-primary)' }}>{totalStudentsCount}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '12px', color: 'var(--success)' }}>
                      <span>+12.4%</span>
                      <span style={{ color: 'var(--text-muted)' }}>this semester</span>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--border-radius-lg)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--secondary-glow)', zIndex: 0 }}></div>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>ACTIVE BATCHES</span>
                    <h2 style={{ fontSize: '36px', fontWeight: 800, marginTop: '8px', color: 'var(--text-primary)' }}>{activeBatchesCount}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '12px', color: 'var(--primary)' }}>
                      <span>{completedBatchesCount} completed</span>
                      <span style={{ color: 'var(--text-muted)' }}>this year</span>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--border-radius-lg)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-glow)', zIndex: 0 }}></div>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>AVG. CLASS SIZE</span>
                    <h2 style={{ fontSize: '36px', fontWeight: 800, marginTop: '8px', color: 'var(--text-primary)' }}>{averageClassSize}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '12px', color: 'var(--accent)' }}>
                      <span>1:25 max ratio</span>
                      <span style={{ color: 'var(--text-muted)' }}>healthy load</span>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--border-radius-lg)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-glow)', zIndex: 0 }}></div>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>TOTAL COURSES</span>
                    <h2 style={{ fontSize: '36px', fontWeight: 800, marginTop: '8px', color: 'var(--text-primary)' }}>6</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '12px', color: 'var(--success)' }}>
                      <span>4 trainers</span>
                      <span style={{ color: 'var(--text-muted)' }}>onboarded</span>
                    </div>
                  </div>

                </div>

                {/* BOTTOM DASHBOARD GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                  
                  {/* Left Column: Recent Batches */}
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--border-radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Quick Batches Overview</h3>
                      <button onClick={() => setActiveTab('batches')} style={{ display: 'flex', alignItems: 'center', gap: '6px', border: 'none', background: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                        <span>View All</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    {batches.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>No batches available. Use Seed Data or click quick action to create.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {batches.slice(0, 3).map((b) => (
                          <div key={b.id} className="glass-panel" style={{
                            padding: '16px 20px', borderRadius: 'var(--border-radius-md)', background: 'rgba(255, 255, 255, 0.01)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--glass-border)'
                          }}>
                            <div>
                              <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{b.name}</h4>
                              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Trainer: {b.trainerName} &bull; Students: {b.totalStudents || 0}</p>
                            </div>
                            <span className={`badge badge-${b.status || 'active'}`}>{b.status || 'active'}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Quick Action Panel */}
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--border-radius-lg)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Quick Actions</h3>
                    
                    <button 
                      onClick={() => setShowBatchModal(true)}
                      className="btn-glow" 
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', height: '50px' }}
                    >
                      <Plus size={18} />
                      <span>Create New Batch</span>
                    </button>

                    <button 
                      onClick={() => setShowStudentModal(true)}
                      className="btn-secondary" 
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', height: '50px' }}
                    >
                      <Plus size={18} />
                      <span>Enroll New Student</span>
                    </button>

                    <div className="glass-panel" style={{
                      padding: '16px', borderRadius: 'var(--border-radius-md)', background: 'rgba(139, 92, 246, 0.03)',
                      display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(139, 92, 246, 0.1)'
                    }}>
                      <div className="gradient-bg" style={{ width: '10px', height: '10px', borderRadius: '50%', animation: 'pulse-ring 2s infinite' }}></div>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>All backend routes are functional</span>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* 2. BATCHES VIEW */}
            {activeTab === 'batches' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Search & Actions Panel */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
                  
                  {/* Left Side: Search & Filter */}
                  <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px' }}>
                    <div className="glass-panel" style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '0 16px', flex: 1,
                      borderRadius: 'var(--border-radius-md)', height: '48px', border: '1px solid var(--glass-border)'
                    }}>
                      <Search size={18} color="var(--text-muted)" />
                      <input 
                        type="text" 
                        placeholder="Search batches by name or trainer..."
                        value={batchSearch}
                        onChange={(e) => setBatchSearch(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', width: '100%', fontFamily: 'var(--font-body)' }}
                      />
                    </div>

                    <div className="glass-panel" style={{
                      display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px',
                      borderRadius: 'var(--border-radius-md)', height: '48px', border: '1px solid var(--glass-border)'
                    }}>
                      <Filter size={18} color="var(--text-muted)" />
                      <select 
                        value={batchFilter}
                        onChange={(e) => setBatchFilter(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                      >
                        <option value="all" style={{ background: 'var(--bg-secondary)' }}>All Statuses</option>
                        <option value="active" style={{ background: 'var(--bg-secondary)' }}>Active</option>
                        <option value="ongoing" style={{ background: 'var(--bg-secondary)' }}>Ongoing</option>
                        <option value="completed" style={{ background: 'var(--bg-secondary)' }}>Completed</option>
                        <option value="pending" style={{ background: 'var(--bg-secondary)' }}>Pending</option>
                      </select>
                    </div>
                  </div>

                  {/* Right Side: Create button */}
                  <button onClick={() => setShowBatchModal(true)} className="btn-glow" style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '48px' }}>
                    <Plus size={18} />
                    <span>Create Batch</span>
                  </button>
                </div>

                {/* BATCH GRID */}
                {filteredBatches.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '60px 20px', borderRadius: 'var(--border-radius-lg)', textAlign: 'center' }}>
                    <FolderKanban size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: 700 }}>No Batches Found</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>Try seeding mock data or adjusting your search parameters.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {filteredBatches.map((batch) => {
                      const isSelected = selectedBatchIdForDetail === batch.id;
                      return (
                        <div 
                          key={batch.id} 
                          onClick={() => setSelectedBatchIdForDetail(isSelected ? null : batch.id)}
                          className="glass-panel gradient-border"
                          style={{
                            padding: '24px', borderRadius: 'var(--border-radius-lg)', cursor: 'pointer',
                            transition: 'all var(--transition-normal)', border: isSelected ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                            transform: isSelected ? 'translateY(-2px)' : 'none',
                            boxShadow: isSelected ? 'var(--shadow-glow)' : 'var(--shadow-md)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <span className={`badge badge-${batch.status || 'active'}`}>{batch.status || 'active'}</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>ID: {batch.id || 'N/A'}</span>
                          </div>

                          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{batch.name}</h3>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <GraduationCap size={16} color="var(--primary)" />
                              <span>Trainer: <strong>{batch.trainerName}</strong></span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Calendar size={16} color="var(--secondary)" />
                              <span>{batch.startDate || 'N/A'} to {batch.endDate || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Users size={16} color="var(--accent)" />
                              <span>Enrolled: <strong>{batch.totalStudents || 0} Students</strong></span>
                            </div>
                          </div>

                          {/* Progress bar indication */}
                          <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden', marginTop: '15px' }}>
                            <div style={{ 
                              width: `${Math.min(((batch.totalStudents || 0) / 25) * 100, 100)}%`, 
                              height: '100%', 
                              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                              borderRadius: '3px'
                            }}></div>
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Click to view enrolled student list</span>
                            <ArrowRight size={14} color="var(--primary)" />
                          </div>

                          {/* NESTED EXPANDED STUDENT DRAWER */}
                          {isSelected && (
                            <div 
                              onClick={(e) => e.stopPropagation()}
                              style={{ 
                                marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)',
                                animation: 'fadeInUp 0.3s ease-out'
                              }}
                            >
                              <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                Enrolled Class List ({students.filter(s => s.batchId === batch.id).length})
                              </h4>
                              {students.filter(s => s.batchId === batch.id).length === 0 ? (
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No students enrolled in this batch yet.</p>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {students.filter(s => s.batchId === batch.id).map(st => (
                                    <div key={st.id} style={{ 
                                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                                      background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: 'var(--border-radius-sm)',
                                      fontSize: '12px'
                                    }}>
                                      <span style={{ fontWeight: 600 }}>{st.name}</span>
                                      <span style={{ color: 'var(--text-muted)' }}>{st.course}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3. STUDENTS VIEW */}
            {activeTab === 'students' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Search & Actions Panel */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
                  
                  {/* Left Side: Search */}
                  <div className="glass-panel" style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '0 16px', flex: 1, minWidth: '280px',
                    borderRadius: 'var(--border-radius-md)', height: '48px', border: '1px solid var(--glass-border)'
                  }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input 
                      type="text" 
                      placeholder="Search students by name, email, course..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', width: '100%', fontFamily: 'var(--font-body)' }}
                    />
                  </div>

                  {/* Right Side: Actions */}
                  <button onClick={() => setShowStudentModal(true)} className="btn-glow" style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '48px' }}>
                    <Plus size={18} />
                    <span>Enroll Student</span>
                  </button>
                </div>

                {/* STUDENT DATATABLE */}
                <div className="glass-panel" style={{ borderRadius: 'var(--border-radius-lg)', overflow: 'hidden' }}>
                  {filteredStudents.length === 0 ? (
                    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                      <Users size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                      <h3 style={{ fontSize: '18px', fontWeight: 700 }}>No Students Enrolled</h3>
                      <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>Try seeding demo data or enrolling your first student.</p>
                    </div>
                  ) : (
                    <div className="table-container">
                      <table className="premium-table">
                        <thead>
                          <tr>
                            <th>Student ID</th>
                            <th>Full Name</th>
                            <th>Email Address</th>
                            <th>Phone Contact</th>
                            <th>Assigned Batch</th>
                            <th>Enrolled Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((st) => {
                            const batchObj = batches.find(b => b.id === st.batchId);
                            return (
                              <tr key={st.id}>
                                <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)' }}>
                                  {st.id || 'N/A'}
                                </td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                                    {st.name}
                                  </div>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                                    <Mail size={14} color="var(--text-muted)" />
                                    <span>{st.email}</span>
                                  </div>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                                    <Phone size={14} color="var(--text-muted)" />
                                    <span>{st.phone || 'N/A'}</span>
                                  </div>
                                </td>
                                <td>
                                  <span className="badge badge-ongoing" style={{ fontSize: '11px', padding: '3px 8px' }}>
                                    {batchObj ? batchObj.name : 'Unknown Batch'}
                                  </span>
                                </td>
                                <td>
                                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                    {st.enrollmentDate || 'N/A'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 4. ANALYTICS VIEW */}
            {activeTab === 'analytics' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* Upper metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--border-radius-lg)' }}>
                    <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>BATCH COMPLETION RATE</h4>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <h2 style={{ fontSize: '32px', fontWeight: 800 }}>88.4%</h2>
                      <span style={{ color: 'var(--success)', fontSize: '12px', fontWeight: 600 }}>+4.2% YoY</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>Percent of student batches graduating on track.</p>
                  </div>

                  <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--border-radius-lg)' }}>
                    <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>TRAINER WORKLOAD</h4>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <h2 style={{ fontSize: '32px', fontWeight: 800 }}>4.2 hrs</h2>
                      <span style={{ color: 'var(--info)', fontSize: '12px', fontWeight: 600 }}>Optimum load</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>Average contact hours per trainer per day.</p>
                  </div>

                  <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--border-radius-lg)' }}>
                    <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>STUDENT RETENTION</h4>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <h2 style={{ fontSize: '32px', fontWeight: 800 }}>96.8%</h2>
                      <span style={{ color: 'var(--success)', fontSize: '12px', fontWeight: 600 }}>Excellent grade</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>Standard drop-out prevention rate average.</p>
                  </div>

                </div>

                {/* Dynamic workload representation / Mock graph */}
                <div className="glass-panel" style={{ padding: '30px', borderRadius: 'var(--border-radius-lg)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Batch Distribution & Capacities</h3>
                  
                  {batches.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No statistics to display. Populate data to see analytics.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {batches.map(b => (
                        <div key={b.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                            <span style={{ fontWeight: 700 }}>{b.name}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>
                              {b.totalStudents || 0} / 25 Students ({Math.round(((b.totalStudents || 0) / 25) * 100)}% Capacity)
                            </span>
                          </div>
                          <div style={{ width: '100%', height: '14px', background: 'var(--bg-tertiary)', borderRadius: '7px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${Math.min(((b.totalStudents || 0) / 25) * 100, 100)}%`,
                              height: '100%',
                              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                              borderRadius: '7px',
                              boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)',
                              transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* CREATE BATCH MODAL */}
      {showBatchModal && (
        <div className="modal-overlay" onClick={() => setShowBatchModal(false)}>
          <div className="modal-content glass-panel animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800 }} className="gradient-text">Create Academic Batch</h2>
              <button 
                onClick={() => setShowBatchModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateBatch}>
              <div className="form-group">
                <label className="form-label">Batch Name *</label>
                <input 
                  type="text" 
                  className="form-input"
                  required
                  placeholder="e.g. Java Spring Core Suite"
                  value={newBatch.name}
                  onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Trainer *</label>
                <input 
                  type="text" 
                  className="form-input"
                  required
                  placeholder="e.g. Dr. Jennifer Parker"
                  value={newBatch.trainerName}
                  onChange={(e) => setNewBatch({ ...newBatch, trainerName: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input 
                    type="date" 
                    className="form-input"
                    value={newBatch.startDate}
                    onChange={(e) => setNewBatch({ ...newBatch, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input 
                    type="date" 
                    className="form-input"
                    value={newBatch.endDate}
                    onChange={(e) => setNewBatch({ ...newBatch, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  className="form-select"
                  value={newBatch.status}
                  onChange={(e) => setNewBatch({ ...newBatch, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                <button type="button" onClick={() => setShowBatchModal(false)} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-glow" style={{ flex: 1 }}>
                  Save & Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ENROLL STUDENT MODAL */}
      {showStudentModal && (
        <div className="modal-overlay" onClick={() => setShowStudentModal(false)}>
          <div className="modal-content glass-panel animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800 }} className="gradient-text">Enroll Student Record</h2>
              <button 
                onClick={() => setShowStudentModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateStudent}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  className="form-input"
                  required
                  placeholder="e.g. Marty McFly"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input 
                  type="email" 
                  className="form-input"
                  required
                  placeholder="e.g. marty@hillvalley.com"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Contact</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. +1 (555) 880-1985"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Course Subject</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. Spring Boot REST Integration"
                  value={newStudent.course}
                  onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assign Academic Batch *</label>
                {batches.length === 0 ? (
                  <p style={{ color: 'var(--danger)', fontSize: '12px' }}>
                    No batches are created yet. Please create a batch first!
                  </p>
                ) : (
                  <select 
                    className="form-select"
                    required
                    value={newStudent.batchId}
                    onChange={(e) => setNewStudent({ ...newStudent, batchId: e.target.value })}
                  >
                    <option value="">-- Choose a Batch --</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} (Trainer: {b.trainerName})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                <button type="button" onClick={() => setShowStudentModal(false)} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-glow" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={batches.length === 0}>
                  <span>Enroll Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Inline utility styling for nav link active/inactive transitions
const navItemStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  padding: '14px 18px',
  border: 'none',
  borderRadius: 'var(--border-radius-md)',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  textAlign: 'left',
  background: isActive ? 'linear-gradient(135deg, var(--primary-glow) 0%, rgba(236, 72, 153, 0.05) 100%)' : 'transparent',
  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
  transition: 'all var(--transition-fast)'
});

export default App;
