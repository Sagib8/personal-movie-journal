// src/pages/MovieDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './MySpace.css';

function MovieDetail() {
  const { id } = useParams(); // This is always a TMDB id
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);  // Full movie data from TMDB
  const [error, setError] = useState('');

  // Fetch movie details from TMDB by ID
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await api.get(`/search/${id}`); // Always call TMDB endpoint
        setMovie(res.data);
      } catch {
        setError('Failed to load movie details.');
      }
    };

    fetchMovie();
  }, [id]);

  if (error) return <div className="text-danger text-center mt-4">{error}</div>;
  if (!movie) return <div className="text-light text-center mt-4">Loading movie...</div>;

  return (
    <div className="myspace-container bg-dark text-light min-vh-100 py-5">
      <div className="container">
        {/* Back navigation */}
        <button className="btn btn-outline-light mb-4" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Movie info card */}
        <div className="card text-bg-dark">
          {movie.poster && (
            <img src={movie.poster} alt={movie.title} className="card-img-top movie-poster" />
          )}
          <div className="card-body">
            <h3 className="card-title">
              {movie.title} ({movie.releaseYear})
            </h3>
            <p className="card-text">
              <strong>IMDb Rating:</strong> {movie.rating || 'N/A'}<br />
              <strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} min` : '—'}<br />
              <strong>Genres:</strong> {movie.genres?.join(', ') || '—'}<br />
              <strong>Tagline:</strong> {movie.tagline || '—'}<br />
              <strong>Overview:</strong> {movie.overview || '—'}<br />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;