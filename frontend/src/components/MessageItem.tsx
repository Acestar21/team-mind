// import React from "react";
import '../index.css';
import { useState } from "react";
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
  onDelete: (messageId: string) => Promise<void>;
  onUpdate: (messageId: string, newText: string) => Promise<void>;
};

const MessageItem = ({ message , current_user , onDelete, onUpdate}: MessageItemProps) => {
    // State to track if this specific message is being edited
  const [isEditing, setIsEditing] = useState(false);
  // State to hold the new text while editing
  const [editText, setEditText] = useState(message.text);
  const isCurrentUser = current_user?.id === message.user?._id;
  const handleSave = () => {
    // Call the update function passed down from ChatWindow
    onUpdate(message._id, editText);
    // Exit editing mode
    setIsEditing(false);
  };
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
                {isEditing ? (
          // If in editing mode, show an input field and a "Save" button
          <div>
            <input 
              type="text" 
              value={editText} 
              onChange={(e) => setEditText(e.target.value)} 
              className="edit-input"
            />
            <button onClick={handleSave} className="save-button">Save</button>
          </div>
        ) : (
          // Otherwise, just show the message text
          <p style={{ margin: 0 }}>{message.text}</p>
        )}
       </div>

      {/* Only show the action buttons if it's the current user's message AND we are not in editing mode */}
      {isCurrentUser && !isEditing && (
        <div className="message-actions">
          <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
          <button onClick={() => onDelete(message._id)} className="delete-button">Delete</button>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
