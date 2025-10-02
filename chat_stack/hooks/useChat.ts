'use client';

import { useState, useCallback } from 'react';
import { Character, Message } from '@/lib/types';
import { useChatStore } from '@/lib/store';
import { ClaudeAPI } from '@/lib/api';

export const useChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    currentCharacter,
    conversations,
    isTyping,
    setCurrentCharacter,
    addMessage,
    setTyping,
    updateConversation,
    updateCharacterMemory,
    getConversationHistory,
    addEvidence,
    addSuspect,
    updateRelationshipScore,
    addInvestigationNote,
    investigationState,
    gameState
  } = useChatStore();

  const sendMessage = useCallback(async (content: string) => {
    if (!currentCharacter || isLoading) return;
    
    // Validate input
    if (!content.trim() || content.length > 500) {
      setError('Message must be between 1 and 500 characters');
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      characterId: currentCharacter.id,
      content: content.trim(),
      timestamp: new Date(),
      type: 'user'
    };

    addMessage(currentCharacter.id, userMessage);
    setTyping(true);
    setIsLoading(true);
    setError(null);

    try {
      // Get conversation history
      const conversationHistory = getConversationHistory(currentCharacter.id);
      
      // Get character context
      const characterMemory = useChatStore.getState().getCharacterMemory(currentCharacter.id);
      
      // Generate character response
      const response = await ClaudeAPI.generateCharacterResponse(
        currentCharacter,
        content,
        conversationHistory,
        characterMemory || {}
      );

      if (response.success) {
        // Extract response content from the actual API response format
        const responseContent = response.data?.data?.output?.message?.content?.[0]?.text || 
          response.data?.content?.[0]?.text || 
          response.data?.message || 
          response.message ||
          "I'm not sure how to respond to that.";


        // Create character message
        const characterMessage: Message = {
          id: `character-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          characterId: currentCharacter.id,
          content: responseContent.trim(),
          timestamp: new Date(),
          type: 'character',
          emotionalTone: determineEmotionalTone(responseContent, currentCharacter)
        };

        addMessage(currentCharacter.id, characterMessage);
        
        // Update character memory based on conversation
        updateCharacterMemory(currentCharacter.id, {
          trustLevel: Math.min(100, (characterMemory?.trustLevel || 20) + 1),
          conversationDepth: (characterMemory?.conversationDepth || 0) + 1,
          lastInteraction: new Date()
        });

        // Check for evidence or clues in the response
        checkForEvidence(responseContent);
        
        // Update investigation progress
        updateInvestigationProgress();
        
      } else {
        throw new Error(response.error || 'Failed to generate response');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        characterId: currentCharacter.id,
        content: "I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
        type: 'system'
      };
      
      addMessage(currentCharacter.id, errorMessage);
    } finally {
      setTyping(false);
      setIsLoading(false);
    }
  }, [currentCharacter, isLoading, addMessage, setTyping, getConversationHistory, updateCharacterMemory, addEvidence, addSuspect, updateRelationshipScore, addInvestigationNote, investigationState, gameState]);

  const determineEmotionalTone = (content: string, character: Character): string => {
    const contentLower = content.toLowerCase();
    
    // Check for emotional indicators
    if (contentLower.includes('i can\'t') || contentLower.includes('i don\'t') || contentLower.includes('no!')) {
      return 'defensive';
    }
    if (contentLower.includes('i\'m sorry') || contentLower.includes('i failed') || contentLower.includes('terrible')) {
      return 'self-pitying';
    }
    if (contentLower.includes('you don\'t understand') || contentLower.includes('if you knew')) {
      return 'manipulative';
    }
    if (contentLower.includes('i...') || contentLower.includes('i can\'t believe')) {
      return 'breakdown';
    }
    if (contentLower.includes('i love') || contentLower.includes('family')) {
      return 'vulnerable';
    }
    
    return 'neutral';
  };

  const checkForEvidence = (content: string) => {
    const evidenceKeywords = [
      'evidence', 'clue', 'proof', 'witness', 'saw', 'heard', 'found',
      'discovered', 'secret', 'hidden', 'truth', 'lie', 'alibi'
    ];
    
    const contentLower = content.toLowerCase();
    const foundEvidence = evidenceKeywords.filter(keyword => 
      contentLower.includes(keyword)
    );
    
    if (foundEvidence.length > 0) {
      addEvidence(`Potential evidence mentioned: ${foundEvidence.join(', ')}`);
    }
  };

  const updateInvestigationProgress = () => {
    const currentProgress = gameState.investigationProgress;
    const newProgress = Math.min(100, currentProgress + 1);
    
    useChatStore.getState().updateGameState({
      investigationProgress: newProgress
    });
  };

  const selectCharacter = useCallback((character: Character) => {
    setCurrentCharacter(character);
    
    // Add character to suspects if not already added
    if (!investigationState.suspectsInterviewed.includes(character.name)) {
      addSuspect(character.name);
    }
    
    // Add investigation note
    addInvestigationNote(`Started conversation with ${character.name}`);
  }, [setCurrentCharacter, addSuspect, addInvestigationNote, investigationState.suspectsInterviewed]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getCurrentMessages = useCallback(() => {
    if (!currentCharacter) return [];
    return conversations[currentCharacter.id]?.messages || [];
  }, [currentCharacter, conversations]);

  return {
    currentCharacter,
    messages: getCurrentMessages(),
    isTyping,
    isLoading,
    error,
    sendMessage,
    selectCharacter,
    clearError,
    getCurrentMessages
  };
};
