// src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const location = useLocation(); // Get current path
  const navigate = useNavigate();

  // Check if user is logged in by checking if token exists
  const isLoggedIn = !!localStorage.getItem('token');

  // Logout function: remove token and redirect to login
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('firstName'); // 🧹 Also clear the stored name
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-dark bg-black border-bottom border-secondary px-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Brand / Logo */}
        <Link className="navbar-brand" to={isLoggedIn ? "/my-space" : "/login"}>
          Movie Journal
        </Link>

        {/* Right-side nav buttons */}
        <div className="d-flex gap-3">
          {isLoggedIn ? (
            <>
              {/* Only show if not already on that page */}
              {location.pathname !== '/my-space' && (
                <Link className="btn btn-outline-light" to="/my-space">My Space</Link>
              )}
              {location.pathname !== '/search' && (
                <Link className="btn btn-outline-light" to="/search">Search</Link>
              )}
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <Link className="btn btn-outline-light" to="/login">Login</Link>
              )}
              {location.pathname !== '/register' && (
                <Link className="btn btn-outline-light" to="/register">Register</Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;