const mongoose = require("mongoose");
const judgementModel = mongoose.Schema({
  _id: ObjectId,
  debateId: ObjectId,
  argumentsAnalysis: [
    {
      participantId: ObjectId,
      coherenceScore: Number,
      factualScore: Number,
      rhetoricalScore: Number,
      overallScore: Number,
    },
  ],
  verdict: String,
  finalDecision: String,
  recordedOnChain: Boolean,
  createdAt: Date,
  updatedAt: Date,
});
const Judgement = mongoose.model("Judgement", judgementModel);
module.exports = Judgement;
