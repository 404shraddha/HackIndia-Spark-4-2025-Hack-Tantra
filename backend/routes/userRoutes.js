const express = require("express");
const {
  loginController,
  signupController,
  profileController,
} = require("../Controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const Router = express.Router();
Router.post("/login", loginController);
Router.post("/signup", signupController);
Router.get("/profile", authMiddleware, profileController);
module.exports = Router;
