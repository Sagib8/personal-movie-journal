// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './MySpace.css'; // Dark theme styling

function Register() {
  // Input states for all form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');

  // Validation and feedback states
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showValidation, setShowValidation] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    navigate("/my-space");
  }
}, []);

  // Check password strength (at least 8 characters, uppercase, lowercase, and number)
  useEffect(() => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    setPasswordValid(regex.test(password));
  }, [password]);

  // Validate that passwords match
  useEffect(() => {
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  // Check username availability (debounced API call)
  useEffect(() => {
    const checkAvailability = async () => {
      if (username.trim().length < 3) {
        setIsUsernameAvailable(null);
        return;
      }

      try {
        const res = await api.get(`/auth/check-username?username=${username}`);
        setIsUsernameAvailable(res.data.available);
      } catch {
        setIsUsernameAvailable(null);
      }
    };

    const timeout = setTimeout(checkAvailability, 500); // debounce delay
    return () => clearTimeout(timeout);
  }, [username]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowValidation(true);

    // Prevent form submission if validation fails
    if (!passwordValid || !passwordsMatch || isUsernameAvailable === false) return;

    try {
      const payload = {
        firstName,
        lastName,
        username,
        email,
        password,
        securityQuestion,
        securityAnswer,
      };

      const res = await api.post('/auth/register', payload);
      const { token, firstName: fName, lastName: lName } = res.data;

      // Save JWT token in localStorage (authentication)
      localStorage.setItem('token', token);

      // Redirect to my-space with user info in navigation state
      setMessage('Registration successful!');
      setTimeout(() => {
        navigate('/my-space', {
          state: {
            from: 'register',
            firstName: fName,
            lastName: lName,
          },
        });
      }, 1500);
    } catch (err) {
      setMessage('Registration failed: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="myspace-container bg-dark text-light min-vh-100 py-5">
      <div className="container">
        <h2 className="text-center mb-4">Register</h2>

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="mx-auto p-4 bg-dark text-light rounded" style={{ maxWidth: '500px' }}>
          {/* First Name */}
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>

          {/* Last Name */}
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>

          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className={`form-control ${isUsernameAvailable === false ? 'is-invalid' : ''}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {isUsernameAvailable === false && <div className="invalid-feedback">Username already taken</div>}
            {isUsernameAvailable === true && <div className="form-text text-success">Username is available</div>}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
            />
            {showValidation && !passwordValid && (
              <div className="form-text text-danger">
                Password must be at least 8 characters long and include uppercase, lowercase, and a number.
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-control"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="off"
            />
            {showValidation && !passwordsMatch && (
              <div className="form-text text-danger">Passwords do not match</div>
            )}
          </div>

          {/* Security Question */}
          <div className="mb-3">
            <label className="form-label">Security Question</label>
            <select
              className="form-select"
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              required
            >
              <option value="">Select a security question</option>
              <option value="What was the name of your first school?">What was the name of your first school?</option>
              <option value="What is your favorite movie?">What is your favorite movie?</option>
              <option value="What was your first pet’s name?">What was your first pet’s name?</option>
            </select>
          </div>

          {/* Security Answer */}
          <div className="mb-4">
            <label className="form-label">Answer</label>
            <input
              className="form-control"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={!passwordValid || !passwordsMatch || isUsernameAvailable === false}
          >
            Register
          </button>
        </form>

        {/* Feedback message */}
        {message && <div className="alert alert-info text-center mt-3">{message}</div>}
      </div>
    </div>
  );
}

export default Register;