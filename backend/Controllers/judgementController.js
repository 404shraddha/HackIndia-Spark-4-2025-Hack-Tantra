const Debate = require("../models/debateModel"); // Debate model import kiya

//  POST: AI se debate ka analysis karne ka controller
const analyzeController = async (req, res) => {
  try {
    const { debateId, aiDecision } = req.body;

    // Debate ko find karo
    const debate = await Debate.findById(debateId);

    if (!debate) {
      return res.status(404).json({ message: "Debate not found" });
    }

    // AI decision save karo
    debate.aiDecision = aiDecision;
    await debate.save();

    res.status(200).json({ message: "Debate analyzed successfully", debate });
  } catch (error) {
    console.error("Error analyzing debate:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  GET: Specific judgement dekhne ka controller
const judgementidController = async (req, res) => {
  try {
    const { id } = req.params;

    const debate = await Debate.findById(id);

    if (!debate) {
      return res.status(404).json({ message: "Judgement not found" });
    }

    res.status(200).json(debate);
  } catch (error) {
    console.error("Error fetching judgement:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  analyzeController,
  judgementidController,
};
