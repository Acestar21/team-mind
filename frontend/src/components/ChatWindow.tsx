import { useEffect, useState, useRef } from "react";
import { fetchMessages, deleteMessage, updateMessage } from "../services/api";
import { socket } from "../socket";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";
import ModelSelector from "./ModelSelector";

interface User {
  id: string;
  username: string;
  email: string;
}

type ChatWindowProps = {
  user: User | null;
};

const ChatWindow = ({ user }: ChatWindowProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState("gemini");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages().then(res => {
      if (res && Array.isArray(res)) {
        const sorted = res.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setMessages(sorted);
      }
    });

    socket.on("newMessage", (msg) => {
      if (msg.tempId) {
        setMessages(prev =>
          prev.map(m => (m._id === msg.tempId ? msg : m))
        );
      } else {
        setMessages(prev => [...prev, msg]);
      }
    });

    // socket.on("messageDeleted", (data) => {
    //   setMessages(prev => prev.filter(m => m._id !== data._id));
    // });

    // socket.on("messageUpdated", (msg) => {
    //   setMessages(prev => prev.map(m => (m._id === msg._id ? msg : m)));
    // });

    return () => {
      socket.off("newMessage");
      // socket.off("messageDeleted");
      // socket.off("messageUpdated");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

   const handleDeleteMessage = async (messageId: string) => {
        // Call the API to delete from the database
        const success = await deleteMessage(messageId);
        if (success) {
        // If the API call works, remove the message from our local state
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
        }
    };

    const handleUpdateMessage = async (messageId: string, newText: string) => {
        // Call the API to update the message in the database
        const updatedMessage = await updateMessage(messageId, newText);
        if (updatedMessage) {
        // If the API call works, update the message in our local state
        setMessages(prev =>
            prev.map(msg => (msg._id === messageId ? updatedMessage : msg))
        );
        }
    };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", background: "#f0f0f0" }}>
      <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />

      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {messages.map(msg => (
          <MessageItem
            key={msg._id}
            message={msg}
            current_user={user}
            onDelete={handleDeleteMessage}
            onUpdate={handleUpdateMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: "1rem", display: "flex", background: "#ddd" }}>
        <MessageInput setMessages={setMessages} selectedModel={selectedModel} current_user={user} />
      </div>
    </div>
  );
};

export default ChatWindow;
