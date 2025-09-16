import user from "../models/user.js";
import {type Request , type Response} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req : Request, res : Response) => {
    try {
        const {username,email,password} = req.body;
        const existingUser = await user.findOne({email});
        if (existingUser) {
            return res.status(400).json({error: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({username,email,password: hashedPassword});
        await newUser.save();
        res.status(201).json({message: "User registered successfully"});
    } catch (error) {
        res.status(500).json({error: "Failed to register user"});
        console.log(error); 
    }
};

export const login = async (req : Request, res : Response) => {
    try {
        const {email,password} = req.body;
        const existingUser = await user.findOne({email});
        if (!existingUser) {
            return res.status(400).json({error: "Invalid credentials"});
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({error: "Invalid credentials"});
        }
        const token = jwt.sign({id: existingUser._id}, process.env.JWT_SECRET as string, {expiresIn: "1h"});
        res.status(200).json({token, user: {id: existingUser._id, username: existingUser.username, email: existingUser.email}});
    } catch (error) {
        res.status(500).json({error: "Failed to login"});
        console.log(error); 
    }
};