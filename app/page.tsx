'use client';

import React, { useState, useEffect } from 'react';
import { characters } from '@/lib/characters';
import { CharacterSelector } from '@/components/CharacterSelector';
import { ChatContainer } from '@/components/ChatContainer';
import { ChatInput } from '@/components/ChatInput';
import { InvestigationPanel } from '@/components/InvestigationPanel';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { NetworkStatus } from '@/components/NetworkStatus';
import { DebugPanel } from '@/components/DebugPanel';
import { SoundSettings } from '@/components/SoundSettings';
import { useChat } from '@/hooks/useChat';
import { useChatStore } from '@/lib/store';
import { CharacterStatusManager } from '@/lib/characterStatus';
import { motion } from 'framer-motion';
import { Menu, X, RotateCcw, Code, ExternalLink } from 'lucide-react';

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

  // Character status state
  const [characterOffline, setCharacterOffline] = useState(false);
  const [timeUntilOnline, setTimeUntilOnline] = useState(0);

  // Update character status
  useEffect(() => {
    if (!currentCharacter) return;

    const updateStatus = () => {
      const isOnline = CharacterStatusManager.isCharacterOnline(currentCharacter.id);
      const timeLeft = CharacterStatusManager.getTimeUntilOnline(currentCharacter.id);
      
      setCharacterOffline(!isOnline);
      setTimeUntilOnline(timeLeft);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, [currentCharacter]);
  
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
    <div 
      className="min-h-screen relative bg-gray-900"
      style={{
        backgroundImage: "url('/images/bg%26logo/BG.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/40 to-black/50"></div>
      
      
      {/* Network Status */}
      <NetworkStatus />
      {/* Header */}
      <header className="bg-black/70 backdrop-blur-md border-b border-amber-600/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img 
                  src="/images/bg&logo/logo.png" 
                  alt="Blackwood Manor" 
                  className="h-8 w-auto sm:h-10"
                />
              </div>
              <div className="hidden sm:block text-xs sm:text-sm text-amber-200 font-typewriter font-bold tracking-wider">
                INVESTIGATION
              </div>
            </div>
            
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {/* Widget Generator Link */}
                  <a
                    href="/widgets"
                    target="_blank"
                    className="hidden lg:flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-amber-300/80 hover:text-amber-200 bg-black/60 hover:bg-black/70 rounded-lg transition-colors border border-amber-600/20"
                    title="Character Widget Generator"
                  >
                    <Code className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Widgets</span>
                  </a>
                  
                  {/* Integration Files Link */}
                  <a
                    href="/integration"
                    target="_blank"
                    className="hidden lg:flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-amber-300/80 hover:text-amber-200 bg-black/60 hover:bg-black/70 rounded-lg transition-colors border border-amber-600/20"
                    title="Integration Files & Documentation"
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Integration</span>
                  </a>
                  
                  {/* Investigation Panel Toggle - Hidden on mobile */}
                  <button
                    onClick={() => setShowInvestigationPanel(!showInvestigationPanel)}
                    className="hidden lg:flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-amber-300/80 hover:text-amber-200 bg-black/60 hover:bg-black/70 rounded-lg transition-colors border border-amber-600/20"
                  >
                    <Menu className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Investigation</span>
                  </button>
                  
                  {/* Reset Game */}
                  <button
                    onClick={handleResetGame}
                    className="flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-amber-300/80 hover:text-amber-200 bg-black/60 hover:bg-black/70 rounded-lg transition-colors border border-amber-600/20"
                    title="Reset Game"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
              
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-amber-300/80 hover:text-amber-200 bg-black/60 hover:bg-black/70 rounded-lg transition-colors border border-amber-600/20"
              >
                {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] relative z-20">
        {/* Character Selector - Desktop */}
        <div className="block w-80 sm:w-96 xl:w-[28rem] bg-black/70 backdrop-blur-md border-r border-amber-600/20 overflow-y-auto">
          <CharacterSelector
            characters={characters}
            selectedCharacter={currentCharacter}
            onCharacterSelect={handleCharacterSelect}
            investigationProgress={gameState.investigationProgress}
          />
        </div>

        {/* Mobile Character Selector */}
        {showMobileMenu && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="w-96 sm:w-[28rem] h-full bg-black/75 backdrop-blur-md border-r border-amber-600/20 overflow-y-auto"
            >
              {/* Mobile Menu Header */}
              <div className="p-4 border-b border-amber-600/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-amber-100">Menu</h2>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="text-amber-400 hover:text-amber-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Widget Generator Link for Mobile */}
                <a
                  href="/widgets"
                  target="_blank"
                  className="flex items-center space-x-2 px-3 py-2 text-amber-300/80 hover:text-amber-200 bg-black/60 hover:bg-black/70 rounded-lg transition-colors border border-amber-600/20 mb-4"
                >
                  <Code className="w-4 h-4" />
                  <span>Character Widget Generator</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                
                {/* Integration Files Link for Mobile */}
                <a
                  href="/integration"
                  target="_blank"
                  className="flex items-center space-x-2 px-3 py-2 text-amber-300/80 hover:text-amber-200 bg-black/60 hover:bg-black/70 rounded-lg transition-colors border border-amber-600/20 mb-4"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Integration Files & Documentation</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
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
        <div className="flex-1 flex flex-col bg-black/60 backdrop-blur-sm">
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
              characterOffline={characterOffline}
              timeUntilOnline={timeUntilOnline}
            />
          </ErrorBoundary>
        </div>

        {/* Investigation Panel - Desktop */}
        {showInvestigationPanel && (
          <div className="hidden lg:block w-80 border-l border-gray-700 overflow-y-auto">
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
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-black/75 backdrop-blur-md border-t border-amber-600/20 max-h-[60vh] overflow-y-auto"
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
      
      {/* Debug Panel - Only in development */}
      <DebugPanel />
      
      {/* Sound Settings */}
      <div className="fixed top-4 right-4 z-50">
        <SoundSettings />
      </div>
      
    </div>
  );
}
