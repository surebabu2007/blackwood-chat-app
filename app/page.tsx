'use client';

import React, { useState, useEffect } from 'react';
import { characters } from '@/lib/characters';
import { CharacterSelector } from '@/components/CharacterSelector';
import { ChatContainer } from '@/components/ChatContainer';
import { ChatInput } from '@/components/ChatInput';
import { InvestigationPanel } from '@/components/InvestigationPanel';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useChat } from '@/hooks/useChat';
import { useChatStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Menu, X, RotateCcw } from 'lucide-react';

export default function HomePage() {
  const [showInvestigationPanel, setShowInvestigationPanel] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
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
  
  const { investigationState, gameState, resetGame } = useChatStore();

  // Initialize game state on first load
  useEffect(() => {
    if (!gameState.gameStarted) {
      useChatStore.getState().updateGameState({
        gameStarted: true,
        trueKiller: characters[Math.floor(Math.random() * characters.length)].name
      });
    }
  }, [gameState.gameStarted]);

  const handleSendMessage = (message: string) => {
    if (message.trim() && message.length <= 500) {
      sendMessage(message);
    }
  };

  const handleCharacterSelect = (character: any) => {
    selectCharacter(character);
    setShowMobileMenu(false);
  };

  const handleResetGame = () => {
    if (confirm('Are you sure you want to reset the game? This will clear all progress.')) {
      resetGame();
      setShowInvestigationPanel(false);
      setShowMobileMenu(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blackwood-900 via-blackwood-800 to-blackwood-900">
      {/* Header */}
      <header className="bg-blackwood-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-white">
                Blackwood Manor Investigation
              </h1>
              <div className="hidden md:block text-sm text-gray-400">
                Interactive Murder Mystery
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Investigation Panel Toggle */}
              <button
                onClick={() => setShowInvestigationPanel(!showInvestigationPanel)}
                className="hidden md:flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
              >
                <Menu className="w-4 h-4 mr-2" />
                Investigation
              </button>
              
              {/* Reset Game */}
              <button
                onClick={handleResetGame}
                className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
              
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
              >
                {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Character Selector - Desktop */}
        <div className="hidden md:block w-80 border-r border-gray-700 overflow-y-auto">
          <CharacterSelector
            characters={characters}
            selectedCharacter={currentCharacter}
            onCharacterSelect={handleCharacterSelect}
            investigationProgress={gameState.investigationProgress}
          />
        </div>

        {/* Mobile Character Selector */}
        {showMobileMenu && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="w-80 h-full bg-blackwood-800 border-r border-gray-700 overflow-y-auto"
            >
              <CharacterSelector
                characters={characters}
                selectedCharacter={currentCharacter}
                onCharacterSelect={handleCharacterSelect}
                investigationProgress={gameState.investigationProgress}
              />
            </motion.div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <ErrorBoundary>
            {/* Chat Container */}
            <ChatContainer
              messages={messages}
              characterName={currentCharacter?.name}
              characterAvatar={currentCharacter?.avatar}
              isTyping={isTyping}
            />
            
            {/* Chat Input */}
            <ChatInput
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
              disabled={!currentCharacter || isLoading}
              placeholder={currentCharacter ? `Ask ${currentCharacter.name} something...` : "Select a character to begin..."}
              characterName={currentCharacter?.name}
            />
          </ErrorBoundary>
        </div>

        {/* Investigation Panel - Desktop */}
        {showInvestigationPanel && (
          <div className="hidden md:block w-80 border-l border-gray-700 overflow-y-auto">
            <InvestigationPanel
              investigationState={investigationState}
              gameState={gameState}
              onAddNote={(note) => useChatStore.getState().addInvestigationNote(note)}
              onUpdateProgress={(progress) => useChatStore.getState().updateGameState({ investigationProgress: progress })}
            />
          </div>
        )}
      </div>

      {/* Error Toast */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center space-x-2">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-white hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Mobile Investigation Panel */}
      {showInvestigationPanel && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-blackwood-800 border-t border-gray-700 max-h-[50vh] overflow-y-auto"
          >
            <InvestigationPanel
              investigationState={investigationState}
              gameState={gameState}
              onAddNote={(note) => useChatStore.getState().addInvestigationNote(note)}
              onUpdateProgress={(progress) => useChatStore.getState().updateGameState({ investigationProgress: progress })}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
