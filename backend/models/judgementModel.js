const mongoose = require("mongoose");
const judgementModel = mongoose.Schema({
  _id: ObjectId,
  debateId: ObjectId, // Reference to the Debate
  argumentsAnalysis: [
    // Analysis for both participants
    {
      participantId: ObjectId,
      coherenceScore: Number, // AI score for logical coherence
      factualScore: Number, // AI fact-checking score
      rhetoricalScore: Number, // AI persuasion score
      overallScore: Number, // Weighted average
    },
  ],
  verdict: String, // Winner ID or draw
  finalDecision: String, // AI’s explanation
  recordedOnChain: Boolean, // Whether saved on-chain
  createdAt: Date,
  updatedAt: Date,
});
const Judgement = mongoose.model("Judgement", judgementModel);
module.exports = Judgement;
