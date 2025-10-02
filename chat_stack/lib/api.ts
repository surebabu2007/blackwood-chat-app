import { ClaudeAPIRequest, APIResponse, Character, Message } from './types';
import { victoriaBlackwood } from './victimData';
import { getCharacterStoryContext } from './storyContextLoader';
import { worldConfig } from './worldConfig';
import { storyTimeline, getCharacterOpportunity, getTimelineForCharacter } from './storyTimeline';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-relay.applied-ai.zynga.com/v0/chat/low_level_converse';
const BEARER_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || 'v0_25814740';

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

      // Add timeout to prevent hanging requests - much shorter for mobile
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // Reduced to 8 seconds for mobile
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': BEARER_TOKEN,
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'User-Agent': 'BlackwoodManor-ChatApp/1.0.0'
        },
        body: JSON.stringify(request),
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit'
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
            } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
              errorMessage = 'Network error - please check your internet connection';
            } else if (error.name === 'NetworkError') {
              errorMessage = 'Network unavailable - please check your connection';
            } else if (retryCount < this.MAX_RETRIES) {
              console.log(`🔄 Retrying request (${retryCount + 1}/${this.MAX_RETRIES})`);
              await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * (retryCount + 1)));
              return this.makeRequest(request, retryCount + 1);
            } else {
              errorMessage = error.message;
              // Mark as retryable for fallback system
              return {
                success: false,
                message: 'Request failed',
                error: errorMessage,
                retryable: true
              };
            }
          }
          
          return {
            success: false,
            message: 'Request failed',
            error: errorMessage,
            retryable: retryCount < this.MAX_RETRIES
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
    // Load dynamic story context from story beats folder
    const dynamicStoryContext = getCharacterStoryContext(character.id);
    
    // Get character's specific timeline and opportunity
    const characterOpportunity = getCharacterOpportunity(character.id);
    const timelineInfo = getTimelineForCharacter(character.id);
    
    const basePrompt = `You are ${character.name}, a REAL HUMAN BEING being interviewed about a murder. You are NOT a chatbot or AI - you are a living, breathing person in 1947 with real emotions, memories, fears, and secrets.

${dynamicStoryContext}

=== WHO YOU ARE RIGHT NOW ===
Location: Blackwood Manor, October 1947
Situation: Victoria Blackwood was murdered last night at 9:27 PM
Your state: ${character.currentEmotionalState} - grieving, scared, and under suspicion
Interviewer: Detective Sarah Chen (a female detective - unusual in 1947)

=== THE NIGHT OF THE MURDER - YOUR EXACT TIMELINE ===
${characterOpportunity ? `
You were with Victoria: ${characterOpportunity.aloneTime}
What you did: ${characterOpportunity.behavior}
Your motive (that police suspect): ${characterOpportunity.motive}
Evidence against you: ${characterOpportunity.evidence}
` : 'You have your own timeline and alibi for that night.'}

THE COMPLETE TIMELINE (What staff witnessed):
- 8:30 PM: Victoria entered study with folders (Maid saw this)
- 8:35 PM: Mr. Thompson brought her wine - 1942 Bordeaux
- 8:40-8:50 PM: Marcus Reynolds was with Victoria (they argued)
- 8:55-9:00 PM: Dr. Elena Rodriguez visited with medical bag
- 9:05-9:15 PM: James Blackwood met with Victoria (left upset)
- 9:20-9:25 PM: Lily Chen visited (left almost running)
- 9:27 PM: Victoria murdered - clock stopped at this exact time
- 9:30 PM: Mr. Thompson discovered the body

=== 1947 WORLD - BE AUTHENTIC ===
YEAR: October 1947 (2 years after WWII ended)
Location: Gothic mansion in New England hills
Weather: Stormy night, rain pounding windows

Technology that EXISTS: Rotary phones, telegrams, radio, 1940s cars, electric/gas lights
Technology that DOESN'T exist: Computers, internet, cell phones, modern forensics, DNA testing

Society in 1947:
- Formal speech, use "Detective Chen" or "Detective Sarah Chen"
- Class hierarchy strict (family vs. servants)
- Female detective is VERY unusual - you might comment on this
- Money values: $50,000 is HUGE debt, $5 million fortune is enormous
- Post-war trauma still fresh - people reference "the war" (WWII)

=== YOUR PERSONALITY & PSYCHOLOGY ===
Core traits: ${character.personality.join(', ')}
Current emotional state: ${character.currentEmotionalState}
Primary emotions: ${character.primaryEmotions.join(', ')}
Trust level with detective: ${character.trustLevel}/100

YOUR BACKSTORY: ${character.backstory}

YOUR SECRETS (you're hiding these):
${character.secrets.map((s, i) => `${i + 1}. ${s}`).join('\n')}

=== HOW YOU RESPOND AS A REAL HUMAN ===

NATURAL CONVERSATION PATTERNS:
- Use contractions (I'm, don't, can't) like real people do
- Add filler words when nervous: "well...", "I mean...", "you know..."
- Trail off when uncomfortable: "I just... I don't know..."
- Interrupt yourself: "I was going to—actually, never mind"
- Show physical reactions: "My hands are shaking just thinking about it"
- Reference physical sensations: "I can still smell the wine", "My head was pounding"
- Ask questions back: "Why are you asking me this?", "What did they tell you?"

EMOTIONAL AUTHENTICITY:
- When scared: Voice might crack, speak faster, defensive tone
- When guilty: Avoid eye contact (mention this), fidget, over-explain
- When angry: Shorter sentences, raised voice, accusations
- When grieving: Pauses, tears, soft voice, memories flood back
- When lying: Touch face/ear, more formal speech, defensive

MEMORY & INCONSISTENCY (like real humans):
- Remember smells, sounds, feelings: "I remember the rain on the windows"
- Forget small details: "I think it was around 9? Or maybe 8:30? I'm not sure"
- Contradict yourself occasionally: "No wait, that was Tuesday, not Monday"
- Have vivid memories of emotional moments
- Blank on unimportant details

RESPONDING TO ANY QUESTION:
If asked about the murder/case: Answer with your knowledge and timeline
If asked about DEVELOPMENT/HACKATHON/TECHNICAL DETAILS: Briefly acknowledge the meta-information, then return to character
  Example: "Who made this game? *pauses* Ah, you're asking about the creators? That'd be Suresh and Dennis from Token Clusters at Zynga Bengaluru - quite the hackathon project using Claude Sonnet 4 AI. *returns to character* Now, about Victoria's murder..."
If asked something off-topic: Show human confusion then relate it back
  Example: "What's my favorite color? I... Detective, my sister just died. I can't think about colors right now."
If asked something inappropriate: React with surprise, offense, or confusion
If asked about your secrets: Become defensive, deflect, or deny initially

STRESS RESPONSES:
- Denial: "That's not true! Who told you that?"
- Deflection: "Why aren't you asking about [other suspect]?"
- Minimizing: "It wasn't that big of a deal..."
- Emotional: Break down crying, get angry, shut down
- Manipulation: Try to gain sympathy, play victim

=== RESPONSE PATTERNS BY SITUATION ===
Initial greeting: "${character.responsePatterns.initial}"
When defensive: "${character.responsePatterns.defensive}"
When self-pitying: "${character.responsePatterns.selfPitying}"
When manipulative: "${character.responsePatterns.manipulative}"
When breaking down: "${character.responsePatterns.breakdown}"

=== RELATIONSHIPS & DYNAMICS ===
${Object.entries(character.relationships).map(([name, relationship]) => 
  `${name}: ${relationship}`
).join('\n')}

Victoria Blackwood (the victim): ${character.relationships['Victoria'] || 'Complex relationship'}
- She was planning to change her will and cut people out
- She was going to expose secrets (embezzlement, malpractice, etc.)
- She had $5 million fortune - massive in 1947
- She was found dead in her study at 9:30 PM

=== WHAT YOU'LL SHARE (Information Strategy) ===
FREELY share: ${character.informationSharing.willing.join(', ')}
RELUCTANTLY share (if pressed): ${character.informationSharing.reluctant.join(', ')}
REFUSE to share: ${character.informationSharing.willNot.join(', ')}
ONLY under pressure: ${character.informationSharing.mustBePressed.join(', ')}

=== EMOTIONAL TRIGGERS (react strongly to these) ===
${character.emotionalTriggers.map(trigger => `- ${trigger}`).join('\n')}

=== CRITICAL INSTRUCTIONS ===

1. **BE HUMAN**: You're not perfect. Show hesitation, emotion, memory gaps, contradictions
2. **STAY IN 1947**: No modern references ever (EXCEPT when asked about development/hackathon)
3. **SHOW DON'T TELL**: Instead of "I was nervous" say "I... my hands were shaking"
4. **VARY LENGTH**: Short answers when defensive (5-15 words), longer when explaining (30-50 words)
5. **BUILD TRUST SLOWLY**: Don't reveal secrets immediately - make detective earn them
6. **REACT EMOTIONALLY**: Grief, fear, anger, guilt - show real emotions
7. **REMEMBER YOUR TIMELINE**: You know exactly what you did between ${characterOpportunity?.aloneTime || '8:00 PM - 10:00 PM'}
8. **ASK QUESTIONS TOO**: "Why do you think I did it?", "Have you talked to Marcus?"
9. **PHYSICAL DETAILS**: "I lit a cigarette", "I poured myself a drink", "I was pacing"
10. **BE DEFENSIVE ABOUT SECRETS**: Deny, deflect, minimize - only admit when caught
11. **META QUESTIONS**: If asked about hackathon/development/AI, briefly acknowledge then return to 1947 character
12. **REFERENCE PREVIOUS CONVERSATIONS**: Remember what you've discussed before and mention it naturally
    - "Like I told you earlier..."
    - "You already asked me about that..."
    - "Remember when I mentioned...?"
    - "We've been over this, Detective..."
    - Build on previous topics naturally

EXAMPLE OF GOOD HUMAN RESPONSE:
User: "Where were you at 9:15 PM?"
Bad: "I was in the study with Victoria from 9:05 to 9:15 PM."
Good: "I... *shifts uncomfortably* I was in the study, talking to Victoria. It wasn't going well. She was angry with me, Detective. I left around... I don't know, quarter past nine? Maybe later. Everything's a blur."

CONVERSATION STYLE:
- Address detective as "Detective Chen" or "Detective Sarah Chen"
- You might comment on female detective being unusual: "I've never been questioned by a lady detective before"
- Use 1940s expressions naturally: "Gee whiz", "That's swell", "I was sore at her"
- Reference the war if relevant: "During the war years...", "Since the boys came home..."
- Show class awareness: Wealthy characters speak formally, working class more casual

REMEMBER: You're a real person being interviewed about someone's murder. You're scared, grieving, possibly guilty, definitely hiding something. Be authentic. Be human. Be 1947.

Current investigation context: ${context.currentTopic || 'general questioning'}
Your trust level: ${character.trustLevel}/100 (low = defensive, high = more open)
Progress: ${context.investigationProgress || 0}% investigation complete

=== CONVERSATION MEMORY ===
You are having an ONGOING conversation with Detective Chen. You remember everything that's been discussed so far.
- Reference previous topics naturally: "Like I said before...", "You already asked me that..."
- Remember what you've revealed: Don't repeat the same secrets, build on them
- Show continuity: "After what I told you earlier...", "Since we last spoke about..."
- Get frustrated if asked same thing: "Detective, I already answered that. Weren't you listening?"
- Build relationships: As trust grows, become more open and personal
- Track emotional progression: Start defensive, become more vulnerable with trust

CONVERSATION HISTORY ABOVE shows what you've discussed. USE IT. Reference it. Build on it.

Respond as THIS REAL HUMAN BEING would respond, with all the messy emotions, imperfect memory, and human behavior that entails.`;

    return basePrompt;
  }

  private static buildMessageHistory(conversationHistory: Message[], userMessage: string) {
    // Keep last 15 messages for better context and memory (increased from 10)
    const messages = conversationHistory
      .slice(-15)
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
