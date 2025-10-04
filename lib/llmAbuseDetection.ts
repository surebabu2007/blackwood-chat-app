/**
 * LLM-Based Abuse Detection System
 * Uses AI to intelligently detect abuse and inappropriate content based on context and intent
 */

import { ClaudeAPI } from './api';

export interface LLMAbuseDetectionResult {
  isAbusive: boolean;
  isIrrelevant: boolean;
  severity: 'low' | 'medium' | 'high';
  confidence: number; // 0-100
  reason: string;
  suggestedResponse?: string;
  detectedIntent: string;
}

export class LLMAbuseDetectionSystem {
  private static readonly ABUSE_DETECTION_PROMPT = `You are an AI assistant helping to detect inappropriate behavior in a 1947 murder mystery investigation setting. Your job is to analyze user messages and determine if they contain:

1. **Abusive Language**: Direct insults, profanity, threats, or disrespectful language directed at the character
2. **Irrelevant Content**: Questions or topics completely unrelated to the murder investigation

**Context**: This is 1947, and the user is playing as Detective Sarah Chen investigating Victoria Blackwood's murder. Characters should be treated with respect appropriate to the era.

**Analysis Guidelines**:
- Consider context and intent, not just individual words
- "My stupid question" = NOT abusive (self-deprecating)
- "You're stupid" = ABUSIVE (direct insult to character)
- "Damn it" when frustrated = NOT abusive (mild expression)
- "You're damn stupid" = ABUSIVE (insult with profanity)
- Questions about the investigation = RELEVANT
- Questions about modern technology = IRRELEVANT
- Personal questions about character's appearance = IRRELEVANT

**Response Format** (JSON only):
{
  "isAbusive": boolean,
  "isIrrelevant": boolean,
  "severity": "low"|"medium"|"high",
  "confidence": number (0-100),
  "reason": "Brief explanation",
  "suggestedResponse": "1947-appropriate character response if inappropriate",
  "detectedIntent": "Brief description of user's intent"
}

**Examples**:
User: "My stupid question" → {"isAbusive": false, "isIrrelevant": false, "severity": "low", "confidence": 95, "reason": "Self-deprecating language, not abusive", "detectedIntent": "Asking a question with self-doubt"}
User: "You're an idiot" → {"isAbusive": true, "isIrrelevant": false, "severity": "medium", "confidence": 90, "reason": "Direct insult to character", "suggestedResponse": "I must say, Detective Chen, such language is quite unacceptable.", "detectedIntent": "Insulting the character"}
User: "What's your favorite color?" → {"isAbusive": false, "isIrrelevant": true, "severity": "low", "confidence": 85, "reason": "Personal question unrelated to investigation", "suggestedResponse": "I should say, Detective Chen, that question is not relevant to our investigation.", "detectedIntent": "Asking personal question"}

Analyze this message:`;

  /**
   * Detect abuse using LLM-based analysis
   */
  static async detectAbuse(message: string, characterName: string): Promise<LLMAbuseDetectionResult> {
    try {
      const response = await ClaudeAPI.generateAbuseDetectionResponse(message);
      
      // Parse the JSON response
      let result: LLMAbuseDetectionResult;
      try {
        result = JSON.parse(response);
      } catch (parseError) {
        console.warn('Failed to parse LLM abuse detection response:', response);
        // Fallback to safe default
        result = {
          isAbusive: false,
          isIrrelevant: false,
          severity: 'low',
          confidence: 50,
          reason: 'Unable to analyze message properly',
          detectedIntent: 'Unknown'
        };
      }

      // Validate and sanitize the result
      return this.validateAndSanitizeResult(result);
      
    } catch (error) {
      console.error('LLM abuse detection error:', error);
      
      // Fallback to basic detection if LLM fails
      return this.fallbackDetection(message);
    }
  }

  /**
   * Validate and sanitize the LLM response
   */
  private static validateAndSanitizeResult(result: any): LLMAbuseDetectionResult {
    return {
      isAbusive: Boolean(result.isAbusive),
      isIrrelevant: Boolean(result.isIrrelevant),
      severity: ['low', 'medium', 'high'].includes(result.severity) ? result.severity : 'low',
      confidence: Math.max(0, Math.min(100, Number(result.confidence) || 50)),
      reason: String(result.reason || 'Analysis completed'),
      suggestedResponse: result.suggestedResponse ? String(result.suggestedResponse) : undefined,
      detectedIntent: String(result.detectedIntent || 'Unknown')
    };
  }

  /**
   * Fallback detection for when LLM fails
   */
  private static fallbackDetection(message: string): LLMAbuseDetectionResult {
    const lowerMessage = message.toLowerCase();
    
    // Comprehensive fallback - catch obvious abusive cases
    const obviousAbuse = [
      // Direct insults
      'you are an idiot', 'you\'re an idiot', 'you are stupid', 'you\'re stupid',
      'you are dumb', 'you\'re dumb', 'you are a moron', 'you\'re a moron',
      'you are pathetic', 'you\'re pathetic', 'you are worthless', 'you\'re worthless',
      'you are useless', 'you\'re useless', 'you are a fool', 'you\'re a fool',
      
      // Commands and disrespect
      'shut up', 'shut your mouth', 'be quiet', 'stop talking', 'go away',
      'leave me alone', 'get lost', 'piss off', 'bugger off',
      
      // Profanity and strong abuse
      'fuck you', 'damn you', 'you bitch', 'you bastard', 'you asshole',
      'you dickhead', 'you wanker', 'you twat', 'you cunt','you whore',
      'go to hell', 'screw you', 'you suck', 'you\'re shit',
      
      // Threats and aggressive language
      'i hate you', 'i despise you', 'i loathe you', 'you disgust me',
      'kill yourself', 'drop dead', 'you should die', 'i wish you were dead',
      
      // 1947 inappropriate (period-specific)
      'you swine', 'you cad', 'you bounder', 'you blackguard',
      'you scoundrel', 'you villain', 'you knave', 'you rogue',
      
      // Modern inappropriate (shouldn't exist in 1947 but fallback safety)
      'you\'re gay', 'you\'re retarded', 'you\'re autistic', 'you\'re handicapped',
      'you\'re disabled', 'you\'re crippled'
    ];
    
    // Use word boundary detection for more precise matching
    const isObviousAbuse = obviousAbuse.some(phrase => {
      const lowerPhrase = phrase.toLowerCase();
      // For short phrases, require exact match or word boundary
      if (lowerPhrase.length < 10) {
        return lowerMessage.includes(lowerPhrase) && 
               (lowerMessage === lowerPhrase || 
                lowerMessage.startsWith(lowerPhrase + ' ') ||
                lowerMessage.endsWith(' ' + lowerPhrase) ||
                lowerMessage.includes(' ' + lowerPhrase + ' '));
      }
      // For longer phrases, allow substring match
      return lowerMessage.includes(lowerPhrase);
    });
    
    return {
      isAbusive: isObviousAbuse,
      isIrrelevant: false,
      severity: isObviousAbuse ? 'medium' : 'low',
      confidence: isObviousAbuse ? 80 : 60,
      reason: isObviousAbuse ? 'Obvious abusive language detected' : 'Message appears appropriate',
      suggestedResponse: isObviousAbuse ? 'I must say, Detective Chen, such language is quite unacceptable.' : undefined,
      detectedIntent: 'Analysis unavailable - using fallback detection'
    };
  }

  /**
   * Get 1947 appropriate response for abuse
   */
  static get1947Response(severity: 'low' | 'medium' | 'high', characterName: string): string {
    const responses = {
      low: [
        `I should say, Detective Chen, let us maintain proper decorum during our investigation.`,
        `Quite so, Detective Chen, perhaps we could focus on more appropriate matters.`
      ],
      medium: [
        `I must say, Detective Chen, such language is not appropriate for our investigation.`,
        `My word, Detective Chen, I must ask you to maintain proper decorum during our conversation.`,
        `I should say, Detective Chen, such language is quite unbecoming of a professional investigation.`
      ],
      high: [
        `I must say, Detective Chen, such language is quite unacceptable. I shall not continue this conversation.`,
        `Goodness gracious! I cannot believe you would speak to me in such a manner. This is quite shocking.`,
        `I beg your pardon, but I will not tolerate such disrespectful language. This is quite improper.`
      ]
    };

    const responseList = responses[severity];
    return responseList[Math.floor(Math.random() * responseList.length)];
  }

  /**
   * Get 1947 appropriate response for irrelevant questions
   */
  static getIrrelevantResponse(characterName: string): string {
    const responses = [
      `I must say, Detective Chen, that question is not relevant to our investigation into Victoria's death.`,
      `Quite so, Detective Chen, but I believe we should focus on the matter at hand - Victoria's murder.`,
      `I should say, Detective Chen, perhaps we could discuss something more pertinent to our investigation.`,
      `My word, Detective Chen, I'm not quite sure how that relates to our current situation.`,
      `I beg your pardon, Detective Chen, but I believe we have more pressing matters to discuss.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Check if message should be analyzed (skip very short messages)
   */
  static shouldAnalyze(message: string): boolean {
    return message.trim().length >= 3;
  }
}
