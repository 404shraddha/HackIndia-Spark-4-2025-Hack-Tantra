const Debate = require("../models/debateModel");

const createController = async (req, res) => {
  try {
    const { topic, participant1, participant2, stakeAmount } = req.body;

    const newDebate = new Debate({
      topic,
      participant1,
      participant2,
      stakeAmount,
      winner: null,
      aiDecision: "",
      resultOnChain: false,
    });

    await newDebate.save();
    res.status(201).json({ message: "Debate created successfully", newDebate });
  } catch (error) {
    console.error("Error creating debate:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const specificDebateController = async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);

    if (!debate) {
      return res.status(404).json({ message: "Debate not found" });
    }

    res.status(200).json(debate);
  } catch (error) {
    console.error("Error fetching debate:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const allDebatesController = async (req, res) => {
  try {
    const debates = await Debate.find();
    res.status(200).json(debates);
  } catch (error) {
    console.error("Error fetching debates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createController,
  specificDebateController,
  allDebatesController,
};
