
import React from 'react';
import { motion } from 'framer-motion';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import ScrollAreaUI from '@/components/chat/ScrollAreaUI';

const ChatArea = ({
  selectedUser,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleDeleteMessage,
  handleEditMessage,
  editingMessage,
  setEditingMessage,
  editedContent,
  setEditedContent,
  handleSaveEdit,
  messagesEndRef,
  getInitials,
  currentUser
}) => {
  return (
    <>
      <ChatHeader selectedUser={selectedUser} getInitials={getInitials} />
      <ScrollAreaUI className="flex-grow p-4 space-y-4 bg-transparent border-0 rounded-none">
        <MessageList
          messages={messages}
          currentUser={currentUser}
          handleDeleteMessage={handleDeleteMessage}
          handleEditMessage={handleEditMessage}
          editingMessage={editingMessage}
          setEditingMessage={setEditingMessage}
          editedContent={editedContent}
          setEditedContent={setEditedContent}
          handleSaveEdit={handleSaveEdit}
        />
        <div ref={messagesEndRef} />
      </ScrollAreaUI>
      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
      />
    </>
  );
};

export default ChatArea;
  