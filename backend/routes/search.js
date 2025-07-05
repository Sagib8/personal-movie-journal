const express = require("express");
const axios = require("axios");

const router = express.Router();

/**
 * @route   GET /api/search
 * @desc    Search movies by title from TMDB
 * @access  Public
 */
router.get("/", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
    const tmdbRes = await axios.get("https://api.themoviedb.org/3/search/movie", {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query,
      },
    });

    // Extract and map results
    const results = tmdbRes.data.results.map((movie) => ({
      tmdbId: movie.id,
      title: movie.title,
      releaseYear: movie.release_date ? movie.release_date.slice(0, 4) : "N/A",
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      overview: movie.overview,
      rating: movie.vote_average,
    }));

    res.json(results);
  } catch (err) {
    console.error("TMDB search error:", err);
    res.status(500).json({ message: "Failed to fetch movies from TMDB" });
  }
});
/**
 * @route   GET /api/search/:tmdbId
 * @desc    Get detailed info for a movie from TMDB
 * @access  Public
 */
router.get("/:tmdbId", async (req, res) => {
  const { tmdbId } = req.params;

  try {
    const tmdbRes = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
      },
    });

    const movie = tmdbRes.data;

    res.json({
      tmdbId: movie.id,
      title: movie.title,
      releaseYear: movie.release_date ? movie.release_date.slice(0, 4) : "N/A",
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      overview: movie.overview,
      rating: movie.vote_average,
      runtime: movie.runtime,
      genres: movie.genres.map((g) => g.name),
      tagline: movie.tagline,
    });
  } catch (err) {
    console.error("TMDB detail fetch error:", err);
    res.status(500).json({ message: "Failed to fetch movie details" });
  }
});

module.exports = router;