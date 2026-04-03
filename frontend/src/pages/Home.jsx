import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="hero-section">
      <h1 className="hero-title">
        The Modern <span className="text-gradient">E-Book</span> Experience
      </h1>
      <p className="hero-subtitle">
        Manage, discover, and read your favorite books in one beautifully designed platform.
        Experience digital reading like never before.
      </p>
      
      {!user ? (
        <div className="d-flex gap-3">
          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '1rem 2rem' }}>
            Get Started
          </Link>
        </div>
      ) : (
        <div className="d-flex gap-3">
          <Link to="/books" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '1rem 2rem' }}>
            Browse Collection
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
