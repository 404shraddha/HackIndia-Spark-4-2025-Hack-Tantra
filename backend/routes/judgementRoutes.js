const express = require("express");
const {
  analyzeController,
  judgementidController,
} = require("../Controllers/judgementController");

const Router = express.Router();
Router.post("/analyze", analyzeController);
Router.get("/:id", judgementidController);
module.exports = Router;
