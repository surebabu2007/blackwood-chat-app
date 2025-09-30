import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Character, Message, Conversation, InvestigationState, GameState } from './types';

interface ChatStore {
  // Current state
  currentCharacter: Character | null;
  conversations: Record<string, Conversation>;
  isTyping: boolean;
  
  // Investigation state
  investigationState: InvestigationState;
  gameState: GameState;
  
  // Actions
  setCurrentCharacter: (character: Character | null) => void;
  addMessage: (characterId: string, message: Message) => void;
  setTyping: (isTyping: boolean) => void;
  updateConversation: (characterId: string, message: Message) => void;
  updateInvestigationState: (updates: Partial<InvestigationState>) => void;
  updateGameState: (updates: Partial<GameState>) => void;
  resetGame: () => void;
  
  // Character memory
  updateCharacterMemory: (characterId: string, updates: Partial<Character>) => void;
  getCharacterMemory: (characterId: string) => Character | null;
  
  // Conversation management
  startConversation: (characterId: string) => void;
  endConversation: (characterId: string) => void;
  getConversationHistory: (characterId: string) => Message[];
  
  // Investigation helpers
  addEvidence: (evidence: string) => void;
  addSuspect: (suspectId: string) => void;
  updateRelationshipScore: (characterId: string, score: number) => void;
  addInvestigationNote: (note: string) => void;
}

const initialInvestigationState: InvestigationState = {
  currentCharacter: null,
  evidenceCollected: [],
  suspectsInterviewed: [],
  caseProgress: 0,
  relationshipScores: {},
  discoveredSecrets: [],
  investigationNotes: []
};

const initialGameState: GameState = {
  currentCharacter: null,
  investigationProgress: 5, // Start with 5% to make Mr. Thompson available
  evidenceCollected: [],
  suspectsInterviewed: [],
  caseSolved: false,
  trueKiller: null,
  relationshipScores: {},
  discoveredSecrets: [],
  investigationNotes: [],
  gameStarted: false,
  currentLocation: 'mansion_entrance',
  timeOfDay: 'evening'
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
  // Initial state
  currentCharacter: null,
  conversations: {},
  isTyping: false,
      investigationState: initialInvestigationState,
      gameState: initialGameState,
      
      // Actions
      setCurrentCharacter: (character) => {
        set({ currentCharacter: character });
        if (character) {
          get().startConversation(character.id);
        }
      },
      
      addMessage: (characterId, message) => {
        set((state) => {
          const conversation = state.conversations[characterId];
          if (!conversation) {
            return state;
          }
          
          const updatedConversation = {
            ...conversation,
            messages: [...conversation.messages, message],
            lastMessageAt: new Date()
          };
          
          return {
            conversations: {
              ...state.conversations,
              [characterId]: updatedConversation
            }
          };
        });
      },
      
      setTyping: (isTyping) => {
        set({ isTyping });
      },
      
      updateConversation: (characterId, message) => {
        set((state) => {
          const conversation = state.conversations[characterId];
          if (!conversation) {
            return state;
          }
          
          const updatedConversation = {
            ...conversation,
            messages: [...conversation.messages, message],
            lastMessageAt: new Date(),
            context: {
              ...conversation.context,
              lastInteraction: new Date(),
              conversationDepth: conversation.context.conversationDepth + 1
            }
          };
          
          return {
            conversations: {
              ...state.conversations,
              [characterId]: updatedConversation
            }
          };
        });
      },
      
      updateInvestigationState: (updates) => {
        set((state) => ({
          investigationState: { ...state.investigationState, ...updates }
        }));
      },
      
      updateGameState: (updates) => {
        set((state) => ({
          gameState: { ...state.gameState, ...updates }
        }));
      },
      
      resetGame: () => {
        set({
          currentCharacter: null,
          conversations: {},
          isTyping: false,
          investigationState: initialInvestigationState,
          gameState: initialGameState
        });
      },
      
      updateCharacterMemory: (characterId, updates) => {
        set((state) => {
          const conversation = state.conversations[characterId];
          if (!conversation) {
            return state;
          }
          
          const updatedConversation = {
            ...conversation,
            context: {
              ...conversation.context,
              ...updates
            }
          };
          
          return {
            conversations: {
              ...state.conversations,
              [characterId]: updatedConversation
            }
          };
        });
      },
      
      getCharacterMemory: (characterId) => {
        const conversation = get().conversations[characterId];
        return conversation ? conversation.context as any : null;
      },
      
      startConversation: (characterId) => {
        set((state) => {
          if (state.conversations[characterId]) {
            return state;
          }
          
          const newConversation: Conversation = {
            id: `${characterId}-${Date.now()}`,
            characterId,
            messages: [],
            startedAt: new Date(),
            lastMessageAt: new Date(),
            context: {
              currentTopic: 'general',
              emotionalState: 'neutral',
              revealedInformation: [],
              investigationClues: [],
              characterMood: 'neutral',
              conversationDepth: 0,
              trustLevel: 20,
              lastInteraction: new Date()
            },
            investigationProgress: 0,
            relationshipScore: 0
          };
          
          return {
            conversations: {
              ...state.conversations,
              [characterId]: newConversation
            }
          };
        });
      },
      
      endConversation: (characterId) => {
        set((state) => {
          const { [characterId]: ended, ...remaining } = state.conversations;
          return { conversations: remaining };
        });
      },
      
      getConversationHistory: (characterId) => {
        const conversation = get().conversations[characterId];
        return conversation ? conversation.messages : [];
      },
      
      addEvidence: (evidence) => {
        set((state) => ({
          investigationState: {
            ...state.investigationState,
            evidenceCollected: [...state.investigationState.evidenceCollected, evidence]
          },
          gameState: {
            ...state.gameState,
            evidenceCollected: [...state.gameState.evidenceCollected, evidence]
          }
        }));
      },
      
      addSuspect: (suspectId) => {
        set((state) => ({
          investigationState: {
            ...state.investigationState,
            suspectsInterviewed: [...state.investigationState.suspectsInterviewed, suspectId]
          },
          gameState: {
            ...state.gameState,
            suspectsInterviewed: [...state.gameState.suspectsInterviewed, suspectId]
          }
        }));
      },
      
      updateRelationshipScore: (characterId, score) => {
        set((state) => ({
          investigationState: {
            ...state.investigationState,
            relationshipScores: {
              ...state.investigationState.relationshipScores,
              [characterId]: score
            }
          },
          gameState: {
            ...state.gameState,
            relationshipScores: {
              ...state.gameState.relationshipScores,
              [characterId]: score
            }
          }
        }));
      },
      
      addInvestigationNote: (note) => {
        set((state) => ({
          investigationState: {
            ...state.investigationState,
            investigationNotes: [...state.investigationState.investigationNotes, note]
          },
          gameState: {
            ...state.gameState,
            investigationNotes: [...state.gameState.investigationNotes, note]
          }
        }));
      }
    }),
    {
      name: 'blackwood-chat-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        investigationState: state.investigationState,
        gameState: state.gameState
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert timestamp strings back to Date objects
          Object.values(state.conversations).forEach(conversation => {
            conversation.messages.forEach(message => {
              if (typeof message.timestamp === 'string') {
                message.timestamp = new Date(message.timestamp);
              }
            });
            if (typeof conversation.startedAt === 'string') {
              conversation.startedAt = new Date(conversation.startedAt);
            }
            if (typeof conversation.lastMessageAt === 'string') {
              conversation.lastMessageAt = new Date(conversation.lastMessageAt);
            }
            if (typeof conversation.context.lastInteraction === 'string') {
              conversation.context.lastInteraction = new Date(conversation.context.lastInteraction);
            }
          });
        }
      }
    }
  )
);
