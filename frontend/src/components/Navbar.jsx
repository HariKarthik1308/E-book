import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar-custom">
      <Link to="/" className="navbar-brand text-gradient">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
        E-Docs
      </Link>
      
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/books" className="nav-link">Browse Books</Link>
            {user.role === 'Admin' && (
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            )}
            <div className="d-flex align-items-center gap-3">
              <span className="fw-medium">Hi, {user.username}</span>
              <button onClick={handleLogout} className="nav-btn outline">Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
