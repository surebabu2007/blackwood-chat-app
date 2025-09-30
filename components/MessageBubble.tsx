'use client';

import React from 'react';
import { Message } from '@/lib/types';
import { motion } from 'framer-motion';
import { User, Bot, AlertCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  characterName?: string;
  characterAvatar?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  characterName,
  characterAvatar
}) => {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';

  const formatTime = (date: Date | string | number) => {
    try {
      // Ensure we have a valid Date object
      const dateObj = date instanceof Date ? date : new Date(date);
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Just now';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(dateObj);
    } catch (error) {
      console.warn('Error formatting date:', error);
      return 'Just now';
    }
  };

  const getMessageIcon = () => {
    if (isUser) return <User className="w-3 h-3 sm:w-4 sm:h-4" />;
    if (isSystem) return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
    return <Bot className="w-3 h-3 sm:w-4 sm:h-4" />;
  };

  const getMessageColor = () => {
    if (isUser) return 'bg-amber-600/80 text-amber-100 border border-amber-500/30 backdrop-blur-sm';
    if (isSystem) return 'bg-amber-800/80 text-amber-100 border border-amber-600/30 backdrop-blur-sm';
    return 'bg-black/70 text-amber-100 border border-amber-600/30 backdrop-blur-sm';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex max-w-[85%] sm:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
        {/* Avatar */}
        {(isUser || (!isUser && !isSystem)) && (
          <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden">
            <img 
              src={isUser ? '/images/characters/detective.png' : (characterAvatar || '/images/characters/default.png')} 
              alt={isUser ? 'Detective' : (characterName || 'Character')}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const nextSibling = e.currentTarget.nextElementSibling as HTMLElement; if (nextSibling) nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-full h-full bg-gray-600 flex items-center justify-center text-xs" style={{display: 'none'}}>
              {isUser ? '🕵️' : (characterAvatar?.includes('/images/') ? '👤' : characterAvatar || '👤')}
            </div>
          </div>
        )}
        
        {/* Message content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Character name */}
          {(isUser || (!isUser && !isSystem && characterName)) && (
            <span className="text-xs text-amber-300 mb-1 px-2 truncate max-w-[200px] sm:max-w-none">
              {isUser ? 'Detective Sarah Chen' : characterName}
            </span>
          )}
          
          {/* Message bubble */}
          <div
            className={`
              relative px-3 py-2 sm:px-4 rounded-xl sm:rounded-2xl shadow-lg
              ${getMessageColor()}
              ${isUser ? 'rounded-br-md' : 'rounded-bl-md'}
            `}
          >
            {/* Message content */}
            <div className="flex items-start space-x-2">
              {isSystem && (
                <div className="flex-shrink-0 mt-0.5">
                  {getMessageIcon()}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
            </div>
            
            {/* Emotional tone indicator */}
            {message.emotionalTone && !isUser && (
              <div className="mt-1 text-xs opacity-75">
                <span className="italic">({message.emotionalTone})</span>
              </div>
            )}
          </div>
          
          {/* Timestamp */}
          <span className="text-xs text-amber-400/70 mt-1 px-2">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
