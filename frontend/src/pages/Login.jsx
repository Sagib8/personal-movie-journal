// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './MySpace.css'; 
  import { useEffect } from "react";

function Login() {
  // Input states for login credentials and optional security answer
  const [identifier, setIdentifier] = useState(''); // email or username
  const [password, setPassword] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');

  // UI control states for conditional rendering of security question
  const [showSecurity, setShowSecurity] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState('');

  // Message state for feedback display
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0); // count login attempts
  const navigate = useNavigate();

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    navigate("/my-space");
  }
}, []);

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // Build payload depending on whether security answer is required
      const payload = showSecurity
        ? { identifier, password, securityAnswer }
        : { identifier, password };

      // Send login request to backend
      const res = await api.post('/auth/login', payload);
      const token = res.data.token;
      const firstName = res.data.firstName;
      const lastName = res.data.lastName;
      
    // Save token and redirect with welcome state (DO NOT persist first name)
      localStorage.setItem('token', token);
      setMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/my-space', { state: { from: 'login', firstName, lastName } }), 1000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setMessage('Login failed: ' + msg);
      setAttempts((prev) => prev + 1);

      // Display security question if server asks for it
      if (msg.includes('Security question required')) {
        setSecurityQuestion(err.response.data.question);
        setShowSecurity(true);
      }
    }
  };

  return (
    <div className="myspace-container bg-dark text-light min-vh-100 py-5">
      <div className="container">
        <h2 className="text-center mb-4">Login</h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mx-auto p-4 bg-dark text-light rounded" style={{ maxWidth: '450px' }}>
          {/* Email or Username */}
          <div className="mb-3">
            <label className="form-label">Email/Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off" 
            />
          </div>

          {/* Conditional Security Question */}
          {showSecurity && (
            <div className="mb-3">
              <label className="form-label">Security Question</label>
              <p className="text-info mb-1">{securityQuestion}</p>
              <input
                type="text"
                className="form-control"
                placeholder="Your Answer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        {/* Feedback message */}
        {message && <div className="alert alert-info text-center mt-3">{message}</div>}
      </div>
    </div>
  );
}

export default Login;