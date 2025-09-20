import message from "../models/message.js";
import {type Request , type Response} from "express";
import { io } from "../index.js"

export const createMessages = async (req: Request, res: Response) => {
    try {
        const { text, sender } = req.body;
        const userId = (req as any).userId;

        let newMessage = new message({ text, sender, user: userId });
        await newMessage.save();
        newMessage = await newMessage.populate("user", "username email");
        io.emit("newMessage", newMessage);

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({error: "Failed to create message"});
        console.log(error);
    }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
        const messages = await message.find().populate("user","username email").sort({createdAt: -1});    
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({error: "Failed to fetch messages"});
        console.log(error);
    }
};

export const deleteMessages = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;
        
        const deleteMessages = await message.findById(id);
        if (!deleteMessages) {
            return res.status(404).json({ error: "Message not found" });
        }
        if (deleteMessages.user.toString() !== userId) {
            return res.status(403).json({ error: "Not authorized to delete this message" });
        }
        await deleteMessages.deleteOne();
        io.emit("deleteMessage", id);
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete message" });
        console.log(error);
    }
};

export const updateMessage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const userId = (req as any).userId; // from JWT middleware

        const msg = await message.findById(id);
        if (!msg) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Ownership check
        if (msg.user.toString() !== userId) {
            return res.status(403).json({ error: "Not authorized to update this message" });
        }

        msg.text = text;
        await msg.save();
        io.emit("updateMessage", msg);

        res.status(200).json(msg);
    } catch (error) {
        res.status(500).json({ error: "Failed to update message" });
        console.log(error);
    }
};
