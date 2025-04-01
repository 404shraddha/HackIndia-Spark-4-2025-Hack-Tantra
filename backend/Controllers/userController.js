const express = require("express");
const UserModel = require("../models/userModel");
const debateModel = require("../models/debateModel");
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../config/generateTokens");
const bcrypt = require("bcryptjs");

// Login Controller
const loginController = expressAsyncHandler(async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const user = await UserModel.findOne({ name });

  if (!user) {
    res.status(401).json({ message: "Invalid username or password" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    const token = generateToken(user._id); // Generate a JWT token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token, // Include token in the response
    });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// Signup Controller
const signupController = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input fields
  if (!name || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  // Check if username already exists
  const usernameExist = await UserModel.findOne({ name });
  if (usernameExist) {
    res.status(400).json({ message: "Username already exists" });
    return;
  }

  // Check if email already exists
  const userExist = await UserModel.findOne({ email });
  if (userExist) {
    res.status(400).json({ message: "Email already exists" });
    return;
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user with 150 coins
  const newUser = await UserModel.create({
    name,
    email,
    password: hashedPassword, // Store hashed password
    coins: 150, // Set initial coins to 150
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      coins: newUser.coins, // Include coins in response
      token: generateToken(newUser._id), // Generate and return token
    });
  } else {
    res.status(400).json({ message: "Registration failed" });
  }
});

// Profile Controller
const profileController = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const user = await UserModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const debatesWon = await debateModel.countDocuments({ winner: user._id });
    const debatesLost = await debateModel.countDocuments({
      $and: [
        { $or: [{ participant1: user._id }, { participant2: user._id }] },
        { winner: { $ne: user._id } },
      ],
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      debatesWon,
      debatesLost,
      coins: user.coins,
      token: req.headers.authorization.split(" ")[1], // Make sure the token is valid
    });
  } catch (error) {
    console.error("Error in Profile Controller:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { loginController, signupController, profileController };
