'use client';

import React, { useState, useEffect } from 'react';
import { Character } from '@/lib/types';
import { Message } from '@/lib/types';
import { useChat } from '@/hooks/useChat';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Minimize2, 
  Maximize2, 
  Mic, 
  MicOff,
  Paperclip,
  Send,
  ChevronDown,
  User,
  Clock,
  Gavel
} from 'lucide-react';

interface VintageChatWidgetProps {
  character?: Character;
  isMinimized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'sepia' | 'aged' | 'classic';
  showHeader?: boolean;
  enableVoice?: boolean;
  enableFileUpload?: boolean;
  maxHeight?: string;
  width?: string;
  isInterrogationMode?: boolean;
}

export const VintageChatWidget: React.FC<VintageChatWidgetProps> = ({
  character,
  isMinimized = false,
  onMinimize,
  onMaximize,
  onClose,
  className = '',
  position = 'bottom-right',
  theme = 'sepia',
  showHeader = true,
  enableVoice = false,
  enableFileUpload = false,
  maxHeight = '500px',
  width = '400px',
  isInterrogationMode = false
}) => {
  const [isExpanded, setIsExpanded] = useState(!isMinimized);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  
  const {
    currentCharacter,
    messages,
    isTyping,
    isLoading,
    error,
    sendMessage,
    selectCharacter,
    clearError
  } = useChat();

  // Set initial character if provided
  useEffect(() => {
    if (character && character.id !== currentCharacter?.id) {
      selectCharacter(character);
    }
  }, [character, currentCharacter?.id, selectCharacter]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      onMinimize?.();
    } else {
      onMaximize?.();
    }
  };

  const getThemeClasses = () => {
    let baseClasses;
    
    switch (theme) {
      case 'sepia':
        baseClasses = {
          container: 'bg-amber-50 border-amber-300 shadow-amber-900/30',
          header: 'bg-gradient-to-r from-amber-100 to-amber-200 border-amber-400',
          input: 'bg-amber-100 border-amber-400 focus:border-amber-600 text-amber-900',
          message: 'bg-amber-200 border-amber-300 text-amber-900',
          messageUser: 'bg-gradient-to-r from-amber-700 to-amber-800 border-amber-800 text-white',
          button: 'bg-amber-700 hover:bg-amber-800 text-white shadow-lg',
          text: 'text-amber-900',
          accent: 'text-amber-800'
        };
        break;
      case 'aged':
        baseClasses = {
          container: 'bg-yellow-50 border-yellow-400 shadow-yellow-900/30',
          header: 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-500',
          input: 'bg-yellow-100 border-yellow-500 focus:border-yellow-700 text-yellow-900',
          message: 'bg-yellow-200 border-yellow-400 text-yellow-900',
          messageUser: 'bg-gradient-to-r from-yellow-800 to-yellow-900 border-yellow-900 text-white',
          button: 'bg-yellow-800 hover:bg-yellow-900 text-white shadow-lg',
          text: 'text-yellow-900',
          accent: 'text-yellow-800'
        };
        break;
      case 'classic':
        baseClasses = {
          container: 'bg-gray-100 border-gray-400 shadow-gray-900/30',
          header: 'bg-gradient-to-r from-gray-200 to-gray-300 border-gray-500',
          input: 'bg-gray-200 border-gray-500 focus:border-gray-700 text-gray-900',
          message: 'bg-gray-300 border-gray-400 text-gray-900',
          messageUser: 'bg-gradient-to-r from-gray-700 to-gray-800 border-gray-800 text-white',
          button: 'bg-gray-800 hover:bg-gray-900 text-white shadow-lg',
          text: 'text-gray-900',
          accent: 'text-gray-800'
        };
        break;
      default:
        baseClasses = {
          container: 'bg-amber-50 border-amber-300 shadow-amber-900/30',
          header: 'bg-gradient-to-r from-amber-100 to-amber-200 border-amber-400',
          input: 'bg-amber-100 border-amber-400 focus:border-amber-600 text-amber-900',
          message: 'bg-amber-200 border-amber-300 text-amber-900',
          messageUser: 'bg-gradient-to-r from-amber-700 to-amber-800 border-amber-800 text-white',
          button: 'bg-amber-700 hover:bg-amber-800 text-white shadow-lg',
          text: 'text-amber-900',
          accent: 'text-amber-800'
        };
    }

    // Apply Interrogation Mode overrides
    if (isInterrogationMode) {
      baseClasses.container = `${baseClasses.container} border-red-600 ring-2 ring-red-400/50 shadow-red-900/40 interrogation-mode-container`;
      baseClasses.header = 'bg-gradient-to-r from-red-800 to-red-900 border-red-700 text-white';
      baseClasses.input = 'bg-red-50 border-red-500 focus:border-red-700 text-red-900';
      baseClasses.message = 'vintage-message-character-interrogation';
      baseClasses.messageUser = 'vintage-message-user-interrogation';
      baseClasses.button = 'bg-red-700 hover:bg-red-800 text-white shadow-lg';
      baseClasses.text = 'text-red-900';
      baseClasses.accent = 'text-red-700';
    }

    return baseClasses;
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'fixed bottom-4 right-4';
      case 'bottom-left':
        return 'fixed bottom-4 left-4';
      case 'top-right':
        return 'fixed top-4 right-4';
      case 'top-left':
        return 'fixed top-4 left-4';
      default:
        return 'fixed bottom-4 right-4';
    }
  };

  const themeClasses = getThemeClasses();
  const positionClasses = getPositionClasses();

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`${positionClasses} z-50`}
      >
        <div 
          className={`${themeClasses.container} ${themeClasses.text} border-2 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 vintage-paper`}
          onClick={toggleExpanded}
        >
          <div className="p-3 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-current">
              <img 
                src={currentCharacter?.avatar || '/images/characters/default.png'} 
                alt={currentCharacter?.name || 'Detective'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextSibling) nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-current flex items-center justify-center text-xs">
                🔍
              </div>
            </div>
            <div className="flex-1">
              <h3 className="detective-title text-sm">
                {currentCharacter?.name || 'Detective Chat'}
              </h3>
              <p className="detective-caption opacity-75">
                {messages.length > 0 ? 'Click to continue...' : 'Click to start investigation'}
              </p>
            </div>
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 20 }}
      className={`${positionClasses} z-50`}
      style={{ width, maxHeight }}
    >
      <div className={`${themeClasses.container} ${themeClasses.text} border-2 rounded-lg shadow-xl vintage-paper`}>
        {/* Header */}
        {showHeader && (
          <div className={`${themeClasses.header} border-b-2 p-3 rounded-t-lg`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-current">
                  <img 
                    src={currentCharacter?.avatar || '/images/characters/default.png'} 
                    alt={currentCharacter?.name || 'Detective'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextSibling) nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-current flex items-center justify-center text-xs">
                    🔍
                  </div>
                </div>
                <div>
                <h3 className="detective-title text-sm">
                  {currentCharacter?.name || 'Detective Chat'}
                </h3>
                <p className="detective-caption opacity-75">
                  {currentCharacter?.role || 'Investigation Assistant'}
                </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isInterrogationMode && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center space-x-1 px-2 py-1 rounded-full bg-red-100 border border-red-300 text-red-700 text-xs font-bold detective-label uppercase"
                  >
                    <Gavel className="w-3 h-3" />
                    <span>Interrogation Mode</span>
                  </motion.div>
                )}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={toggleExpanded}
                    className={`${themeClasses.button} p-1 rounded hover:opacity-80 transition-opacity`}
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  {onClose && (
                    <button
                      onClick={onClose}
                      className={`${themeClasses.button} p-1 rounded hover:opacity-80 transition-opacity`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div 
          className="flex-1 overflow-y-auto p-3 space-y-3"
          style={{ maxHeight: `calc(${maxHeight} - 120px)` }}
        >
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🔍</div>
              <h4 className="detective-title mb-2">Investigation Ready</h4>
              <p className="detective-body opacity-75">
                Begin your investigation by asking questions about the case.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`${message.type === 'user' ? themeClasses.messageUser : themeClasses.message} p-3 rounded-lg border ${
                    message.type === 'user' 
                      ? 'ml-8' 
                      : 'mr-8'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'user' ? (
                      <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white flex-shrink-0 shadow-md">
                        <img 
                          src="/images/characters/detective.png" 
                          alt="Detective"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextSibling) nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-xs font-bold">
                          🕵️
                        </div>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-current flex-shrink-0">
                        <img 
                          src={currentCharacter?.avatar || '/images/characters/default.png'} 
                          alt={currentCharacter?.name || 'Character'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextSibling) nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-current flex items-center justify-center text-xs">
                          👤
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="detective-body text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 opacity-50" />
                        <span className="detective-caption opacity-50">
                          {new Date(message.timestamp).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${themeClasses.message} p-3 rounded-lg border mr-8`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-current flex-shrink-0">
                  <img 
                    src={currentCharacter?.avatar || '/images/characters/default.png'} 
                    alt={currentCharacter?.name || 'Character'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="detective-body text-sm opacity-75">
                    {currentCharacter?.name || 'Character'} is typing
                  </span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className={`${themeClasses.header} border-t-2 p-3 rounded-b-lg`}>
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isInterrogationMode ? "Press for information..." : "Ask about the case..."}
                className={`${themeClasses.input} w-full p-3 border-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm detective-body shadow-inner placeholder-opacity-70`}
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
                onInput={(e) => {
                  e.currentTarget.style.height = 'auto';
                  e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                }}
              />
            </div>
            <div className="flex flex-col space-y-1">
              {enableVoice && (
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`${themeClasses.button} p-2 rounded hover:opacity-80 transition-opacity ${
                    isRecording ? 'bg-red-600 hover:bg-red-700' : ''
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}
              {enableFileUpload && (
                <button className={`${themeClasses.button} p-2 rounded hover:opacity-80 transition-opacity`}>
                  <Paperclip className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={`${themeClasses.button} p-2 rounded hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
