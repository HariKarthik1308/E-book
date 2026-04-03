import React, { useState, useEffect } from 'react';
import api from '../services/api';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('books/');
      // Handle Django REST Framework pagination if it returns an object with results
      const booksData = response.data.results !== undefined ? response.data.results : response.data;
      setBooks(booksData);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (book.author_name && book.author_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (book.category_name && book.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto', flex: 1 }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1">E-Book Library</h2>
          <p className="text-secondary mb-0">Browse and discover new books to read.</p>
        </div>
        <div style={{ minWidth: '300px' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search by title, author, or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="error-message fade-in">{error}</div>}

      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-secondary">Loading digital library...</p>
        </div>
      ) : (
        <>
          {filteredBooks.length === 0 ? (
            <div className="text-center p-5 glass-panel" style={{ borderRadius: '16px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <h4>No books found</h4>
              <p className="text-secondary">Try adjusting your search filters or check back later.</p>
            </div>
          ) : (
            <div className="row g-4 fade-in">
              {filteredBooks.map((book) => (
                <div key={book.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <div className="card h-100 glass-panel border-0" style={{ transition: 'transform 0.2s', cursor: 'pointer', overflow: 'hidden' }}>
                    <div style={{ height: '280px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border-color)' }}>
                      {book.cover_image ? (
                        <img 
                          src={book.cover_image} 
                          alt={book.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <span style={{ fontSize: '4rem', opacity: 0.5 }}>📖</span>
                      )}
                    </div>
                    <div className="card-body">
                      <span className="badge bg-primary bg-opacity-10 text-primary mb-2 px-2 py-1" style={{ borderRadius: '6px' }}>
                        {book.category_name || 'Uncategorized'}
                      </span>
                      <h5 className="card-title fw-bold text-truncate" title={book.title}>{book.title}</h5>
                      <p className="card-text text-secondary small mb-3">By {book.author_name || 'Unknown Author'}</p>
                      
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="text-muted small">
                          <i className="bi bi-eye"></i> {book.total_views} views
                        </span>
                        <a href={book.file} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', width: 'auto', textDecoration: 'none' }}>
                          Read
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookList;
