const express = require("express");
const Movie = require("../models/Movie");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   POST /api/movies
 * @desc    Add a movie to the user's personal journal
 * @access  Private
 */
router.post("/", authMiddleware, async (req, res) => {
  const {
    tmdbId,
    title,
    poster,
    releaseYear,
    imdbRating,
    status,
    personalRating,
    comment,
    isFavorite,
  } = req.body;

  try {
    // Prevent duplicate: check if the movie already exists for this user
    const existing = await Movie.findOne({
      userId: req.user.id,
      tmdbId: tmdbId,
    });

    if (existing) {
      return res.status(400).json({ message: "Movie already added to your journal" });
    }

    // Create the new movie
    const createdMovie = await Movie.create({
      userId: req.user.id, // Link movie to current user
      tmdbId,
      title,
      poster,
      releaseYear,
      imdbRating,
      status,
      personalRating,
      comment,
      isFavorite,
    });

    // Re-fetch full movie object (in case of schema defaults, virtuals, etc.)
    const movie = await Movie.findById(createdMovie._id);

    res.status(201).json(movie);
  } catch (err) {
    console.error("Error saving movie:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/movies
 * @desc    Get all movies for the logged-in user
 * @access  Private
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const movies = await Movie.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/movies/:id
 * @desc    Get a single movie by ID for the current user
 * @access  Private
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const movie = await Movie.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (err) {
    console.error("Error fetching movie by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   PUT /api/movies/:id
 * @desc    Update a movie in the user's journal
 * @access  Private
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Movie.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating movie:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   DELETE /api/movies/:id
 * @desc    Delete a movie from the user's journal
 * @access  Private
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Movie.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ message: "Movie deleted" });
  } catch (err) {
    console.error("Error deleting movie:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/movies/favorites
 * @desc    Get all favorite movies of the user
 * @access  Private
 */
router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const favorites = await Movie.find({
      userId: req.user.id,
      isFavorite: true,
    }).sort({ createdAt: -1 });

    res.json(favorites);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ message: "Server error" });
  }
});
/**
 * @route   GET /api/movies/by-tmdb/:tmdbId
 * @desc    Get a movie by its TMDB ID
 * @access  Private
 */
router.get("/by-tmdb/:tmdbId", authMiddleware, async (req, res) => {
  try {
    const movie = await Movie.findOne({
      userId: req.user.id,
      tmdbId: req.params.tmdbId,
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found by TMDB ID" });
    }

    res.json(movie);
  } catch (err) {
    console.error("Error fetching by TMDB ID:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;