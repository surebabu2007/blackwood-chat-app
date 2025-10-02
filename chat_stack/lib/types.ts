export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  personality: string[];
  primaryEmotions: string[];
  responsePatterns: {
    initial: string;
    defensive: string;
    selfPitying: string;
    manipulative: string;
    breakdown: string;
  };
  knowledgeBase: string[];
  emotionalTriggers: string[];
  informationSharing: {
    willing: string[];
    reluctant: string[];
    willNot: string[];
    mustBePressed: string[];
  };
  color: string;
  avatar: string;
  backstory: string;
  secrets: string[];
  relationships: Record<string, string>;
  currentEmotionalState: 'neutral' | 'defensive' | 'aggressive' | 'vulnerable' | 'manipulative';
  trustLevel: number; // 0-100
  revealedSecrets: string[];
  conversationDepth?: number;
  lastInteraction?: Date;
}

export interface Message {
  id: string;
  characterId: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'character' | 'system';
  emotionalTone?: string;
  isTyping?: boolean;
}

export interface Conversation {
  id: string;
  characterId: string;
  messages: Message[];
  startedAt: Date;
  lastMessageAt: Date;
  context: ConversationContext;
  investigationProgress: number;
  relationshipScore: number;
}

export interface ConversationContext {
  currentTopic: string;
  emotionalState: string;
  revealedInformation: string[];
  investigationClues: string[];
  characterMood: string;
  conversationDepth: number;
  trustLevel: number;
  lastInteraction: Date;
}

export interface InvestigationState {
  currentCharacter: string | null;
  evidenceCollected: string[];
  suspectsInterviewed: string[];
  caseProgress: number;
  relationshipScores: Record<string, number>;
  discoveredSecrets: string[];
  investigationNotes: string[];
}

export interface APIResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  retryable?: boolean;
}

export interface ClaudeAPIRequest {
  system: Array<{ text: string }>;
  messages: Array<{
    role: 'user' | 'assistant';
    content: Array<{ text: string }>;
  }>;
  model: string;
}

export interface CharacterMemory {
  characterId: string;
  conversationHistory: Message[];
  emotionalState: string;
  trustLevel: number;
  revealedSecrets: string[];
  lastInteraction: Date;
  relationshipScore: number;
  investigationNotes: string[];
}

export interface GameState {
  currentCharacter: string | null;
  investigationProgress: number;
  evidenceCollected: string[];
  suspectsInterviewed: string[];
  caseSolved: boolean;
  trueKiller: string | null;
  relationshipScores: Record<string, number>;
  discoveredSecrets: string[];
  investigationNotes: string[];
  gameStarted: boolean;
  currentLocation: string;
  timeOfDay: string;
}
