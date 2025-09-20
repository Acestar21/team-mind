import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import messagesRoutes from "./routes/messages.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import connectDB from "./config/db.js";
dotenv.config();


const app = express();
const server = http.createServer(app)
const PORT = 5000;
const io = new Server(server, {
  cors: {
    origin: "*", // later: restrict to frontend URL
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use("/api/messages", messagesRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
    res.send("Hello World! This is your backend server.");
});
io.on("connection", (socket) => {
  console.log("⚡ New user connected:", socket.id);

  socket.on("hello", (msg) => {
    console.log("📩 Received from client:", msg);
    socket.emit("welcome", "Welcome client! 👋");
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

export { io };