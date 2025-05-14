
import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';
import ScrollAreaUI from '@/components/chat/ScrollAreaUI';

const UserListPanel = ({ users, searchTerm, setSearchTerm, selectedUser, handleUserSelect, getInitials }) => {
  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="w-1/3 border-r border-slate-700 bg-slate-800/70 flex flex-col"
    >
      <div className="p-4 border-b border-slate-700">
        <div className="relative">
          <Input
            type="text"
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-400 pl-10 focus:ring-primary"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <ScrollAreaUI className="flex-grow border-0 rounded-none">
        {users.length > 0 ? (
          users.map((u) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleUserSelect(u)}
              className={`flex items-center p-3 hover:bg-primary/20 cursor-pointer rounded-lg m-1 transition-colors duration-150 ${selectedUser?.id === u.id ? 'bg-primary/30' : ''}`}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={u.profilePicture || undefined} alt={u.username} />
                <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(u.username)}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-gray-200">{u.username}</span>
            </motion.div>
          ))
        ) : (
          <p className="p-4 text-center text-gray-400">Kullanıcı bulunamadı.</p>
        )}
      </ScrollAreaUI>
    </motion.div>
  );
};

export default UserListPanel;
  