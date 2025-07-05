const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db"); 
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const searchRoutes = require("./routes/search");

const app = express();
const PORT = process.env.PORT || 4000;

// Define allowed origins for CORS
const allowedOrigins = ['http://localhost:5173']; // Replace with your frontend domain in production

// Configure CORS with origin validation
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use((req, res, next) => {
  res.type('application/json');
  next();
});

// Parse incoming JSON requests
app.use(express.json());

// Set common security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');  // Prevent MIME sniffing
  res.setHeader('X-Frame-Options', 'DENY');            // Prevent clickjacking
  next();
});

// Basic test routes
app.get("/", (req, res) => res.send("API is working"));
app.get("/test", (req, res) => res.send("Server works"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/search", searchRoutes);

// Start server after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});