
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const ChatPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
      >
        <MessageSquare size={80} className="text-primary opacity-30 mb-6" />
        <h2 className="text-3xl font-semibold text-gray-300 mb-2">Sohbete Başlayın</h2>
        <p className="text-gray-400 max-w-md">
          Sol taraftaki listeden bir kullanıcı seçerek veya arama yaparak yeni bir sohbet başlatın.
        </p>
      </motion.div>
    </div>
  );
};

export default ChatPlaceholder;
  