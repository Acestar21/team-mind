import { useEffect, useState, useRef } from 'react';
import { fetchMessages, deleteMessage, updateMessage } from '../services/api';
import { socket } from "../socket";
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import ModelSelector from './ModelSelector';

interface User { 
  _id: string;
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
                const sortedMessages = res.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                setMessages(sortedMessages);
            } else {
                setMessages([]);
            }
        });
        
        socket.on("newMessage", (newMessage) => {
            if (newMessage.tempId) {
                setMessages(prev => 
                    prev.map(msg => 
                        msg._id === newMessage.tempId ? newMessage : msg
                    )
                );
            } else {
                setMessages(prev => [...prev, newMessage]);
            }
        });


        socket.on("messageDeleted", (data) => {
            setMessages(prev => 
                prev.filter(msg => msg._id !== data._id)
            );
        });

        socket.on("messageUpdated", (updatedMessage) => {
            setMessages(prev => 
                prev.map(msg => msg._id === updatedMessage._id ? updatedMessage : msg)
            );
        });
        
 
        return () => {
            socket.off("newMessage");
            socket.off("messageDeleted");
            socket.off("messageUpdated");
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const handleDeleteMessage = async (messageId: string) => {
        await deleteMessage(messageId);
    };
    
    const handleUpdateMessage = async (messageId: string, newText: string) => {
        await updateMessage(messageId, newText);
    };
    
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', background: '#b2b4b9ff' }}>
            <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                {messages.map(msg => 
                    <MessageItem 
                        key={msg._id} 
                        message={msg}
                        current_user={user} 
                        onDelete={handleDeleteMessage}
                        onUpdate={handleUpdateMessage}
                    />
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <div style={{ padding: '1rem', background: '#6a6565ff', display: 'flex' }}>
                <MessageInput 
                    setMessages={setMessages} 
                    selectedModel={selectedModel} 
                    current_user={user}
                />
            </div>
        </div>
    );
};

export default ChatWindow;