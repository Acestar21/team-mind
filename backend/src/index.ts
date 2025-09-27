import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import messagesRoutes from "./routes/messages.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import connectDB from "./config/db.js";
import axios from "axios";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

const app = express();
const server = http.createServer(app)
const PORT = 5000;
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

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

async function getOllamaResponse(prompt: string, modelName: string) {
  try {
    const response = await axios.post('http://localhost:11434/api/chat', {
      model: modelName,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    });
    return response.data.message.content;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error calling Ollama with model ${modelName}:`, error.message);
    } else {
      console.error(`Error calling Ollama with model ${modelName}:`, error);
    }
    return `Sorry, I couldn't get a response from the local AI model (${modelName}). Make sure Ollama is running.`;
  }
}
async function getGeminiResponse(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    console.log("Gemini API prompt:", prompt);
    console.log("Gemini API result:", result);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I couldn't get a response from the Gemini API.";
  }
}
io.on("connection", (socket) => {
  console.log("⚡ New user connected:", socket.id);

 socket.on("getAiResponse", async ({ prompt, model, tempId }) => {

    let aiResponseText;
    if (model === 'gemini') {
      aiResponseText = await getGeminiResponse(prompt);
    } else {
      aiResponseText = await getOllamaResponse(prompt, model);
    }
    if (aiResponseText) {
      const aiMessage = {
        _id: new mongoose.Types.ObjectId(),
        text: aiResponseText,
        user: {
                _id: `ai-bot-${model}`, 
                username: `AI Bot (${model})`
              },
        createdAt: new Date(),
        tempId: tempId, 
      };
      io.emit("newMessage", aiMessage);
    }
});
   socket.on("getAiResponse", async ({ prompt, model, tempId }) => {
    console.log(`🤖 Received AI prompt for model: ${model} | Prompt: "${prompt}"`);
    
    let aiResponseText;

    if (model === 'gemini') {
      aiResponseText = await getGeminiResponse(prompt);
    } else {
      aiResponseText = await getOllamaResponse(prompt, model);
    }
    
    if (aiResponseText) {
      const aiMessage = {
        _id: new mongoose.Types.ObjectId(),
        text: aiResponseText,
        user: { 
          _id: `ai-bot-${model}`, 
          username: `AI Bot (${model})` 
        },
        createdAt: new Date(),
        tempId: tempId, 
      };
      
      io.emit("newMessage", aiMessage);
    }
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