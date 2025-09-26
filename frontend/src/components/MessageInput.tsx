import React, { useState } from "react";
import { createMessage } from "../services/api";
import { socket } from "../socket";

// MessageInput.tsx
type Props = {
  setMessages: React.Dispatch<React.SetStateAction<any[]>>
  selectedModel: string;
};

const MessageInput = ({ /*setMessages*/selectedModel }: Props) => {
  const [text, setText] = useState("");

  const handleSend = async () => {
        if (!text.trim()) return;

        // Check if the message is an AI command
        if (text.startsWith('/ai ')) {
            const prompt = text.substring(4); // Get the text after "/ai "
            // Emit a special event with the prompt AND the selected model
            socket.emit("getAiResponse", { prompt, model: selectedModel });
        } else {
            // Otherwise, send a normal message
            await createMessage(text);
        }
        setText("");
  };

  return (
    <div className="message-input">
      <input 
        value={text} 
        onChange={e => setText(e.target.value)} 
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default MessageInput;
