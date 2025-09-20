// import React from "react";

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
};

const MessageItem = ({ message }: MessageItemProps) => {
  return (
    <div className="message-item">
      <strong>{message.user?.username || "Unknown User"}:</strong> {message.text}
    </div>
  );
};

export default MessageItem;
