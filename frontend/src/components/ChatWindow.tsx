import { useEffect, useState , useRef } from 'react';
import { fetchMessages } from '../services/api';
import { socket } from "../socket";
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
interface User {
  id: string;
  username: string;
  email: string;
}

type ChatWindowProps = {
    user: User | null;
};


const ChatWindow = ({user}:ChatWindowProps) => {
    const [messages , setMessages] = useState<any[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null); 

   useEffect(() => {
       fetchMessages().then(res => {
           if (res && Array.isArray(res)){
            const sortedMessages = res.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            setMessages(sortedMessages);
           }
           else setMessages([]);
        });
        
        socket.on("newMessage", (msg) => {
            setMessages(prev => [...prev , msg]);
        });
        
        return () => {
            socket.off("newMessage");
        };
    }, []);
    useEffect(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    const handleDelete = (id: number) => {
    setMessages(prev => prev.filter(msg => msg._id !== id));
    };
    
    const handleUpdate = (id: number, newText: string) => {
    setMessages(prev =>
      prev.map(msg => (msg._id === id ? { ...msg, text: newText } : msg))
    );
    };
    
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', background: '#b2b4b9ff' }}>
            

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                {messages.map(msg => 
                    <MessageItem key={msg._id} 
                    message={msg}
                    current_user = {user} />)}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '1rem', background: '#6a6565ff',display: 'flex' }}>
            <MessageInput setMessages={setMessages} />
            </div>
        </div>
    );
};

export default ChatWindow;
