const Debate = require("../models/debateModel");

const distributeController = async (req, res) => {
  try {
    const { debateId, winner, rewardAmount } = req.body;

    const debate = await Debate.findById(debateId);

    if (!debate) {
      return res.status(404).json({ message: "Debate not found" });
    }

    if (
      winner !== debate.participant1.toString() &&
      winner !== debate.participant2.toString()
    ) {
      return res.status(400).json({ message: "Invalid winner ID" });
    }

    debate.winner = winner;
    debate.resultOnChain = true;
    await debate.save();

    res.status(200).json({
      message: "Rewards distributed successfully",
      debate,
      rewardAmount,
    });
  } catch (error) {
    console.error("Error distributing rewards:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rewardsByDebateIdController = async (req, res) => {
  try {
    const { debateId } = req.params;

    const debate = await Debate.findById(debateId);

    if (!debate) {
      return res.status(404).json({ message: "Debate not found" });
    }

    const rewards = {
      winner: debate.winner,
      stakeAmount: debate.stakeAmount,
      resultOnChain: debate.resultOnChain,
    };

    res.status(200).json({ message: "Rewards fetched successfully", rewards });
  } catch (error) {
    console.error("Error fetching rewards:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  distributeController,
  rewardsByDebateIdController,
};
