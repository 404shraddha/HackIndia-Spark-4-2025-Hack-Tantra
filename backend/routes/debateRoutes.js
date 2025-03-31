const express = require("express");
const {
  createController,
  specificDebateController,
  allDebatesController,
} = require("../Controllers/debateController");
const authMiddleware = require("../middlewares/authMiddleware");

const Router = express.Router();

// 👇 Routes with middleware
Router.post("/create", authMiddleware, createController);
Router.get("/:id", authMiddleware, specificDebateController);
Router.get("/", authMiddleware, allDebatesController);

module.exports = Router;
