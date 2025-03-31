const express = require("express");
const {
  distributeController,
  rewardsByDebateIdController,
} = require("../Controllers/rewardsController");
const authMiddleware = require("../middlewares/authMiddleware");

const Router = express.Router();

Router.post("/distribute", authMiddleware, distributeController);
Router.get("/:debateId", authMiddleware, rewardsByDebateIdController);

module.exports = Router;
