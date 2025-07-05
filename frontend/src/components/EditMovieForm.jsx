// src/components/EditMovieForm.jsx
import React, { useState } from 'react';
import api from '../api/axios';

// A collapsible form to edit movie details inline under each card
function EditMovieForm({ movie, onUpdate, onClose }) {
  const [status, setStatus] = useState(movie.status);
  const [personalRating, setPersonalRating] = useState(movie.personalRating || '');
  const [comment, setComment] = useState(movie.comment || '');
  const [isFavorite, setIsFavorite] = useState(movie.isFavorite);
  const [saving, setSaving] = useState(false);

  // Submit the updated movie details to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const updatedMovie = {
        status,
        personalRating,
        comment,
        isFavorite
      };

      const res = await api.put(`/movies/${movie._id}`, updatedMovie, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onUpdate(res.data); // Pass the updated movie back to parent
      onClose(); // Close the form
    } catch (err) {
      console.error('Failed to update movie:', err);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-secondary p-3 rounded mt-3">
      <div className="mb-2">
        <label className="form-label text-light">Status:</label>
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Watched">Watched</option>
          <option value="Want to Watch">Want to Watch</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="form-label text-light">Personal Rating (1–10):</label>
        <input
          type="number"
          className="form-control"
          min="1"
          max="10"
          value={personalRating}
          onChange={(e) => setPersonalRating(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label className="form-label text-light">Comment:</label>
        <textarea
          className="form-control"
          rows="2"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id={`fav-${movie._id}`}
          checked={isFavorite}
          onChange={() => setIsFavorite(!isFavorite)}
        />
        <label className="form-check-label text-light" htmlFor={`fav-${movie._id}`}>
          Mark as Favorite ⭐
        </label>
      </div>

      <button type="submit" className="btn btn-light me-2" disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </button>
      <button type="button" className="btn btn-outline-light" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
}

export default EditMovieForm;