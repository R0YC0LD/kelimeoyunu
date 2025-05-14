
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Paperclip, Send, Smile, Search, Trash2, Edit3, Check, X, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; 
import { cn } from '@/lib/utils';


const ScrollAreaPrimitiveRoot = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
      {children}
    </div>
  )
);
ScrollAreaPrimitiveRoot.displayName = "ScrollAreaPrimitiveRoot";


const ScrollAreaPrimitiveViewport = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("h-full w-full rounded-[inherit]", className)}
      {...props}
    >
      {children}
    </div>
  )
);
ScrollAreaPrimitiveViewport.displayName = "ScrollAreaPrimitiveViewport";


const ScrollBarPrimitiveThumb = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative flex-1 rounded-full bg-border", className)}
      {...props}
    />
  )
);
ScrollBarPrimitiveThumb.displayName = "ScrollBarPrimitiveThumb";


const ScrollBarPrimitive = React.forwardRef(
  ({ className, orientation = "vertical", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        className
      )}
      {...props}
    >
      <ScrollBarPrimitiveThumb />
    </div>
  )
);
ScrollBarPrimitive.displayName = "ScrollBarPrimitive";


const ScrollAreaUI = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <ScrollAreaPrimitiveRoot
      ref={ref}
      className={cn("rounded-md border border-slate-700", className)}
      {...props}
    >
      <ScrollAreaPrimitiveViewport>
        <div className="p-4">{children}</div>
      </ScrollAreaPrimitiveViewport>
      <ScrollBarPrimitive />
    </ScrollAreaPrimitiveRoot>
  )
);
ScrollAreaUI.displayName = "ScrollArea";


const AlertDialogUI = AlertDialog;
const AlertDialogTriggerUI = AlertDialogTrigger;
const AlertDialogContentUI = AlertDialogContent;
const AlertDialogHeaderUI = AlertDialogHeader;
const AlertDialogFooterUI = AlertDialogFooter;
const AlertDialogTitleUI = AlertDialogTitle;
const AlertDialogDescriptionUI = AlertDialogDescription;
const AlertDialogActionUI = AlertDialogAction;
const AlertDialogCancelUI = AlertDialogCancel;


const ChatPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const allUsers = storage.getItem('users') || [];
    if (user) {
      setUsers(allUsers.filter(u => u.id !== user.id));
    }
  }, [user]);

  useEffect(() => {
    if (selectedUser && user) {
      const chatKey = getChatKey(user.id, selectedUser.id);
      const storedMessages = storage.getItem(`chat_${chatKey}`) || [];
      setMessages(storedMessages);
    } else {
      setMessages([]);
    }
  }, [selectedUser, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getChatKey = (userId1, userId2) => {
    return [userId1, userId2].sort().join('_');
  };

  const handleUserSelect = (selected) => {
    setSelectedUser(selected);
    setSearchTerm(''); 
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user || !selectedUser) return;

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      senderId: user.id,
      receiverId: selectedUser.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      deletedBySender: false,
      deletedByReceiver: false,
    };

    const chatKey = getChatKey(user.id, selectedUser.id);
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    storage.setItem(`chat_${chatKey}`, updatedMessages);
    setNewMessage('');
  };

  const handleDeleteMessage = (messageId) => {
    if (!user || !selectedUser) return;
    const chatKey = getChatKey(user.id, selectedUser.id);
    const currentMessages = storage.getItem(`chat_${chatKey}`) || [];
    
    const updatedMessages = currentMessages.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, deletedBySender: true, deletedByReceiver: true, content: "Bu mesaj silindi." };
      }
      return msg;
    });

    setMessages(updatedMessages.filter(msg => !(msg.deletedBySender && msg.deletedByReceiver && msg.id === messageId && msg.content === "Bu mesaj silindi."))); 
    storage.setItem(`chat_${chatKey}`, updatedMessages);
    toast({ title: "Mesaj Silindi", description: "Mesaj başarıyla her iki taraftan silindi." });
  };
  
  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setEditedContent(message.content);
  };

  const handleSaveEdit = () => {
    if (!editingMessage || !editedContent.trim() || !user || !selectedUser) return;
    
    const chatKey = getChatKey(user.id, selectedUser.id);
    const currentMessages = storage.getItem(`chat_${chatKey}`) || [];

    const updatedMessages = currentMessages.map(msg => {
      if (msg.id === editingMessage.id) {
        return { ...msg, content: editedContent, edited: true, timestamp: new Date().toISOString() };
      }
      return msg;
    });

    setMessages(updatedMessages);
    storage.setItem(`chat_${chatKey}`, updatedMessages);
    setEditingMessage(null);
    setEditedContent('');
    toast({ title: "Mesaj Düzenlendi", description: "Mesaj başarıyla güncellendi." });
  };


  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-gray-400">Sohbet etmek için lütfen giriş yapın.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] rounded-xl shadow-2xl overflow-hidden border border-slate-700 bg-slate-800/50">
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
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
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

      <div className="w-2/3 flex flex-col bg-slate-900/80">
        {selectedUser ? (
          <>
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

            <ScrollAreaUI className="flex-grow p-4 space-y-4 bg-transparent border-0 rounded-none">
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  if (msg.deletedBySender && msg.deletedByReceiver && msg.content === "Bu mesaj silindi.") {
                    return null; 
                  }
                  const isSender = msg.senderId === user.id;
                  return (
                    <motion.div
                      key={msg.id}
                      layout
                      initial={{ opacity: 0, y: isSender ? 10 : -10, x: isSender ? 20 : -20 }}
                      animate={{ opacity: 1, y: 0, x: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} group`}
                    >
                      <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow ${
                        isSender 
                          ? 'bg-gradient-to-br from-primary to-pink-600 text-white rounded-br-none' 
                          : 'bg-slate-700 text-gray-200 rounded-bl-none'
                      }`}>
                        {editingMessage?.id === msg.id ? (
                          <div className="flex items-center space-x-2">
                            <Input 
                              value={editedContent} 
                              onChange={(e) => setEditedContent(e.target.value)}
                              className="bg-slate-600 text-white text-sm p-1 border-slate-500"
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                            />
                            <Button variant="ghost" size="icon" onClick={handleSaveEdit} className="text-green-400 hover:text-green-300 h-7 w-7">
                              <Check size={18} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setEditingMessage(null)} className="text-red-400 hover:text-red-300 h-7 w-7">
                              <X size={18} />
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm break-words">{msg.content}</p>
                        )}
                        <p className={`text-xs mt-1 ${isSender ? 'text-purple-200' : 'text-gray-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {msg.edited && <span className="ml-1 text-xs italic">(düzenlendi)</span>}
                        </p>
                      </div>
                      {isSender && !editingMessage && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 mt-1">
                           <AlertDialogUI>
                            <AlertDialogTriggerUI asChild>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400 h-6 w-6">
                                <Trash2 size={14} />
                              </Button>
                            </AlertDialogTriggerUI>
                            <AlertDialogContentUI className="bg-slate-800 border-slate-700 text-gray-200">
                              <AlertDialogHeaderUI>
                                <AlertDialogTitleUI>Mesajı Silmek İstediğinize Emin Misiniz?</AlertDialogTitleUI>
                                <AlertDialogDescriptionUI>
                                  Bu işlem geri alınamaz. Mesaj hem sizden hem de alıcıdan silinecektir.
                                </AlertDialogDescriptionUI>
                              </AlertDialogHeaderUI>
                              <AlertDialogFooterUI>
                                <AlertDialogCancelUI className="hover:bg-slate-700">İptal</AlertDialogCancelUI>
                                <AlertDialogActionUI onClick={() => handleDeleteMessage(msg.id)} className="bg-red-600 hover:bg-red-700 text-white">
                                  Sil
                                </AlertDialogActionUI>
                              </AlertDialogFooterUI>
                            </AlertDialogContentUI>
                          </AlertDialogUI>
                          <Button variant="ghost" size="icon" onClick={() => handleEditMessage(msg)} className="text-blue-400 hover:text-blue-300 h-6 w-6">
                            <Edit3 size={14} />
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </ScrollAreaUI>

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
          </>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ChatPage;
  