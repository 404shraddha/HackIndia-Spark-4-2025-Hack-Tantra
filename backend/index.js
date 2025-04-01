const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const debateRoutes = require("./routes/debateRoutes");
const judgementRoutes = require("./routes/judgementRoutes");
const rewardsRoutes = require("./routes/rewardsRoute");

// Load environment variables
dotenv.config();

const app = express();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Server connected to MongoDB...");
  } catch (error) {
    console.error("❌ Server failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit process on DB failure
  }
};

// Enable CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Allow multiple origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.get("/", (req, res) => {
  console.log("✅ API is running...");
  res.send("🚀 API is running successfully!");
});
app.use("/user", userRoutes);
app.use("/debate", debateRoutes);
app.use("/judgement", judgementRoutes);
app.use("/rewards", rewardsRoutes);

// Start server
const PORT = process.env.PORT || 5100;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}...`));
