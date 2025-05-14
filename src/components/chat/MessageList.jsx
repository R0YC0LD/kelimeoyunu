
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import MessageItem from '@/components/chat/MessageItem';

const MessageList = ({ 
  messages, 
  currentUser, 
  handleDeleteMessage, 
  handleEditMessage,
  editingMessage,
  setEditingMessage,
  editedContent,
  setEditedContent,
  handleSaveEdit
}) => {
  return (
    <AnimatePresence initial={false}>
      {messages.map((msg) => {
        if (msg.deletedBySender && msg.deletedByReceiver && msg.content === "Bu mesaj silindi.") {
          return null; 
        }
        return (
          <MessageItem
            key={msg.id}
            message={msg}
            isSender={msg.senderId === currentUser.id}
            onDelete={() => handleDeleteMessage(msg.id)}
            onEdit={() => handleEditMessage(msg)}
            isEditing={editingMessage?.id === msg.id}
            editedContent={editedContent}
            onEditedContentChange={setEditedContent}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={() => setEditingMessage(null)}
          />
        );
      })}
    </AnimatePresence>
  );
};

export default MessageList;
  