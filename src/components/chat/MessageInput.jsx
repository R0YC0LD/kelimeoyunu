
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Send, Smile } from 'lucide-react';

const MessageInput = ({ newMessage, setNewMessage, handleSendMessage }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-4 border-t border-slate-700 bg-slate-800/90"
    >
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center space-x-3">
        <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
          <Smile size={22} />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
          <Paperclip size={22} />
        </Button>
        <Input
          type="text"
          placeholder="Mesajınızı yazın..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-400 focus:ring-primary"
        />
        <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 rounded-full w-10 h-10">
          <Send size={20} className="text-white" />
        </Button>
      </form>
    </motion.div>
  );
};

export default MessageInput;
  