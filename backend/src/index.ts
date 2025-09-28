import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import messagesRoutes from "./routes/messages.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import connectDB from "./config/db.js";
import message from "./models/message.js";
import axios from "axios";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = 5000;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Initialize Gemini
const googleApiKey = process.env.GOOGLE_API_KEY;
if (!googleApiKey) {
  throw new Error("GOOGLE_API_KEY environment variable is not set.");
}
const genAI = new GoogleGenerativeAI(googleApiKey);

app.use(cors());
app.use(express.json());
app.use("/api/messages", messagesRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World! This is your backend server.");
});

// Ollama AI response
async function getOllamaResponse(prompt: string, modelName: string) {
  try {
    const response = await axios.post("http://localhost:11434/api/chat", {
      model: modelName,
      messages: [{ role: "user", content: prompt }],
      stream: false,
    });
    return response.data.message.content;
  } catch (error) {
    console.error(`Error calling Ollama with model ${modelName}:`, error);
    return `Sorry, I couldn't get a response from Ollama (${modelName}).`;
  }
}

// Gemini AI response
async function getGeminiResponse(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I couldn't get a response from Gemini API.";
  }
}

// Socket.io handlers
io.on("connection", (socket) => {
  console.log("⚡ New user connected:", socket.id);

  // AI response
  socket.on("getAiResponse", async ({ prompt, model, tempId }) => {
    console.log(`🤖 Received AI prompt for model: ${model} | Prompt: "${prompt}"`);
    
    let aiResponseText;
    if (model === "gemini") {
      aiResponseText = await getGeminiResponse(prompt);
    } else {
      aiResponseText = await getOllamaResponse(prompt, model);
    }

    if (aiResponseText) {
      const aiMessage = {
        _id: `ai-${Date.now()}`,
        text: aiResponseText,
        user: { _id: `ai-bot-${model}`, username: `AI Bot (${model})` },
        createdAt: new Date(),
        tempId,
      };
      io.emit("newMessage", aiMessage);
    }
  });

  // Create new message
  socket.on("createMessage", async (msg) => {
    try {
      if (!msg.userId) return; // prevent undefined user

      const newMessage = new message({
        text: msg.text,
        user: msg.userId,
      });

      await newMessage.save();
      const populatedMessage = await newMessage.populate("user", "username email");

      io.emit("newMessage", { ...populatedMessage.toObject(), _id: populatedMessage._id.toString() });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Delete message
  socket.on("deleteMessage", async (msgId) => {
    try {
      const msg = await message.findById(msgId);
      if (!msg) return;
      await msg.deleteOne();
      io.emit("messageDeleted", { _id: msgId });
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  });

  // Update message
  socket.on("updateMessage", async (updatedMsg) => {
    try {
      const msg = await message.findById(updatedMsg._id);
      if (!msg) return;

      msg.text = updatedMsg.text;
      await msg.save();

      const populatedMessage = await msg.populate("user", "username email");
      io.emit("messageUpdated", { ...populatedMessage.toObject(), _id: populatedMessage._id.toString() });
    } catch (error) {
      console.error("Error updating message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Connect to MongoDB and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

export { io };
