'use client';

import React, { useState, useCallback } from 'react';
import { Character, Message } from '@/lib/types';
import { useChatStore } from '@/lib/store';
import { TimelineManager } from '@/lib/timeline';
import { CharacterStatusManager } from '@/lib/characterStatus';
import { SimpleAbuseDetection } from '@/lib/simpleAbuseDetection';
import { typewriterSounds } from '@/lib/typewriterSounds';

export const useChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCheckedOnline, setLastCheckedOnline] = useState<Date>(new Date());
  
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

  const requestCharacterReply = useCallback(async (
    characterId: string,
    message: string,
    conversationHistory: Message[],
    context: Record<string, unknown> | null
  ): Promise<string> => {
    const payload = {
      character: characterId,
      message,
      conversationHistory,
      context
    };

    const invokeEndpoint = async (endpoint: string) => {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request to ${endpoint} failed with status ${response.status}`);
      }

      return response.json();
    };

    try {
      const primary = await invokeEndpoint('/api/chat');
      if (primary.success && primary.response) {
        return primary.response;
      }

      // If primary failed with a clear error (like API key issue), don't try fallback
      if (primary.error && (primary.error.includes('API key') || primary.error.includes('authentication') || primary.error.includes('API key not configured'))) {
        throw new Error(primary.error);
      }

      // Try fallback only if primary didn't have a critical error
      const fallback = await invokeEndpoint('/api/chat-fallback');
      if (fallback.success && fallback.response) {
        return fallback.response;
      }

      throw new Error(primary.error || fallback.error || 'Unable to generate response');
    } catch (err) {
      // Re-throw with better error message
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Unable to generate response. Please check your API configuration.');
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentCharacter || isLoading) return;
    
    // Validate input
    if (!content.trim() || content.length > 500) {
      setError('Message must be between 1 and 500 characters');
      return;
    }

    // Check if character is online
    if (!CharacterStatusManager.isCharacterOnline(currentCharacter.id)) {
      setError('Character is not cooperating with the interrogation and cannot respond');
      return;
    }

    // Check for abuse or irrelevant content using simple hardcoded detection
    if (SimpleAbuseDetection.shouldAnalyze(content)) {
      try {
        const abuseDetection = SimpleAbuseDetection.detectAbuse(content, currentCharacter.name);
        
        // Act on detections with high confidence
        if ((abuseDetection.isAbusive || abuseDetection.isIrrelevant) && abuseDetection.confidence >= 80) {
          // Put character offline
          const duration = abuseDetection.severity === 'high' ? 60 : 
                          abuseDetection.severity === 'medium' ? 45 : 40;
          
          CharacterStatusManager.setCharacterOffline(
            currentCharacter.id,
            abuseDetection.reason,
            abuseDetection.suggestedResponse || 'Character is offended and needs a moment.',
            duration
          );

          // Add offline message to conversation
          const offlineMessage: Message = {
            id: `offline-${Date.now()}`,
            characterId: currentCharacter.id,
            content: abuseDetection.suggestedResponse || 'I must say, Detective Chen, such language is quite unacceptable. I shall not continue this conversation.',
            timestamp: new Date(),
            type: 'system'
          };

          addMessage(currentCharacter.id, offlineMessage);

          // Add system message about character going offline
          const systemMessage: Message = {
            id: `system-offline-${Date.now()}`,
            characterId: currentCharacter.id,
            content: `Character appears to be quite offended and has stepped away from the conversation.`,
            timestamp: new Date(),
            type: 'system'
          };

          addMessage(currentCharacter.id, systemMessage);
          
          setError(`${currentCharacter.name} is not going to cooperate with this kind of behavior or conversation`);
          // Play error sound for offline character
          await typewriterSounds.playErrorSound();
          return;
        }
      } catch (error) {
        console.warn('LLM abuse detection failed, proceeding with normal message:', error);
        // Continue with normal processing if LLM detection fails
      }
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
      
      const memoryContext = (characterMemory || {}) as Record<string, unknown>;

      const reply = await requestCharacterReply(
        currentCharacter.id,
        content,
        conversationHistory,
        memoryContext
      );

      if (reply) {

        // Validate response against timeline constraints
        const validation = TimelineManager.validateCharacterResponse(
          currentCharacter.id, 
          reply, 
          currentCharacter.trustLevel
        );

        let finalResponse = reply;
        if (!validation.isValid) {
          console.warn('Response validation failed:', validation.violations);
          finalResponse = filterResponseContent(reply, validation.violations);
        }

        // Create character message
        const characterMessage: Message = {
          id: `character-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          characterId: currentCharacter.id,
          content: finalResponse.trim(),
          timestamp: new Date(),
          type: 'character',
          emotionalTone: determineEmotionalTone(finalResponse, currentCharacter)
        };

        addMessage(currentCharacter.id, characterMessage);
        
        // Update character memory based on conversation
        updateCharacterMemory(currentCharacter.id, {
          trustLevel: Math.min(100, (characterMemory?.trustLevel || 20) + 1),
          conversationDepth: (characterMemory?.conversationDepth || 0) + 1,
          lastInteraction: new Date()
        });

        // Check for evidence or clues in the response
        checkForEvidence(reply);
        
        // Update investigation progress (store updates timeline internally)
        updateInvestigationProgress();
        
      } else {
        throw new Error('Failed to generate response');
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
  }, [currentCharacter, isLoading, addMessage, setTyping, getConversationHistory, updateCharacterMemory, addEvidence, addSuspect, updateRelationshipScore, addInvestigationNote, investigationState, gameState, requestCharacterReply]);

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

  const filterResponseContent = (content: string, violations: string[]): string => {
    // Simple content filtering - remove or replace forbidden content
    let filteredContent = content;
    
    // Remove specific forbidden topics mentioned in violations
    violations.forEach(violation => {
      if (violation.includes('forbidden topic')) {
        const topic = violation.split(': ')[1];
        // Replace with a generic response
        filteredContent = filteredContent.replace(new RegExp(topic, 'gi'), '[redacted]');
      }
    });
    
    return filteredContent;
  };

  const selectCharacter = useCallback((character: Character) => {
    setCurrentCharacter(character);
    
    // Initialize character status
    CharacterStatusManager.initializeCharacter(character.id);
    
    // Add character to suspects if not already added
    if (!investigationState.suspectsInterviewed.includes(character.name)) {
      addSuspect(character.name);
    }
    
    // Add investigation note
    addInvestigationNote(`Started conversation with ${character.name}`);
  }, [setCurrentCharacter, addSuspect, addInvestigationNote, investigationState.suspectsInterviewed]);

  // Check for characters coming back online
  const checkForCharactersComingOnline = useCallback(() => {
    if (!currentCharacter) return;

    const wasOffline = !CharacterStatusManager.isCharacterOnline(currentCharacter.id);
    const nowOnline = CharacterStatusManager.isCharacterOnline(currentCharacter.id);

    // If character just came back online, add a return message
    if (wasOffline && nowOnline && lastCheckedOnline < new Date(Date.now() - 5000)) {
      const returnMessage: Message = {
        id: `return-${Date.now()}`,
        characterId: currentCharacter.id,
        content: SimpleAbuseDetection.getReturnMessage(currentCharacter.name),
        timestamp: new Date(),
        type: 'system'
      };

      addMessage(currentCharacter.id, returnMessage);
      // Play bell sound when character comes back online
      typewriterSounds.playBellSound();
    }

    setLastCheckedOnline(new Date());
  }, [currentCharacter, addMessage, lastCheckedOnline]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getCurrentMessages = useCallback(() => {
    if (!currentCharacter) return [];
    return conversations[currentCharacter.id]?.messages || [];
  }, [currentCharacter, conversations]);

  // Set up interval to check for characters coming back online
  React.useEffect(() => {
    const interval = setInterval(checkForCharactersComingOnline, 2000);
    return () => clearInterval(interval);
  }, [checkForCharactersComingOnline]);

  return {
    currentCharacter,
    messages: getCurrentMessages(),
    isTyping,
    isLoading,
    error,
    sendMessage,
    selectCharacter,
    clearError,
    getCurrentMessages,
    checkForCharactersComingOnline
  };
};
