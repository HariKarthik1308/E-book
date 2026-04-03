import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '', author: '', category: '', description: '', isbn: '', publish_date: '', language: 'English'
  });
  const [files, setFiles] = useState({ cover_image: null, file: null });
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, authorsRes, categoriesRes] = await Promise.all([
        api.get('dashboard/summary/'),
        api.get('authors/'),
        api.get('categories/')
      ]);
      setStats(statsRes.data);
      setAuthors(authorsRes.data.results !== undefined ? authorsRes.data.results : authorsRes.data);
      setCategories(categoriesRes.data.results !== undefined ? categoriesRes.data.results : categoriesRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles({ ...files, [name]: selectedFiles[0] });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!files.file) {
      setUploadError("A PDF file is required.");
      return;
    }
    
    setUploading(true);
    setUploadError('');
    setUploadSuccess('');
    
    const submitData = new FormData();
    for (const key in formData) {
      if (formData[key]) submitData.append(key, formData[key]);
    }
    if (files.cover_image) submitData.append('cover_image', files.cover_image);
    if (files.file) submitData.append('file', files.file);
    
    try {
      await api.post('books/', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadSuccess('Book uploaded successfully!');
      setFormData({ title: '', author: '', category: '', description: '', isbn: '', publish_date: '', language: 'English' });
      setFiles({ cover_image: null, file: null });
      e.target.reset(); // reset file inputs
      fetchDashboardData(); // Refresh stats
    } catch (error) {
      console.error('Error uploading book:', error);
      setUploadError(error.response?.data?.detail || "An error occurred while uploading. Please ensure all fields are correct.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="text-center p-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-secondary">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="container py-5 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-1">Admin Dashboard</h2>
          <p className="text-secondary">Welcome back, {user?.username}. Manage your library here.</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="row g-4 mb-5">
          <div className="col-12 col-sm-6 col-md-3">
            <div className="card glass-panel border-0 text-center py-4">
              <h3 className="fw-bold text-primary">{stats.total_books}</h3>
              <p className="text-secondary mb-0">Total Books</p>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <div className="card glass-panel border-0 text-center py-4">
              <h3 className="fw-bold text-secondary">{stats.total_users}</h3>
              <p className="text-secondary mb-0">Active Users</p>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <div className="card glass-panel border-0 text-center py-4">
              <h3 className="fw-bold" style={{ color: '#10b981' }}>{stats.total_views}</h3>
              <p className="text-secondary mb-0">Book Views</p>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <div className="card glass-panel border-0 text-center py-4">
              <h3 className="fw-bold" style={{ color: '#f59e0b' }}>{stats.total_downloads}</h3>
              <p className="text-secondary mb-0">Downloads</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout: New Book Form on left, Recent interactions or links on right */}
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card glass-panel border-0 p-4">
            <h4 className="fw-bold mb-4">Upload New Book</h4>
            
            {uploadSuccess && <div className="alert alert-success">{uploadSuccess}</div>}
            {uploadError && <div className="error-message">{uploadError}</div>}
            
            <form onSubmit={handleAddBook}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="input-label">Title *</label>
                  <input type="text" className="input-field" name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="input-label">ISBN</label>
                  <input type="text" className="input-field" name="isbn" value={formData.isbn} onChange={handleInputChange} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="input-label">Author *</label>
                  <select className="input-field" name="author" value={formData.author} onChange={handleInputChange} required>
                    <option value="">Select Author...</option>
                    {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="input-label">Category *</label>
                  <select className="input-field" name="category" value={formData.category} onChange={handleInputChange} required>
                    <option value="">Select Category...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="input-label">Description</label>
                <textarea className="input-field" name="description" rows="3" value={formData.description} onChange={handleInputChange}></textarea>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="input-label">Publish Date</label>
                  <input type="date" className="input-field" name="publish_date" value={formData.publish_date} onChange={handleInputChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="input-label">Language</label>
                  <input type="text" className="input-field" name="language" value={formData.language} onChange={handleInputChange} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <label className="input-label">Book File (PDF) *</label>
                  <input type="file" className="form-control" name="file" accept=".pdf" onChange={handleFileChange} required />
                </div>
                <div className="col-md-6 mb-4">
                  <label className="input-label">Cover Image</label>
                  <input type="file" className="form-control" name="cover_image" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={uploading}>
                {uploading ? 'Uploading Book...' : 'Submit Book to Library'}
              </button>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card glass-panel border-0 p-4 h-100">
            <h4 className="fw-bold mb-4">Quick Links</h4>
            <div className="d-grid gap-3">
              <button disabled className="nav-btn outline text-start p-3 d-flex justify-content-between align-items-center">
                <span>Manage Authors</span>
                <i className="bi bi-chevron-right"></i>
              </button>
              <button disabled className="nav-btn outline text-start p-3 d-flex justify-content-between align-items-center">
                <span>Manage Categories</span>
                <i className="bi bi-chevron-right"></i>
              </button>
              <button disabled className="nav-btn outline text-start p-3 d-flex justify-content-between align-items-center">
                <span>View System Logs</span>
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
            <div className="mt-auto pt-4 text-center">
              <p className="text-secondary small mb-0">E-Book Manager Dashboard v1.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
