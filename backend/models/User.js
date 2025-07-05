// models/User.js
const mongoose = require("mongoose");

// Define the schema for a user in the system
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,         // Remove leading/trailing spaces
    minlength: 2        // Minimum length for validity
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  username: {
    type: String,
    required: true,
    unique: true,       // Ensure no duplicates
    lowercase: true,    // Store in lowercase for consistency
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true      // Will store hashed password
  },
  securityQuestion: {
    type: String        // User's selected security question
  },
  securityAnswerHash: {
    type: String        // Hashed answer to the security question
  },
  failedLoginAttempts: {
    type: Number,
    default: 0          // Track failed login attempts for security
  },
  lastLogin: {
    type: Date          // Timestamp of last successful login
  },
  createdAt: {
    type: Date,
    default: Date.now   // Automatically set on registration
  }
});

// Export the User model
module.exports = mongoose.model("User", userSchema);