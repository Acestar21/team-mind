import mongoose from "mongoose";
import User from "./user.js";

const messageSchema = new mongoose.Schema({
    text : String,
    sender : String,
    createdAt : {type: Date, default: Date.now},
    user : {type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true},
});

export default mongoose.model("Message", messageSchema);