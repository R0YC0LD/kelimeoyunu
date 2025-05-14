
import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ChatHeader = ({ selectedUser, getInitials }) => {
  return (
    <motion.div
      key={selectedUser.id} 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "circOut" }}
      className="flex items-center p-4 border-b border-slate-700 bg-slate-800/90 shadow-md"
    >
      <Avatar className="h-10 w-10 mr-3">
        <AvatarImage src={selectedUser.profilePicture || undefined} alt={selectedUser.username} />
        <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(selectedUser.username)}</AvatarFallback>
      </Avatar>
      <h2 className="text-xl font-semibold text-gray-100">{selectedUser.username}</h2>
    </motion.div>
  );
};

export default ChatHeader;
  