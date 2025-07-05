// src/pages/MySpace.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import EditMovieForm from '../components/EditMovieForm';
import './MySpace.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function MySpace() {
  // State hooks for data, errors, filters, edit mode, and welcome control
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [fullName, setFullName] = useState('');
  const [fromPage, setFromPage] = useState(null); // 'login' or 'register' or null

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect unauthenticated users
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch movies from backend
    const fetchMovies = async () => {
      try {
        const res = await api.get('/movies', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Eliminate duplicates using tmdbId
        const uniqueMovies = [];
        const seenTmdbIds = new Set();
        for (const movie of res.data) {
          if (!seenTmdbIds.has(movie.tmdbId)) {
            uniqueMovies.push(movie);
            seenTmdbIds.add(movie.tmdbId);
          }
        }

        setMovies(uniqueMovies);
      } catch (err) {
        setError('Failed to fetch movies: ' + (err.response?.data?.message || 'Unknown error'));
      }
    };

    // Extract full name and source page from navigation state
    const first = location.state?.firstName;
    const last = location.state?.lastName;
    const from = location.state?.from;

    if (first && last) {
      setFullName(`${first} ${last}`);
    } else if (first) {
      setFullName(first);
    } else if (last) {
      setFullName(last);
    }

    if (from === 'login' || from === 'register') {
      setFromPage(from); // will be used for welcome message
    }

    fetchMovies();
  }, [location.state]);

  // Filter movies based on selected category
  const filteredMovies = movies.filter((movie) => {
    if (filter === 'All') return true;
    if (filter === 'Favorites') return movie.isFavorite;
    return movie.status === filter;
  });

  // Replace movie in state after update
  const handleUpdate = (updatedMovie) => {
    setMovies((prev) => prev.map((m) => (m._id === updatedMovie._id ? updatedMovie : m)));
  };

  // Delete movie and update UI
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/movies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert('Failed to delete movie: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="myspace-container bg-dark text-light min-vh-100 py-5">
      <div className="container">
        {/* Show welcome message ONLY after login or register */}
        {fromPage === 'register' && (
          <div className="alert alert-success text-center">
            Welcome, <strong>{fullName}</strong>! Ready to start tracking your movies?
          </div>
        )}
        {fromPage === 'login' && (
          <div className="text-center text-secondary mb-3">
            Welcome back, <strong>{fullName}</strong>!
          </div>
        )}

        {/* Page title */}
        <h2 className="mb-4 text-center display-5">My Space</h2>

        {/* Filter buttons */}
        <div className="d-flex justify-content-center mb-4">
          {['All', 'Watched', 'Want to Watch', 'Favorites'].map((tab) => (
            <button
              key={tab}
              className={`btn mx-2 ${filter === tab ? 'btn-light' : 'btn-outline-light'}`}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Show error or empty state */}
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {filteredMovies.length === 0 && !error && <p className="text-center">No movies found for this filter.</p>}

        {/* Movie cards */}
        <div className="row justify-content-center">
          {filteredMovies.map((movie) => (
            <div key={movie._id} className="col-md-4 mb-4">
              <div className="card movie-card text-bg-dark h-100">
                {/* Movie detail link */}
                <Link to={`/movie/${movie.tmdbId}`} className="text-decoration-none text-light">
                  {movie.poster && (
                    <img src={movie.poster} alt={movie.title} className="card-img-top movie-poster" />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{movie.title} ({movie.releaseYear})</h5>
                    <p className="card-text">
                      <strong>Status:</strong> {movie.status}<br />
                      <strong>Personal Rating:</strong> {movie.personalRating || 'N/A'}<br />
                      <strong>Comment:</strong> {movie.comment || '—'}<br />
                      {movie.isFavorite ? 'Favorite ⭐' : ''}
                    </p>
                  </div>
                </Link>

                {/* Edit and delete buttons */}
                <div className="card-footer bg-transparent border-top-0">
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-outline-light"
                      onClick={() => setEditingId((prev) => (prev === movie._id ? null : movie._id))}
                    >
                      {editingId === movie._id ? 'Close Edit' : 'Edit'}
                    </button>
                    {editingId === movie._id && (
                      <>
                        <button className="btn btn-danger" onClick={() => handleDelete(movie._id)}>
                          Delete
                        </button>
                        <EditMovieForm
                          movie={movie}
                          onUpdate={handleUpdate}
                          onClose={() => setEditingId(null)}
                        />
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MySpace;