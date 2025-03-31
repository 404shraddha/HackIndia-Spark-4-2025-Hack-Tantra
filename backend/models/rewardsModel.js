const mongoose = require("mongoose");
const rewardsModel = mongoose.Schema({
  _id: ObjectId,
  debateId: ObjectId, // Reference to the Debate
  totalStake: Number, // Total SOL tokens staked
  winnerReward: Number, // Amount given to the winner

  isDistributed: Boolean, // Whether rewards have been sent
  createdAt: Date,
  updatedAt: Date,
});
const Rewards = mongoose.model("Rewards", rewardsModel);
module.exports = Rewards;
