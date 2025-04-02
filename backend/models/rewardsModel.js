const mongoose = require("mongoose");
const rewardsModel = mongoose.Schema({
  _id: ObjectId,
  debateId: ObjectId,
  totalStake: Number,
  winnerReward: Number,

  isDistributed: Boolean,
  createdAt: Date,
  updatedAt: Date,
});
const Rewards = mongoose.model("Rewards", rewardsModel);
module.exports = Rewards;
