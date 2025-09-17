import message from "../models/message.js";
import {type Request , type Response} from "express";

export const createMessages = async (req: Request, res: Response) => {
    try {
        const {text , sender ,user} = req.body;
        const newMessage = new message({text,sender,user});
        await newMessage.save();
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
        const deleteMessages = await message.findByIdAndDelete(id);
        if (!deleteMessages) {
            return res.status(404).json({ error: "Message not found" });
        }
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

        const updatedMessage = await message.findByIdAndUpdate(
            id,
            { text },
            { new: true } // returns updated doc
        );

        if (!updatedMessage) {
            return res.status(404).json({ error: "Message not found" });
        }

        res.status(200).json(updatedMessage);
    } catch (error) {
        res.status(500).json({ error: "Failed to update message" });
        console.log(error);
    }
};
