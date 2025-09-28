
import '../index.css';
import { useState } from "react";
interface User {
  _id: string;
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

  const [isEditing, setIsEditing] = useState(false);

  const [editText, setEditText] = useState(message.text);
  const isCurrentUser = current_user?._id === message.user?._id;
  const handleSave = () => {

    onUpdate(message._id, editText);

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

          <p style={{ margin: 0 }}>{message.text}</p>
        )}
       </div>

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
