const mongoose = require("mongoose");

const debateModel = mongoose.Schema({
  topic: String, // Debate topic
  participant1: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User ID of participant 1
  participant2: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User ID of participant 2
  stakeAmount: Number, // Staked SOL tokens
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User ID of the winner (AI-chosen)
  aiDecision: String, // AI judgment summary
  resultOnChain: Boolean, // True if result is recorded on-chain
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Debate = mongoose.model("Debate", debateModel);
module.exports = Debate;
