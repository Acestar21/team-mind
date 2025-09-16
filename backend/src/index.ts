import express from "express";
import cors from "cors";
import messagesRoutes from "./routes/messages.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import connectDB from "./config/db.js";
dotenv.config();


const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
app.use("/api/messages", messagesRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
    res.send("Hello World! This is your backend server.");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});