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
Router.get("/:id", specificDebateController);
Router.get("/", allDebatesController);

module.exports = Router;
