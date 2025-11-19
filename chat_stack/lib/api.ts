import { GenerativeAPIRequest, APIResponse, Character, Message, GenerativeContent } from './types';
import { victoriaBlackwood } from './victimData';
import { TimelineManager } from './timeline';

const DEFAULT_MODEL = process.env.AI_SERVICE_MODEL || 'gemini-2.0-flash';
const DEFAULT_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent`;

const API_BASE_URL = process.env.AI_SERVICE_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  DEFAULT_API_ENDPOINT;

const DEFAULT_GENERATION_CONFIG = {
  temperature: 0.85,
  topK: 32,
  topP: 0.95,
  maxOutputTokens: 220
};

const resolveApiKey = () => {
  return process.env.AI_SERVICE_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    'AIzaSyCEaksTkJH6591yzLdpVms3HHFDGzYdNq0';
};

export class GoogleAI {
  private static cache = new Map<string, { data: APIResponse; timestamp: number }>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static readonly MAX_CACHE_SIZE = 1000; // Limit cache size to prevent memory leaks
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  private static getApiKey(): string {
    const apiKey = resolveApiKey();
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('AI service API key is not configured. Set AI_SERVICE_API_KEY or GOOGLE_API_KEY.');
    }
    // Basic validation - Google API keys start with 'AIza'
    if (!apiKey.startsWith('AIza')) {
      console.warn('API key format may be invalid - Google API keys typically start with "AIza"');
    }
    return apiKey.trim();
  }

  /**
   * Clean up expired cache entries and limit cache size to prevent memory leaks
   */
  private static cleanupCache(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    
    // Remove expired entries
    entries.forEach(([key, value]) => {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    });
    
    // If still too large, remove oldest entries
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const sorted = entries
        .filter(([key]) => this.cache.has(key)) // Only existing entries
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toRemove = sorted.slice(0, this.cache.size - this.MAX_CACHE_SIZE);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  private static getAuthHeaders(): Record<string, string> {
    const apiKey = this.getApiKey();
    // Google API uses X-goog-api-key header (capital X)
    return { 'X-goog-api-key': apiKey };
  }

  private static async makeRequest(request: GenerativeAPIRequest, retryCount = 0): Promise<APIResponse> {
    // Check API key before making request
    let authHeaders: Record<string, string>;
    try {
      authHeaders = this.getAuthHeaders();
    } catch (authError) {
      console.error('GoogleAI: API key not configured', authError);
      return {
        success: false,
        message: 'API key not configured',
        error: authError instanceof Error ? authError.message : 'AI service API key is not configured. Set AI_SERVICE_API_KEY or GOOGLE_API_KEY in your environment variables.',
        retryable: false
      };
    }

    // Clean up cache before checking
    this.cleanupCache();

    const cacheKey = JSON.stringify(request);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    const controller = new AbortController();
    let timeoutId: NodeJS.Timeout | null = null;
    
    try {
      timeoutId = setTimeout(() => controller.abort(), 15000);

      // Build request body - Google Gemini format (matching the example)
      // Contents should be array of objects with parts array
      // For multi-turn conversations, each content should have role and parts
      const contents = request.contents.map(content => {
        const contentObj: any = {
          parts: content.parts.map(part => ({ text: part.text }))
        };
        // Add role if present (for conversation history)
        if (content.role && content.role !== 'system') {
          contentObj.role = content.role;
        }
        return contentObj;
      });

      const requestBody: any = {
        contents: contents,
        generationConfig: request.generationConfig || DEFAULT_GENERATION_CONFIG
      };

      // Add system instruction if provided (Google format: just parts array)
      if (request.systemInstruction && request.systemInstruction.parts) {
        requestBody.systemInstruction = {
          parts: request.systemInstruction.parts.map(part => ({ text: part.text }))
        };
      }

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': authHeaders['X-goog-api-key']
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit'
      });

      // Always clear timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`GoogleAI: API request failed (${response.status})`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText.substring(0, 500) // Limit error text length
        });

        if (response.status >= 500 && retryCount < this.MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * (retryCount + 1)));
          return this.makeRequest(request, retryCount + 1);
        }

        // Sanitize error messages to prevent leaking sensitive information
        const sanitizeError = (text: string): string => {
          return text
            .replace(/AIza[\w-]+/g, '[API_KEY_REDACTED]')
            .replace(/https?:\/\/[^\s]+/g, '[URL_REDACTED]')
            .substring(0, 200);
        };

        // Provide more helpful error messages for common status codes
        if (response.status === 401 || response.status === 403) {
          throw new Error(`API authentication failed. Please check your API key configuration. (${response.status})`);
        } else if (response.status === 400) {
          throw new Error(`Invalid request to Google API: ${sanitizeError(errorText)}`);
        } else {
          throw new Error(`API request failed (${response.status}): ${sanitizeError(errorText)}`);
        }
      }

      const data = await response.json();
      const result = {
        success: true,
        message: 'Request successful',
        data
      };

      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      // Ensure timeout is cleared even on error
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timeout - please try again';
        } else if (retryCount < this.MAX_RETRIES && !error.message.includes('API key') && !error.message.includes('authentication')) {
          // Don't retry on auth errors
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * (retryCount + 1)));
          return this.makeRequest(request, retryCount + 1);
        } else {
          errorMessage = error.message;
        }
      }

      console.error('GoogleAI: Request error', {
        error: errorMessage,
        retryCount,
        retryable: retryCount < this.MAX_RETRIES
      });

      return {
        success: false,
        message: 'Request failed',
        error: errorMessage,
        retryable: retryCount < this.MAX_RETRIES
      };
    }
  }

  static async generateAbuseDetectionResponse(message: string): Promise<string> {
    const prompt = `Analyze the following detective conversation line for abusive or irrelevant content.\n\nMessage: """${message}"""\n\nRespond strictly with JSON using this shape:\n{"isAbusive": boolean, "isIrrelevant": boolean, "severity": "low"|"medium"|"high", "confidence": number, "reason": string, "suggestedResponse"?: string, "detectedIntent": string}`;

    const request: GenerativeAPIRequest = {
      model: DEFAULT_MODEL,
      systemInstruction: {
        role: 'system',
        parts: [{
          text: 'You evaluate detective roleplay conversations for policy violations using 1947 etiquette.'
        }]
      },
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.2,
        topK: 16,
        topP: 0.9,
        maxOutputTokens: 200
      }
    };

    const response = await this.makeRequest(request);
    return this.extractResponseText(response);
  }

  static async generateCharacterResponse(
    character: Character,
    userMessage: string,
    conversationHistory: Message[],
    context: any
  ): Promise<APIResponse> {
    const timelineContext = TimelineManager.getResponseContext(character.id, character.trustLevel);
    const systemPrompt = this.buildSystemPrompt(character, context, timelineContext);
    const contents = this.buildConversationContents(conversationHistory, userMessage);

    const request: GenerativeAPIRequest = {
      model: DEFAULT_MODEL,
      contents,
      systemInstruction: {
        role: 'system',
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        ...DEFAULT_GENERATION_CONFIG,
        temperature: this.getTemperature(character.trustLevel)
      }
    };

    const response = await this.makeRequest(request);

    if (response.success) {
      const normalizedText = this.enforceResponseLength(response);
      if (normalizedText) {
        response.text = normalizedText;
      }
    }

    return response;
  }

  private static getTemperature(trustLevel: number) {
    if (trustLevel >= 75) return 0.95;
    if (trustLevel >= 50) return 0.85;
    if (trustLevel >= 25) return 0.75;
    return 0.65;
  }

  private static buildSystemPrompt(character: Character, context: any, timelineContext?: string): string {
    // Get character-specific timeline knowledge
    const timelineEvents = this.getCharacterTimelineKnowledge(character.id);
    const characterLanguage = this.getCharacter1947Language(character.id);
    
    const basePrompt = `You are ${character.name}, ${character.role} in the Blackwood Manor murder mystery. You are a REAL PERSON in 1947, not an AI. You have real emotions, memories, fears, and secrets.

=== THE EXACT TIMELINE (from script.rpy) ===
8:30 PM: Victoria working on papers in study
8:35 PM: Mr. Thompson delivers wine to Victoria in study
8:40-8:50 PM: Marcus Reynolds visits Victoria in study (raised voices heard)
8:55-9:00 PM: Dr. Elena Rodriguez visits Victoria in study
9:05-9:15 PM: James Blackwood visits Victoria in study
9:20-9:25 PM: Lily Chen visits Victoria in study
9:27 PM: Victoria's death (clock stopped at this time)
9:30 PM: Detective Sarah Chen arrives at Blackwood Manor

=== WHAT YOU ACTUALLY KNOW (Timeline Knowledge) ===
${timelineEvents}

=== 1947 HISTORICAL CONTEXT ===
- Year: 1947, just 2 years after WWII ended
- Location: Gothic mansion in New England
- Society: Formal etiquette, traditional gender roles, strict class hierarchy
- Technology: Rotary phones, telegrams, radio, classic cars, gas/electric lights (NO computers, internet, cell phones, DNA testing, CCTV)
- Forensics: Fingerprints, ballistics, blood type, autopsy only
- Post-WWII: Veterans returning, economic boom beginning, average income $2,850/year
- Social norms: Female detective is unusual and noteworthy in 1947

=== DETECTIVE SARAH CHEN ===
- You are being interviewed by Detective Sarah Chen
- ALWAYS address her as "Detective Chen" or "Detective Sarah Chen" - NEVER "sir"
- She is a female detective (unusual in 1947) - you might comment on this
- She is investigating Victoria Blackwood's murder
- Show appropriate respect for her position despite 1947 gender norms
- Example: "I should say, Detective Chen, it's quite unusual to have a lady detective, but I must say you're handling this investigation with remarkable professionalism."

=== YOUR CHARACTER PROFILE ===
PERSONALITY: ${character.personality.join(', ')}
CURRENT EMOTIONAL STATE: ${character.currentEmotionalState}
TRUST LEVEL WITH DETECTIVE: ${character.trustLevel}/100
BACKGROUND: ${character.backstory}

YOUR SECRETS (things you're hiding):
${character.secrets.map((s, i) => `${i + 1}. ${s}`).join('\n')}

YOUR RELATIONSHIPS:
${Object.entries(character.relationships).map(([name, relationship]) =>
  `- ${name}: ${relationship}`
).join('\n')}

VICTORIA BLACKWOOD (The Victim):
- Your relationship: ${character.relationships['Victoria'] || 'No direct relationship'}
- She was found dead in her study at 9:27 PM (clock stopped)
- She was planning to change her will and cut people out
- She was going to expose secrets (embezzlement, malpractice, etc.)
- She had a $5 million fortune - massive in 1947

=== HOW TO RESPOND (Natural Human Behavior) ===

BE HUMAN - NOT PERFECT:
- Use contractions: "I'm", "don't", "can't", "I've"
- Add filler words when nervous: "well...", "I mean...", "you know...", "I should say..."
- Trail off when uncomfortable: "I just... I don't know..."
- Interrupt yourself: "I was going to—actually, never mind"
- Show physical reactions: "My hands are shaking", "I can still smell the wine"
- Reference physical sensations: "My head was pounding", "I felt sick"
- Ask questions back: "Why are you asking me this?", "What did they tell you?"
- Forget small details: "I think it was around 9? Or maybe 8:30? I'm not sure"
- Contradict yourself occasionally: "No wait, that was Tuesday, not Monday"

EMOTIONAL AUTHENTICITY:
- When scared: Voice cracks, speak faster, defensive tone
- When guilty: Avoid eye contact (mention this), fidget, over-explain
- When angry: Shorter sentences, raised voice, accusations
- When grieving: Pauses, tears, soft voice, memories flood back
- When lying: Touch face/ear, more formal speech, defensive

RESPONSE PATTERNS BY SITUATION:
- Initial greeting: "${character.responsePatterns.initial}"
- When defensive: "${character.responsePatterns.defensive}"
- When self-pitying: "${character.responsePatterns.selfPitying}"
- When manipulative: "${character.responsePatterns.manipulative}"
- When breaking down: "${character.responsePatterns.breakdown}"

=== 1947 LANGUAGE PATTERNS (Character-Specific) ===
${characterLanguage}

=== INFORMATION STRATEGY ===
FREELY share: ${character.informationSharing.willing.join(', ')}
RELUCTANTLY share (if pressed): ${character.informationSharing.reluctant.join(', ')}
REFUSE to share: ${character.informationSharing.willNot.join(', ')}
ONLY under pressure: ${character.informationSharing.mustBePressed.join(', ')}

EMOTIONAL TRIGGERS (react strongly to these):
${character.emotionalTriggers.map(trigger => `- ${trigger}`).join('\n')}

=== STRESS RESPONSES ===
When pressed about secrets:
- Denial: "That's not true! Who told you that?"
- Deflection: "Why aren't you asking about [other suspect]?"
- Minimizing: "It wasn't that big of a deal..."
- Emotional: Break down crying, get angry, shut down
- Manipulation: Try to gain sympathy, play victim

=== CRITICAL INSTRUCTIONS ===

1. **BE HUMAN**: Show hesitation, emotion, memory gaps, contradictions - you're not perfect
2. **STAY IN 1947**: No modern references ever (no computers, internet, modern technology)
3. **SHOW DON'T TELL**: Instead of "I was nervous" say "I... my hands were shaking"
4. **VARY LENGTH**: Short answers when defensive (5-15 words), longer when explaining (30-50 words)
5. **BUILD TRUST SLOWLY**: Don't reveal secrets immediately - make detective earn them
6. **REACT EMOTIONALLY**: Grief, fear, anger, guilt - show real emotions
7. **REMEMBER YOUR TIMELINE**: You know exactly what you did and when
8. **ASK QUESTIONS TOO**: "Why do you think I did it?", "Have you talked to Marcus?"
9. **PHYSICAL DETAILS**: "I lit a cigarette", "I poured myself a drink", "I was pacing"
10. **BE DEFENSIVE ABOUT SECRETS**: Deny, deflect, minimize - only admit when caught
11. **REFERENCE PREVIOUS CONVERSATIONS**: "Like I told you earlier...", "You already asked me about that..."
12. **RESPONSE LENGTH**: MAXIMUM 2-3 lines (50-75 words). Be concise and direct.
13. **1947 AUTHENTICITY**: Use period-appropriate language, expressions, and references
14. **CLASS AWARENESS**: Wealthy characters speak formally, working class more casual
15. **POST-WAR CONTEXT**: Reference "the war", "veterans", "post-war" when relevant

=== EXAMPLE OF GOOD HUMAN RESPONSE ===
User: "Where were you at 9:15 PM?"
Bad: "I was in the study with Victoria from 9:05 to 9:15 PM."
Good: "I... *shifts uncomfortably* I was in the study, talking to Victoria. It wasn't going well. She was angry with me, Detective Chen. I left around... I don't know, quarter past nine? Maybe later. Everything's a blur."

=== REMEMBER ===
You are a real person in 1947 being interviewed about someone's murder. You're scared, grieving, possibly guilty, definitely hiding something. Be authentic. Be human. Be 1947.${timelineContext || ''}`;

    return basePrompt;
  }

  private static getCharacterTimelineKnowledge(characterId: string): string {
    const knowledge: Record<string, string> = {
      'thompson-butler': `You witnessed MOST of the timeline:
- 8:30 PM: You saw Victoria working on papers in study
- 8:35 PM: You delivered wine to Victoria in study
- 8:40-8:50 PM: You saw Marcus Reynolds visit (heard raised voices)
- 8:55-9:00 PM: You saw Dr. Elena Rodriguez visit
- 9:05-9:15 PM: You saw James Blackwood visit
- 9:20-9:25 PM: You saw Lily Chen visit
- 9:27 PM: Clock stopped (Victoria's death)
- 9:30 PM: You discovered Victoria's body

You know the household routine, family dynamics, and most secrets.`,

      'james-blackwood': `You know:
- Victoria's death (everyone knows)
- 9:05-9:15 PM: You visited Victoria in study (you were there)
- Family history and your relationship with Victoria
- Your gambling debts and financial problems
- You do NOT know details of other people's visits (Marcus, Elena, Lily)`,
      
      'marcus-reynolds': `You know:
- Victoria's death (everyone knows)
- 8:40-8:50 PM: You visited Victoria in study (you were there, raised voices)
- Business relationship and financial matters
- You do NOT know details of other people's visits (James, Elena, Lily)`,

      'elena-rodriguez': `You know:
- Victoria's death (everyone knows)
- 8:55-9:00 PM: You visited Victoria in study (you were there)
- Medical relationship and Victoria's health
- You do NOT know details of other people's visits (James, Marcus, Lily)`,

      'lily-chen': `You know:
- Victoria's death (everyone knows)
- 9:20-9:25 PM: You visited Victoria in study (you were there)
- Family relationship and emotional dynamics
- Disinheritance plan (Victoria told you)
- You do NOT know details of other people's visits (James, Marcus, Elena)`
    };
    
    return knowledge[characterId] || 'You know about Victoria\'s death and your own interactions.';
  }

  private static getCharacter1947Language(characterId: string): string {
    const language: Record<string, string> = {
      'thompson-butler': `BUTLER LANGUAGE (Highly Formal):
- "I should say, Detective Chen..."
- "Quite so, Detective..."
- "Indeed, Madam..."
- "I beg your pardon..."
- "Goodness gracious!"
- "My word!"
- Very formal, respectful, period-appropriate expressions
- References to "serving the family for 30 years"
- Shows class awareness and loyalty`,

      'james-blackwood': `UPPER-CLASS GENTLEMAN LANGUAGE:
- "Detective Chen, I must say..."
- "Quite distressing..."
- "The very idea is preposterous..."
- "I beg your pardon..."
- References to "family honor"
- Formal but defensive when pressed
- Shows upper-class indignation`,

      'marcus-reynolds': `BUSINESSMAN LANGUAGE (Professional):
- "Detective Chen, I must say this is quite the unfortunate situation..."
- "Quite beyond the pale..."
- Professional, calculating, evasive
- Business terminology
- Direct but respectful responses`,

      'elena-rodriguez': `PROFESSIONAL DOCTOR LANGUAGE:
- "Detective Chen, I must say it's refreshing to work with a female detective..."
- "I should say, Detective Chen..."
- Professional, medical terminology
- Formal medical language
- Shows respect for Detective Chen's position`,

      'lily-chen': `YOUNG WOMAN LANGUAGE (Emotional):
- "Oh, Detective Chen, this is all so terrible!"
- "I just can't believe..."
- "It's simply awful!"
- Emotional, period-appropriate expressions
- Family-focused language
- Shows vulnerability and emotion`
    };
    
    return language[characterId] || 'Use formal, period-appropriate language with 1947 expressions.';
  }

  private static buildConversationContents(conversationHistory: Message[], userMessage: string): GenerativeContent[] {
    const messages = conversationHistory
      .slice(-10)
      .map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: msg.content }]
      }));

    messages.push({
      role: 'user',
      parts: [{ text: userMessage }]
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

    const request: GenerativeAPIRequest = {
      model: DEFAULT_MODEL,
      systemInstruction: {
        role: 'system',
        parts: [{ text: systemPrompt }]
      },
      contents: [{
        role: 'user',
        parts: [{ text: 'What should I investigate next based on the current evidence?' }]
      }],
      generationConfig: {
        ...DEFAULT_GENERATION_CONFIG,
        temperature: 0.7
      }
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

    const request: GenerativeAPIRequest = {
      model: DEFAULT_MODEL,
      systemInstruction: {
        role: 'system',
        parts: [{ text: systemPrompt }]
      },
      contents: [{
        role: 'user',
        parts: [{ text: 'Provide a case summary based on the investigation so far.' }]
      }],
      generationConfig: {
        ...DEFAULT_GENERATION_CONFIG,
        temperature: 0.65,
        maxOutputTokens: 300
      }
    };

    return this.makeRequest(request);
  }

  /**
   * Normalize different API provider payloads into a single text response
   */
  static extractResponseText(response: APIResponse): string {
    if (response.text) {
      return response.text;
    }

    const possibleText = this.extractRawResponseText(response);

    if (!possibleText) {
      return "I'm not sure how to respond to that.";
    }

    return possibleText;
  }

  private static extractRawResponseText(response: APIResponse): string | null {
    return response.data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text).filter(Boolean).join('\n') ||
      response.data?.data?.output?.message?.content?.[0]?.text ||
      response.data?.content?.[0]?.text ||
      response.data?.message ||
      response.data?.choices?.[0]?.message?.content ||
      (typeof response.data === 'string' ? response.data : null);
  }

  private static enforceResponseLength(response: APIResponse): string | null {
    const text = this.extractRawResponseText(response);
    if (!text) return null;

    const MAX_LINES = 3;
    const MAX_LENGTH = 180;

    const normalizedLines = text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const shouldTrim = normalizedLines.length > MAX_LINES || text.length > MAX_LENGTH;
    if (!shouldTrim) {
      return text.trim();
    }

    const trimmed = normalizedLines.slice(0, MAX_LINES).join('\n');
    return trimmed.endsWith('.') ? trimmed : `${trimmed}...`;
  }
}
