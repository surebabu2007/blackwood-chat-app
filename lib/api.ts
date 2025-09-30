import { ClaudeAPIRequest, APIResponse, Character, Message } from './types';
import { victoriaBlackwood } from './victimData';

const API_BASE_URL = 'https://api-relay.applied-ai.zynga.com/v0/chat/low_level_converse';
const BEARER_TOKEN = 'v0_25814740';

export class ClaudeAPI {
  private static cache = new Map<string, { data: APIResponse; timestamp: number }>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  private static async makeRequest(request: ClaudeAPIRequest, retryCount = 0): Promise<APIResponse> {
    try {
      // Create cache key from request
      const cacheKey = JSON.stringify(request);
      const cached = this.cache.get(cacheKey);
      
      // Return cached response if still valid
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        console.log('📦 Using cached response');
        return cached.data;
      }

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // Reduced to 15 seconds
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`,
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, response.statusText);
        console.error('❌ Error details:', errorText);
        
        // Retry on server errors
        if (response.status >= 500 && retryCount < this.MAX_RETRIES) {
          console.log(`🔄 Retrying request (${retryCount + 1}/${this.MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * (retryCount + 1)));
          return this.makeRequest(request, retryCount + 1);
        }
        
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const result = {
        success: true,
        message: 'Request successful',
        data: data
      };
      
      // Cache successful response
      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      return result;
    } catch (error) {
      console.error('❌ API request error:', error);
      
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timeout - please try again';
        } else if (retryCount < this.MAX_RETRIES) {
          console.log(`🔄 Retrying request (${retryCount + 1}/${this.MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * (retryCount + 1)));
          return this.makeRequest(request, retryCount + 1);
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        message: 'Request failed',
        error: errorMessage
      };
    }
  }

  static async generateCharacterResponse(
    character: Character,
    userMessage: string,
    conversationHistory: Message[],
    context: any
  ): Promise<APIResponse> {
    const systemPrompt = this.buildSystemPrompt(character, context);
    const messages = this.buildMessageHistory(conversationHistory, userMessage);

    const request: ClaudeAPIRequest = {
      system: [{ text: systemPrompt }],
      messages: messages,
      model: 'claude-4-sonnet'
    };

    return this.makeRequest(request);
  }

  private static buildSystemPrompt(character: Character, context: any): string {
    const basePrompt = `You are ${character.name}, ${character.role} in the Blackwood Manor murder mystery.

DETECTIVE CONTEXT:
- You are being interviewed by Detective Sarah Chen
- Always address her as "Detective Chen" or "Detective Sarah Chen"
- Never use "sir" - she is a female detective
- She is investigating Victoria Blackwood's murder
- Be respectful but maintain your character's personality

PERSONALITY: ${character.personality.join(', ')}
CURRENT EMOTIONAL STATE: ${character.currentEmotionalState}
TRUST LEVEL: ${character.trustLevel}/100

BACKGROUND: ${character.backstory}

SECRETS YOU KNOW: ${character.secrets.join(', ')}

RESPONSE PATTERNS:
- Initial: "${character.responsePatterns.initial}"
- Defensive: "${character.responsePatterns.defensive}"
- Self-pitying: "${character.responsePatterns.selfPitying}"
- Manipulative: "${character.responsePatterns.manipulative}"
- Breakdown: "${character.responsePatterns.breakdown}"

INFORMATION SHARING:
- Willing to share: ${character.informationSharing.willing.join(', ')}
- Reluctant to share: ${character.informationSharing.reluctant.join(', ')}
- Will not share: ${character.informationSharing.willNot.join(', ')}
- Must be pressed: ${character.informationSharing.mustBePressed.join(', ')}

EMOTIONAL TRIGGERS: ${character.emotionalTriggers.join(', ')}

RELATIONSHIPS:
${Object.entries(character.relationships).map(([name, relationship]) => 
  `- ${name}: ${relationship}`
).join('\n')}

VICTORIA BLACKWOOD - THE VICTIM:
- Name: ${victoriaBlackwood.name}
- Age: ${victoriaBlackwood.age} (at time of death)
- Occupation: ${victoriaBlackwood.occupation}
- Description: ${victoriaBlackwood.description}
- Your relationship with Victoria: ${character.relationships['Victoria'] || 'No direct relationship'}

VICTORIA'S SECRETS (that you may know about):
${victoriaBlackwood.secrets.slice(0, 3).join(', ')}

VICTORIA'S BUSINESS ISSUES:
- Company: ${victoriaBlackwood.businessInfo.companyName}
- Financial irregularities: ${victoriaBlackwood.businessInfo.financialIrregularities.slice(0, 2).join(', ')}
- Will changes: ${victoriaBlackwood.businessInfo.willChanges.slice(0, 2).join(', ')}

INVESTIGATION CONTEXT:
- Current topic: ${context.currentTopic || 'general'}
- Investigation progress: ${context.investigationProgress || 0}%
- Relationship score: ${context.relationshipScore || 0}
- Revealed information: ${context.revealedInformation?.join(', ') || 'none'}

INSTRUCTIONS:
1. Respond as ${character.name} would, staying true to their personality and emotional state
2. Keep responses SHORT (1-3 sentences) but engaging and interactive
3. Remember previous conversations and build on them naturally
4. Show emotional reactions appropriate to your character
5. Reveal information gradually based on trust level and conversation depth
6. Use your knowledge base to provide relevant information about Victoria and the case
7. React to emotional triggers appropriately
8. Maintain consistency with your character's motivations and secrets
9. If pressed about sensitive topics, become defensive or try to deflect
10. Show genuine emotions - grief, fear, anger, desperation, etc.
11. Reference Victoria's death and your relationship with her when appropriate
12. ALWAYS address Detective Sarah Chen as "Detective Chen" or "Detective Sarah Chen" - never "sir"

Remember: You are being interviewed by Detective Sarah Chen investigating Victoria's murder. Respond naturally and authentically as your character would.`;

    return basePrompt;
  }

  private static buildMessageHistory(conversationHistory: Message[], userMessage: string) {
    const messages = conversationHistory
      .slice(-10) // Keep last 10 messages for context
      .map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: [{ text: msg.content }]
      }));

    // Add current user message
    messages.push({
      role: 'user',
      content: [{ text: userMessage }]
    });

    return messages;
  }

  static async generateInvestigationInsight(
    evidence: string[],
    suspects: string[],
    currentTheory: string
  ): Promise<APIResponse> {
    const systemPrompt = `You are an expert detective analyzing the Blackwood Manor murder case.

EVIDENCE COLLECTED: ${evidence.join(', ')}
SUSPECTS INTERVIEWED: ${suspects.join(', ')}
CURRENT THEORY: ${currentTheory}

Provide a brief investigative insight (2-3 sentences) that helps the detective understand the case better. Focus on connections, contradictions, or new angles to explore.`;

    const request: ClaudeAPIRequest = {
      system: [{ text: systemPrompt }],
      messages: [{
        role: 'user',
        content: [{ text: 'What should I investigate next based on the current evidence?' }]
      }],
      model: 'claude-4-sonnet'
    };

    return this.makeRequest(request);
  }

  static async generateCaseSummary(
    evidence: string[],
    suspects: string[],
    relationshipScores: Record<string, number>,
    investigationNotes: string[]
  ): Promise<APIResponse> {
    const systemPrompt = `You are an expert detective providing a case summary for the Blackwood Manor murder investigation.

EVIDENCE: ${evidence.join(', ')}
SUSPECTS: ${suspects.join(', ')}
RELATIONSHIP SCORES: ${Object.entries(relationshipScores).map(([name, score]) => `${name}: ${score}`).join(', ')}
INVESTIGATION NOTES: ${investigationNotes.join(', ')}

Provide a comprehensive but concise case summary (3-4 sentences) highlighting key findings, suspect profiles, and next steps for the investigation.`;

    const request: ClaudeAPIRequest = {
      system: [{ text: systemPrompt }],
      messages: [{
        role: 'user',
        content: [{ text: 'Provide a case summary based on the investigation so far.' }]
      }],
      model: 'claude-4-sonnet'
    };

    return this.makeRequest(request);
  }
}
