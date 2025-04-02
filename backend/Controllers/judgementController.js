const express = require("express");
const axios = require("axios");
const Debate = require("../models/debateModel");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const analyzeController = async (req, res) => {
  try {
    const { debateId, arguments: debateArguments } = req.body;

    if (!debateId || !debateArguments || !Array.isArray(debateArguments)) {
      return res.status(400).json({
        message: "Invalid input data. Please provide debateId and arguments.",
      });
    }

    const debate = await Debate.findById(debateId);
    if (!debate) {
      return res.status(404).json({ message: "Debate not found" });
    }

    const prompt = `You are an AI judge. Analyze the following debate and decide the winner. Consider the logical strength, clarity, and persuasiveness of the arguments.\n\nDebate Arguments:\n${debateArguments
      .map((arg, index) => `Argument ${index + 1}: ${arg}`)
      .join("\n")}\n\nProvide a detailed judgment and declare the winner.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`,
      {
        prompt: { text: prompt },
      }
    );

    const aiDecision =
      response.data.candidates?.[0]?.output || "No decision generated.";

    debate.aiDecision = aiDecision;
    await debate.save();

    res
      .status(200)
      .json({ message: "Debate analyzed successfully", aiDecision });
  } catch (error) {
    console.error("Error analyzing debate:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { analyzeController };

const judgementidController = async (req, res) => {
  try {
    const { id } = req.params;

    const debate = await Debate.findById(id);

    if (!debate) {
      return res.status(404).json({ message: "Judgement not found" });
    }

    res.status(200).json({ aiDecision: debate.aiDecision });
  } catch (error) {
    console.error("Error fetching judgement:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  analyzeController,
  judgementidController,
};
