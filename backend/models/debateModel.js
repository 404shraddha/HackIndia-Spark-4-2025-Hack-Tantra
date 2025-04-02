const mongoose = require("mongoose");

const debateModel = mongoose.Schema({
  topic: String,
  participant1: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  participant2: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  stakeAmount: Number,
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  aiDecision: String,
  resultOnChain: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Debate = mongoose.model("Debate", debateModel);
module.exports = Debate;
