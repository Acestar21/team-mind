import React, { useState } from "react";
import { socket } from "../socket";

interface User { 
  _id: string;
  username: string;
  email: string;
}

type Props = {
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  selectedModel: string;
  current_user: User | null;
};

const MessageInput = ({ setMessages, selectedModel, current_user }: Props) => {
  const [text, setText] = useState("");

  const handleSend = async () => {
    if (!text.trim()) return;

    if (text.startsWith('/ai ')) {
      const prompt = text.substring(4);
      const tempId = `temp-${Date.now()}`;
      const thinkingMessage = {
        _id: tempId,
        text: "AI is thinking...",
        user: { 
          _id: `ai-bot-${selectedModel}`, 
          username: `AI Bot (${selectedModel})` 
        },
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, thinkingMessage]);
      socket.emit("getAiResponse", { prompt, model: selectedModel, tempId });
    } else {
      // const newMessage = {
      //   _id: `temp-${Date.now()}`,
      //   text,
      //   user: {
      //     _id: current_user?.id,
      //     username: current_user?.username,
      //   },
      //   createdAt: new Date().toISOString(),
      // };
      const newMessage = { text, userId: current_user?._id };
      socket.emit("createMessage", newMessage);
    }
    setText("");
  };


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="message-input-container">
      <input 
        className="message-input"
        value={text} 
        onChange={e => setText(e.target.value)} 
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
      />
      <button className="send-button" onClick={handleSend}>Send</button>
    </div>
  );
};

export default MessageInput;