'use client';

import React, { useState, useEffect } from 'react';
import { characters } from '@/lib/characters';
import { motion } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';

export default function CharacterWidget({ params }: { params: { characterId: string } }) {
  const [character, setCharacter] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    // Find character by ID
    const foundCharacter = characters.find(c => c.id === params.characterId);
    setCharacter(foundCharacter);

    // Check if embedded
    const urlParams = new URLSearchParams(window.location.search);
    setIsEmbedded(urlParams.get('embed') === 'true');

    // Add welcome message
    if (foundCharacter) {
      setMessages([
        {
          id: 1,
          type: 'character',
          content: `Hello Detective. I'm ${foundCharacter.name}, ${foundCharacter.role}. I'm ready to answer your questions about the case.`,
          timestamp: new Date()
        }
      ]);
    }
  }, [params.characterId]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !character || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character: character.id,
          message: inputMessage,
          conversationHistory: messages.slice(-10) // Last 10 messages for context
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const characterMessage = {
          id: Date.now() + 1,
          type: 'character',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, characterMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          type: 'character',
          content: 'I apologize, but I cannot respond right now. Please try again.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'character',
        content: 'There was an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const closeWidget = () => {
    if (isEmbedded) {
      window.parent.postMessage({ type: 'WIDGET_CLOSE' }, '*');
    }
  };

  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 to-amber-800 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Character Not Found</h1>
          <p>The requested character could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 to-amber-800 flex flex-col">
      {/* Header */}
      {!isEmbedded && (
        <div className="bg-gradient-to-r from-amber-700 to-amber-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={character.avatar}
                alt={character.name}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div>
                <h1 className="text-lg font-bold">{character.name}</h1>
                <p className="text-sm opacity-90">{character.role}</p>
              </div>
            </div>
            <button
              onClick={closeWidget}
              className="text-white hover:text-amber-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                <div className="font-medium mb-1">
                  {message.type === 'user' ? 'You' : character.name}
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-amber-100 text-amber-900 p-3 rounded-lg">
                <div className="font-medium mb-1">{character.name}</div>
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>typing...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-amber-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${character.name} a question...`}
              className="flex-1 p-3 rounded-lg bg-amber-100 text-amber-900 placeholder-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
