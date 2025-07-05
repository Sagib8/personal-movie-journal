import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './MySpace.css';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [userMovies, setUserMovies] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate(); // Used to redirect unauthenticated users

  // Check for auth token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [navigate]);

  // Fetch user's existing movies
  const fetchUserMovies = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/movies', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserMovies(res.data);
    } catch (err) {
      console.error('Failed to fetch user movies');
    }
  };

  useEffect(() => {
    fetchUserMovies();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.get(`/search?query=${query}`);
      setResults(res.data);
    } catch (err) {
      setMessage('Failed to search movies.');
    }
  };

  const handleAddMovie = async (movie) => {
    const alreadyAdded = userMovies.some((m) => String(m.tmdbId) === String(movie.tmdbId));
    if (alreadyAdded) {
      setMessage(`"${movie.title}" is already in your space.`);
      return;
    }

    try {
      setLoadingId(movie.tmdbId);

      const token = localStorage.getItem('token');
      const payload = {
        tmdbId: movie.tmdbId,
        title: movie.title,
        poster: movie.poster,
        releaseYear: movie.releaseYear,
        imdbRating: movie.rating,
        status: 'Want to Watch',
        personalRating: null,
        comment: '',
        isFavorite: false,
      };

      await api.post('/movies', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchUserMovies();
      setMessage(`"${movie.title}" added to your space.`);
    } catch (err) {
      setMessage('Failed to add movie: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="myspace-container bg-dark text-light min-vh-100 py-4">
      <div className="container">
        <h2 className="mb-4 text-center">Search Movies</h2>
        <form className="mb-4" onSubmit={handleSearch}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search for a movie..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">Search</button>
          </div>
        </form>

        {message && <div className="alert alert-info text-center">{message}</div>}

        <div className="row">
          {results.map((movie) => {
            const alreadyAdded = userMovies.some((m) => String(m.tmdbId) === String(movie.tmdbId));
            const isLoading = loadingId === movie.tmdbId;

            return (
              <div key={movie.tmdbId} className="col-md-4 mb-4">
                <div className="card movie-card text-bg-dark h-100">
                  <Link to={`/movie/${movie.tmdbId}`} className="text-decoration-none text-light">
                    {movie.poster && (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="card-img-top movie-poster"
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">
                        {movie.title} ({movie.releaseYear})
                      </h5>
                      <p className="card-text">
                        <strong>IMDb:</strong> {movie.rating || 'N/A'}<br />
                        <strong>Overview:</strong> {movie.overview?.slice(0, 80) || '—'}...
                      </p>
                    </div>
                  </Link>

                  <div className="card-footer bg-transparent border-top-0">
                    <button
                      className="btn btn-outline-light w-100"
                      onClick={() => handleAddMovie(movie)}
                      disabled={alreadyAdded || isLoading}
                    >
                      {alreadyAdded ? ' Added' : isLoading ? 'Adding...' : '➕ Add to My Space'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Search;