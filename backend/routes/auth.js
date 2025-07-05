const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    securityQuestion,
    securityAnswer
  } = req.body;

  // Basic input validation
  if (!firstName || !lastName || !username || !email || !password) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }

  try {
    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Hash password and security answer
    const hashedPassword = await bcrypt.hash(password, 10);
    const securityAnswerHash = securityAnswer
      ? await bcrypt.hash(securityAnswer, 10)
      : undefined;

    // Create user in database
    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      securityQuestion,
      securityAnswerHash
    });

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Respond with token and full name (no localStorage!)
    res.status(201).json({ token, firstName: newUser.firstName, lastName: newUser.lastName });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user with optional security question
 * @access  Public
 */
router.post("/login", async (req, res) => {
  const { identifier, password, securityAnswer } = req.body;

  try {
    // Lookup user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increase failed login attempts
      user.failedLoginAttempts += 1;
      await user.save();

      // If more than 3 failures, request security question
      if (user.failedLoginAttempts >= 3 && user.securityQuestion) {
        return res.status(401).json({
          message: "Security question required",
          question: user.securityQuestion,
        });
      }

      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If security question is required, verify answer
    if (user.failedLoginAttempts >= 3 && user.securityQuestion) {
      if (!securityAnswer) {
        return res.status(401).json({
          message: "Security question required",
          question: user.securityQuestion,
        });
      }

      const isAnswerMatch = await bcrypt.compare(securityAnswer, user.securityAnswerHash || '');
      if (!isAnswerMatch) {
        return res.status(401).json({ message: "Incorrect security answer" });
      }
    }

    // Reset login attempts and update last login
    user.failedLoginAttempts = 0;
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token and return user name
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ token, firstName: user.firstName, lastName: user.lastName });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/auth/check-username
 * @desc    Check if a username is available
 * @access  Public
 */
router.get("/check-username", async (req, res) => {
  const { username } = req.query;

  if (!username || username.trim().length < 3) {
    return res.status(400).json({ message: "Invalid username" });
  }

  try {
    const user = await User.findOne({ username: username.toLowerCase().trim() });
    res.json({ available: !user });
  } catch (err) {
    console.error("Username check error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;