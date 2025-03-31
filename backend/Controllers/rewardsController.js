const Debate = require("../models/debateModel"); // Debate model import kiya

//  POST: Winner ko rewards distribute karne ka controller
const distributeController = async (req, res) => {
  try {
    const { debateId, winner, rewardAmount } = req.body;

    // Debate find karo
    const debate = await Debate.findById(debateId);

    if (!debate) {
      return res.status(404).json({ message: "Debate not found" });
    }

    // Winner validate karo
    if (
      winner !== debate.participant1.toString() &&
      winner !== debate.participant2.toString()
    ) {
      return res.status(400).json({ message: "Invalid winner ID" });
    }

    // Rewards ko distribute karo
    debate.winner = winner;
    debate.resultOnChain = true; // Chain par result update kar diya
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

//  GET: Specific debate ke rewards dekhne ka controller
const rewardsByDebateIdController = async (req, res) => {
  try {
    const { debateId } = req.params;

    const debate = await Debate.findById(debateId);

    if (!debate) {
      return res.status(404).json({ message: "Debate not found" });
    }

    // Rewards fetch karo
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
