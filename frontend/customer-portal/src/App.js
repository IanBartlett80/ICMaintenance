import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import './index.css';

// Import API services
import { authAPI, jobAPI, quoteAPI, dataAPI, notificationAPI, reportAPI } from './services/api';

// Auth Context
const AuthContext = React.createContext();

function useAuth() {
  return React.useContext(AuthContext);
}

// Auth Provider
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const register = async (userData) => {
    await authAPI.register(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
}

// Login Page
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 style={{ textAlign: 'center', color: '#2563eb', marginBottom: '24px' }}>IC Maintenance</h1>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Customer Portal</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>

        <div style={{ marginTop: '24px', padding: '12px', background: '#f3f4f6', borderRadius: '6px', fontSize: '12px' }}>
          <strong>Demo Account:</strong><br />
          Email: customer@example.com<br />
          Password: customer123
        </div>
      </div>
    </div>
  );
}

// Dashboard Page
function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, jobsRes] = await Promise.all([
        reportAPI.getDashboardStats(),
        jobAPI.getJobs({ limit: 5 })
      ]);
      setStats(statsRes.data);
      setRecentJobs(jobsRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      
      <div className="grid grid-3" style={{ marginBottom: '24px' }}>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h3>Total Jobs</h3>
          <p>{stats?.total_jobs || 0}</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
          <h3>Active Jobs</h3>
          <p>{stats?.active_jobs || 0}</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
          <h3>Completed</h3>
          <p>{stats?.completed_jobs || 0}</p>
        </div>
      </div>

      <div className="card">
        <h2>Recent Maintenance Requests</h2>
        {recentJobs.length === 0 ? (
          <p>No maintenance requests yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Job #</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map(job => (
                <tr key={job.id}>
                  <td><Link to={`/jobs/${job.id}`}>{job.job_number}</Link></td>
                  <td>{job.title}</td>
                  <td>{job.category_name}</td>
                  <td className={`priority-${job.priority_name.toLowerCase()}`}>{job.priority_name}</td>
                  <td><span className="badge badge-new">{job.status_name}</span></td>
                  <td>{new Date(job.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link to="/jobs/new" className="btn btn-primary" style={{ marginTop: '16px' }}>
          New Maintenance Request
        </Link>
      </div>
    </div>
  );
}

// Navigation
function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <h1>IC Maintenance</h1>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/jobs">My Jobs</Link>
          <Link to="/jobs/new">New Request</Link>
          <Link to="/reports">Reports</Link>
          <span>Welcome, {user?.first_name}!</span>
          <button onClick={logout} className="btn btn-secondary">Logout</button>
        </div>
      </div>
    </nav>
  );
}

// Main App
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navigation />}
      <div className="container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
