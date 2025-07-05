const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tmdbId: {
    type: String,
    required: true,
  },
  title: String,
  poster: String,
  releaseYear: String,
  imdbRating: String,
  status: {
    type: String,
    enum: ["Watched", "Want to Watch"],
    required: true,
  },
  personalRating: {
    type: Number,
    min: 1,
    max: 10,
  },
  comment: String,
  isFavorite: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Movie", movieSchema); 