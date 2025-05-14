
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit3, Check, X } from 'lucide-react';
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

const MessageItem = ({ 
  message, 
  isSender, 
  onDelete, 
  onEdit,
  isEditing,
  editedContent,
  onEditedContentChange,
  onSaveEdit,
  onCancelEdit
 }) => {
  return (
    <motion.div
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
        }`}
      >
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <Input
              value={editedContent}
              onChange={(e) => onEditedContentChange(e.target.value)}
              className="bg-slate-600 text-white text-sm p-1 border-slate-500"
              onKeyDown={(e) => e.key === 'Enter' && onSaveEdit()}
            />
            <Button variant="ghost" size="icon" onClick={onSaveEdit} className="text-green-400 hover:text-green-300 h-7 w-7">
              <Check size={18} />
            </Button>
            <Button variant="ghost" size="icon" onClick={onCancelEdit} className="text-red-400 hover:text-red-300 h-7 w-7">
              <X size={18} />
            </Button>
          </div>
        ) : (
          <p className="text-sm break-words">{message.content}</p>
        )}
        <p className={`text-xs mt-1 ${isSender ? 'text-purple-200' : 'text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {message.edited && <span className="ml-1 text-xs italic">(düzenlendi)</span>}
        </p>
      </div>
      {isSender && !isEditing && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 mt-1">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400 h-6 w-6">
                <Trash2 size={14} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-800 border-slate-700 text-gray-200">
              <AlertDialogHeader>
                <AlertDialogTitle>Mesajı Silmek İstediğinize Emin Misiniz?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu işlem geri alınamaz. Mesaj hem sizden hem de alıcıdan silinecektir.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="hover:bg-slate-700">İptal</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white">
                  Sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="ghost" size="icon" onClick={onEdit} className="text-blue-400 hover:text-blue-300 h-6 w-6">
            <Edit3 size={14} />
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default MessageItem;
  