import { useEffect, useState } from 'react';
import { fetchMessages } from '../services/api';
import { socket } from "../socket";
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';

const ChatWindow = () => {
    const [messages , setMessages] = useState<any[]>([]);

    useEffect(() => {
    fetchMessages().then(res => {
        if (res && Array.isArray(res)) setMessages(res);
        else setMessages([]);
    });

    socket.on("newMessage", (msg) => {
        setMessages(prev => [msg, ...prev]);
    });

    return () => {
        socket.off("newMessage");
    };
}, []);

    return (
        <div className='chat-window'>
            <MessageInput setMessages={setMessages} />
            {messages.map(msg => <MessageItem key={msg._id} message={msg} />)}
        </div>
    );
};

export default ChatWindow;
