import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI, dataAPI } from '../services/api';

function NewJobPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category_id: '',
    priority_id: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const [categoriesRes, prioritiesRes] = await Promise.all([
        dataAPI.getCategories(),
        dataAPI.getPriorities()
      ]);
      setCategories(categoriesRes.data);
      setPriorities(prioritiesRes.data);
      
      // Set default priority to Normal
      const normalPriority = prioritiesRes.data.find(p => p.name === 'Normal');
      if (normalPriority) {
        setFormData(prev => ({ ...prev, priority_id: normalPriority.id }));
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Please provide a detailed description (at least 20 characters)';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'Please select a category';
    }
    
    if (!formData.priority_id) {
      newErrors.priority_id = 'Please select a priority';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    const invalidFiles = selectedFiles.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setErrors(prev => ({ 
        ...prev, 
        files: 'Only JPG, PNG, GIF, and PDF files are allowed' 
      }));
      return;
    }
    
    // Validate file sizes (max 5MB each)
    const oversizedFiles = selectedFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrors(prev => ({ 
        ...prev, 
        files: 'Each file must be less than 5MB' 
      }));
      return;
    }
    
    setFiles(prev => [...prev, ...selectedFiles]);
    setErrors(prev => ({ ...prev, files: '' }));
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Create job
      const jobResponse = await jobAPI.createJob(formData);
      const jobId = jobResponse.data.id;
      
      // Upload files if any
      if (files.length > 0) {
        const uploadFormData = new FormData();
        files.forEach(file => {
          uploadFormData.append('files', file);
        });
        
        await jobAPI.uploadJobFiles(jobId, uploadFormData);
      }
      
      // Navigate to job detail page
      navigate(`/jobs/${jobId}`, { 
        state: { message: 'Maintenance request created successfully!' }
      });
      
    } catch (error) {
      console.error('Error creating job:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to create job. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: '#0066CC',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 0',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '16px'
          }}
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">New Maintenance Request</h1>
        <p className="text-gray-600">Submit a new maintenance request with detailed information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '20px' }}>Request Details</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Title <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Leaking faucet in unit 201"
              style={{
                width: '100%',
                padding: '12px',
                border: errors.title ? '2px solid #dc2626' : '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              onFocus={(e) => !errors.title && (e.target.style.borderColor = '#0066CC')}
              onBlur={(e) => !errors.title && (e.target.style.borderColor = '#e5e7eb')}
            />
            {errors.title && (
              <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>
                {errors.title}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Description <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information about the maintenance issue..."
              rows="5"
              style={{
                width: '100%',
                padding: '12px',
                border: errors.description ? '2px solid #dc2626' : '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              onFocus={(e) => !errors.description && (e.target.style.borderColor = '#0066CC')}
              onBlur={(e) => !errors.description && (e.target.style.borderColor = '#e5e7eb')}
            />
            {errors.description && (
              <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>
                {errors.description}
              </p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Category <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.category_id ? '2px solid #dc2626' : '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white'
                }}
                onFocus={(e) => !errors.category_id && (e.target.style.borderColor = '#0066CC')}
                onBlur={(e) => !errors.category_id && (e.target.style.borderColor = '#e5e7eb')}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category_id && (
                <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>
                  {errors.category_id}
                </p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Priority <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                name="priority_id"
                value={formData.priority_id}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.priority_id ? '2px solid #dc2626' : '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white'
                }}
                onFocus={(e) => !errors.priority_id && (e.target.style.borderColor = '#0066CC')}
                onBlur={(e) => !errors.priority_id && (e.target.style.borderColor = '#e5e7eb')}
              >
                <option value="">Select priority</option>
                {priorities.map(priority => (
                  <option key={priority.id} value={priority.id}>{priority.name}</option>
                ))}
              </select>
              {errors.priority_id && (
                <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>
                  {errors.priority_id}
                </p>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 0 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Location <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Building A, Unit 201, Kitchen"
              style={{
                width: '100%',
                padding: '12px',
                border: errors.location ? '2px solid #dc2626' : '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              onFocus={(e) => !errors.location && (e.target.style.borderColor = '#0066CC')}
              onBlur={(e) => !errors.location && (e.target.style.borderColor = '#e5e7eb')}
            />
            {errors.location && (
              <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>
                {errors.location}
              </p>
            )}
          </div>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '20px' }}>Attachments</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
            Upload photos or documents related to this request (JPG, PNG, GIF, PDF - max 5MB each)
          </p>
          
          <div style={{ marginBottom: '16px' }}>
            <label 
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: '#f3f4f6',
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#374151',
                fontWeight: '500',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#e5e7eb';
                e.currentTarget.style.borderColor = '#9ca3af';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              📎 Choose Files
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.gif,.pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {errors.files && (
            <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '16px' }}>
              {errors.files}
            </p>
          )}

          {files.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ fontWeight: '500', marginBottom: '12px', color: '#374151' }}>
                Selected Files ({files.length})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {files.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      background: '#f9fafb',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      <span style={{ fontSize: '24px' }}>
                        {file.type.startsWith('image/') ? '🖼️' : '📄'}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          fontWeight: '500', 
                          fontSize: '14px', 
                          color: '#374151',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {file.name}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>
                          {formatFileSize(file.size)}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      style={{
                        padding: '6px 12px',
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {errors.submit && (
          <div style={{
            padding: '16px',
            background: '#fee2e2',
            color: '#dc2626',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid #fecaca'
          }}>
            {errors.submit}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn"
            style={{ minWidth: '120px' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ minWidth: '120px' }}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewJobPage;
