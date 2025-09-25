// import React from "react";
import '../index.css';
interface User {
  id: string;
  username: string;
  email: string;
}
type MessageItemProps = {
  message: {
    _id: string;
    text: string;
    user: {
      _id: string;
      username: string;
      email: string;
    };
    createdAt: string;
  };
  current_user: User | null;
};

const MessageItem = ({ message , current_user}: MessageItemProps) => {
  const isCurrentUser = current_user?.id === message.user?._id;
  const messageContainerClass = isCurrentUser
    ? "message-container current-user"
    
    : "message-container";

  const messageBubbleClass = isCurrentUser
    ? "message-bubble current-user"
    : "message-bubble";

  return (
    <div className={messageContainerClass}>
      <div className={messageBubbleClass}>
        <strong>{message.user?.username || "Unknown User"}</strong>
        <p style={{ margin: 0 }}>{message.text}</p>
      </div>
    </div>
  );
};

export default MessageItem;
