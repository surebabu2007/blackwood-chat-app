'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  disabled?: boolean;
  placeholder?: string;
  characterName?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isTyping,
  disabled = false,
  placeholder = "Ask a question...",
  characterName
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isTyping && message.length <= 500) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky bottom-0 bg-black/90 backdrop-blur-md border-t border-amber-600/20 p-3 sm:p-4"
    >
      <form onSubmit={handleSubmit} className="flex items-end space-x-2 sm:space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 500) {
                setMessage(value);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isTyping}
            aria-label="Type your message"
            aria-describedby="message-help"
            className={`
              chat-input w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12               bg-black/60 border border-amber-600/30 rounded-xl sm:rounded-2xl
              text-amber-100 placeholder-amber-400/60 resize-none focus:outline-none focus:ring-2
              focus:ring-amber-500/50 focus:border-amber-500/40 transition-all duration-200
              max-h-32 min-h-[2.5rem] sm:min-h-[3rem] text-sm sm:text-base backdrop-blur-sm
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${isTyping ? 'opacity-75' : ''}
            `}
            rows={1}
            style={{ minHeight: '3rem' }}
          />
          
          {/* Character limit indicator */}
          {message.length > 0 && (
            <div className="absolute bottom-1 right-10 sm:right-14 text-xs text-amber-400/70">
              {message.length}/500
            </div>
          )}
        </div>
        
        <motion.button
          type="submit"
          disabled={!message.trim() || disabled || isTyping}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl transition-all duration-200
            ${message.trim() && !disabled && !isTyping
              ? 'bg-amber-600/80 hover:bg-amber-700/90 text-amber-100 border border-amber-500/40'
              : 'bg-black/70 text-amber-600/50 cursor-not-allowed border border-amber-700/20'
            }
          `}
        >
          {isTyping ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          ) : (
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </motion.button>
      </form>
      
      {/* Typing indicator */}
      {isTyping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2 mt-2 text-xs sm:text-sm text-amber-300/80"
        >
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="truncate">{characterName || 'Character'} is typing...</span>
        </motion.div>
      )}
    </motion.div>
  );
};
