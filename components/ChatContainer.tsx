'use client';

import React, { useEffect, useRef } from 'react';
import { Message } from '@/lib/types';
import { MessageBubble } from './MessageBubble';
import { motion } from 'framer-motion';

interface ChatContainerProps {
  messages: Message[];
  characterName?: string;
  characterAvatar?: string;
  isTyping: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  characterName,
  characterAvatar,
  isTyping
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto mobile-scroll p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0">
      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-full text-center p-8"
        >
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
          <h3 className="text-lg sm:text-xl font-typewriter font-bold text-amber-100 mb-2 px-4 tracking-wide">
            WELCOME TO BLACKWOOD MANOR
          </h3>
        <p className="text-amber-200/80 max-w-md text-sm sm:text-base px-4 font-typewriter tracking-wide">
          Select a character to begin your investigation. Each character has their own secrets, 
          motivations, and knowledge about the case.
        </p>
        <div className="mt-3 px-4">
          <p className="text-xs text-amber-300/60 font-typewriter tracking-wide italic">
            Characters respond concisely (2-3 lines) to maintain the pace of investigation.
          </p>
        </div>
        </motion.div>
      ) : (
        <>
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              characterName={characterName}
              characterAvatar={characterAvatar}
            />
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-end space-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src={characterAvatar || '/images/characters/default.png'} 
                    alt={characterName || 'Character'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextSibling) nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center text-xs" style={{display: 'none'}}>
                    {characterAvatar?.includes('/images/') ? '👤' : characterAvatar || '👤'}
                  </div>
                </div>
                <div className="bg-gray-700 text-white px-4 py-2 rounded-2xl rounded-bl-md">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-300 font-typewriter tracking-wide">{characterName || 'Character'} is typing...</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
