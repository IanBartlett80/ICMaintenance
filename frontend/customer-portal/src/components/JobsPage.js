import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI } from '../services/api';

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadJobs();
  }, [filter]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') params.status = filter;
      const response = await jobAPI.getJobs(params);
      setJobs(response.data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.job_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusCounts = {
    all: jobs.length,
    new: jobs.filter(j => j.status_name === 'New').length,
    in_progress: jobs.filter(j => j.status_name === 'In Progress').length,
    completed: jobs.filter(j => j.status_name === 'Completed').length,
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Maintenance Requests</h1>
          <p className="text-gray-600">Manage and track all your maintenance jobs</p>
        </div>
        <Link 
          to="/jobs/new" 
          className="btn btn-primary"
          style={{ textDecoration: 'none' }}
        >
          + New Request
        </Link>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All Requests', count: statusCounts.all },
            { key: 'new', label: 'New', count: statusCounts.new },
            { key: 'in_progress', label: 'In Progress', count: statusCounts.in_progress },
            { key: 'completed', label: 'Completed', count: statusCounts.completed }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`filter-btn ${filter === key ? 'active' : ''}`}
              style={{
                padding: '10px 20px',
                border: filter === key ? '2px solid #0066CC' : '2px solid #e5e7eb',
                borderRadius: '8px',
                background: filter === key ? '#eff6ff' : 'white',
                color: filter === key ? '#0066CC' : '#6b7280',
                fontWeight: filter === key ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px'
              }}
            >
              {label} <span style={{ 
                background: filter === key ? '#0066CC' : '#e5e7eb',
                color: filter === key ? 'white' : '#6b7280',
                padding: '2px 8px',
                borderRadius: '12px',
                marginLeft: '8px',
                fontSize: '12px',
                fontWeight: '600'
              }}>{count}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginTop: '16px' }}>
          <input
            type="text"
            placeholder="Search by job number, title, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#0066CC'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>
      </div>

      {/* Jobs List */}
      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="loading">Loading jobs...</div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>📋</p>
            <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>No maintenance requests found</h3>
            <p style={{ color: '#6b7280', margin: '0 0 24px 0' }}>
              {searchTerm ? 'Try adjusting your search criteria' : 'Create your first maintenance request to get started'}
            </p>
            {!searchTerm && (
              <Link 
                to="/jobs/new" 
                className="btn btn-primary"
                style={{ textDecoration: 'none' }}
              >
                Create First Request
              </Link>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>Job Number</th>
                  <th>Title</th>
                  <th style={{ width: '150px' }}>Category</th>
                  <th style={{ width: '100px' }}>Priority</th>
                  <th style={{ width: '120px' }}>Status</th>
                  <th style={{ width: '100px' }}>Quotes</th>
                  <th style={{ width: '120px' }}>Created</th>
                  <th style={{ width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map(job => (
                  <tr key={job.id}>
                    <td>
                      <Link 
                        to={`/jobs/${job.id}`}
                        style={{ 
                          color: '#0066CC', 
                          textDecoration: 'none', 
                          fontWeight: '600',
                          fontSize: '14px'
                        }}
                      >
                        {job.job_number}
                      </Link>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '500', color: '#111827', marginBottom: '2px' }}>
                          {job.title}
                        </div>
                        {job.description && (
                          <div style={{ 
                            fontSize: '13px', 
                            color: '#6b7280',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '300px'
                          }}>
                            {job.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        background: '#eff6ff',
                        color: '#1e40af',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        {job.category_name}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-${job.priority_name?.toLowerCase()}`}>
                        {job.priority_name}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${job.status_name?.toLowerCase().replace(' ', '-')}`}>
                        {job.status_name}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {job.quote_count > 0 ? (
                        <span style={{
                          background: '#dcfce7',
                          color: '#166534',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}>
                          {job.quote_count} {job.quote_count === 1 ? 'Quote' : 'Quotes'}
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '13px' }}>No quotes</span>
                      )}
                    </td>
                    <td style={{ color: '#6b7280', fontSize: '13px' }}>
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="btn"
                        style={{
                          textDecoration: 'none',
                          padding: '6px 12px',
                          fontSize: '13px'
                        }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {!loading && filteredJobs.length > 0 && (
        <div style={{ 
          marginTop: '16px', 
          padding: '12px 16px', 
          background: '#f9fafb', 
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: '#6b7280', fontSize: '14px' }}>
            Showing {filteredJobs.length} of {jobs.length} maintenance requests
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                padding: '6px 12px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                color: '#6b7280',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default JobsPage;
