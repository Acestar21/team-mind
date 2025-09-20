import React, { useState } from "react";
import { createMessage } from "../services/api";
// import { socket } from "../socket";

// MessageInput.tsx
type Props = {
  setMessages: React.Dispatch<React.SetStateAction<any[]>>
};

const MessageInput = ({ setMessages }: Props) => {
  const [text, setText] = useState("");

  const handleSend = async () => {
    const res = await createMessage(text);
    // if (res) setMessages(prev => [...prev, res]);
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
