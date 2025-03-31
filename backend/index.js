const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const debateRoutes = require("./routes/debateRoutes");
const judgementRoutes = require("./routes/judgementRoutes");
const rewardsRoutes = require("./routes/rewardsRoute");
const app = express();
dotenv.config();

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("Sever connected to DB ...");
  } catch (error) {
    console.log("Server not connected to DB ...", error.message);
  }
};
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
connectDB();
app.get("/", (req, res) => {
  console.log("API is running 1...");
  res.send("API is running successfully!");
});
app.use("/user", userRoutes);
app.use("/debate", debateRoutes);
app.use("/judgement", judgementRoutes);
app.use("/rewards", rewardsRoutes);
const PORT = process.env.PORT || 5100;
app.listen(5100, console.log("Server is running ..."));
