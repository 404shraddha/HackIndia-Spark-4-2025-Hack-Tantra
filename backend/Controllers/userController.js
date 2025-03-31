const express = require("express");
const UserModel = require("../models/userModel");
const debateModel = require("../models/debateModel");
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../config/generateTokens");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middlewares/authMiddleware");
const loginController = expressAsyncHandler(async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  //  Query the correct field name (case-sensitive)
  const user = await UserModel.findOne({ name });

  if (!user) {
    res.status(401).json({ message: "Invalid username or password" });
    return;
  }

  //  Compare hashed password with plaintext password
  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

module.exports = loginController;
const signupController = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const usernameExist = await UserModel.findOne({ name });
  if (usernameExist) {
    res.status(400).json({ message: "Username already exists" });
    return;
  }

  const userExist = await UserModel.findOne({ email });
  if (userExist) {
    res.status(400).json({ message: "Email already exists" });
    return;
  }

  //  Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await UserModel.create({
    name,
    email,
    password: hashedPassword, //  Store hashed password
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400).json({ message: "Registration failed" });
  }
});

module.exports = signupController;
const profileController = async (req, res) => {
  try {
    console.log("User from Middleware:", req.user); // ✅ Confirm middleware data

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
      token: req.headers.authorization.split(" ")[1],
    });
  } catch (error) {
    console.error("Error in Profile Controller:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = profileController;

module.exports = { loginController, signupController, profileController };
