import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import './index.css';

// Import API services
import { authAPI, jobAPI, quoteAPI, dataAPI, notificationAPI, reportAPI } from './services/api';

// Import Components
import LandingPage from './components/LandingPage';
import RegisterPage from './components/RegisterPage';
import JobsPage from './components/JobsPage';
import NewJobPage from './components/NewJobPage';

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
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary hover:text-primary-dark transition">
            IC Maintenance
          </Link>
          <h1 className="text-4xl font-bold text-white mt-6">Sign In</h1>
          <p className="text-neutral-400 mt-2">Welcome back to IC Maintenance</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-neutral-800 border border-neutral-700 rounded-2xl p-8 space-y-6">
          {error && (
            <div className="p-4 bg-error/10 border border-error/30 rounded-lg text-error text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-white font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-primary focus:outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-white font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-primary focus:outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full px-6 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-lg font-semibold transition" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 space-y-3">
          <div className="text-center">
            <Link to="#" className="text-primary hover:text-primary-light text-sm">
              Forgot your password?
            </Link>
          </div>
          <div className="text-center text-neutral-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-light">
              Register your organization
            </Link>
          </div>
        </div>

        <div className="mt-8 p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg text-center">
          <p className="text-neutral-400 text-sm">
            Need help?{' '}
            <Link to="mailto:support@icmaintenance.com" className="text-primary hover:text-primary-light">
              Contact support
            </Link>
          </p>
        </div>

        <div style={{ marginTop: '24px', padding: '12px', background: '#374151', borderRadius: '6px', fontSize: '12px', color: '#d1d5db' }}>
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
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's your maintenance summary.</p>
      </div>
      
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

      {/* Quick Actions */}
      <div className="grid grid-2" style={{ marginBottom: '32px' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #0066CC 0%, #0052A3 100%)', color: 'white' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>Submit New Request</h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', opacity: 0.9 }}>
            Create a new maintenance request and attach photos
          </p>
          <Link 
            to="/jobs/new" 
            className="btn" 
            style={{ 
              background: 'white', 
              color: '#0066CC', 
              display: 'inline-block',
              textDecoration: 'none'
            }}
          >
            New Request →
          </Link>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #F59E0B 100%)', color: 'white' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>View Reports</h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', opacity: 0.9 }}>
            Access comprehensive maintenance reports and analytics
          </p>
          <Link 
            to="/reports" 
            className="btn" 
            style={{ 
              background: 'white', 
              color: '#FF6B35', 
              display: 'inline-block',
              textDecoration: 'none'
            }}
          >
            View Reports →
          </Link>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Recent Maintenance Requests</h2>
          <Link to="/jobs" style={{ color: '#0066CC', textDecoration: 'none', fontWeight: 500 }}>
            View All →
          </Link>
        </div>
        {recentJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>📋</p>
            <p style={{ color: '#6b7280', margin: 0 }}>No maintenance requests yet. Create your first request to get started!</p>
          </div>
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
                  <td><Link to={`/jobs/${job.id}`} style={{ color: '#0066CC', textDecoration: 'none', fontWeight: 500 }}>{job.job_number}</Link></td>
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
      <div className={user ? "container" : ""}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
          <Route path="/jobs/new" element={<ProtectedRoute><NewJobPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
