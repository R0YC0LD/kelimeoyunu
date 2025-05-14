
import React from 'react';
import { motion } from 'framer-motion';
import UserListPanel from '@/components/chat/UserListPanel';
import ChatArea from '@/components/chat/ChatArea';
import ChatPlaceholder from '@/components/chat/ChatPlaceholder';

const ChatLayout = ({
  users,
  searchTerm,
  setSearchTerm,
  selectedUser,
  handleUserSelect,
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
  currentUser,
}) => {
  return (
    <div className="flex h-[calc(100vh-12rem)] rounded-xl shadow-2xl overflow-hidden border border-slate-700 bg-slate-800/50">
      <UserListPanel
        users={users}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedUser={selectedUser}
        handleUserSelect={handleUserSelect}
        getInitials={getInitials}
      />
      <div className="w-2/3 flex flex-col bg-slate-900/80">
        {selectedUser ? (
          <ChatArea
            selectedUser={selectedUser}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            handleDeleteMessage={handleDeleteMessage}
            handleEditMessage={handleEditMessage}
            editingMessage={editingMessage}
            setEditingMessage={setEditingMessage}
            editedContent={editedContent}
            setEditedContent={setEditedContent}
            handleSaveEdit={handleSaveEdit}
            messagesEndRef={messagesEndRef}
            getInitials={getInitials}
            currentUser={currentUser}
          />
        ) : (
          <ChatPlaceholder />
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
  