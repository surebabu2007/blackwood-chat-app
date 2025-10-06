/**
 * Abuse and Relevance Detection System
 * Detects inappropriate questions and abusive language to trigger character offline status
 */

export interface AbuseDetectionResult {
  isAbusive: boolean;
  isIrrelevant: boolean;
  severity: 'low' | 'medium' | 'high';
  reason: string;
  suggestedResponse?: string;
}

export class AbuseDetectionSystem {
  // Abusive words and phrases (1947 appropriate)
  private static abusiveWords = [
    // Modern profanity
    'damn', 'hell', 'bloody', 'blasted', 'cursed', 'confound',
    // Stronger language
    'bastard', 'bitch', 'whore', 'slut', 'idiot', 'moron', 'stupid',
    // Insults
    'shut up', 'shut your mouth', 'shut it', 'shut the hell up',
    // Threats
    'kill you', 'hurt you', 'beat you', 'punch you', 'hit you',
    // Inappropriate topics
    'sex', 'sexual', 'naked', 'nude', 'bedroom', 'intimate',
    // Disrespectful
    'shut up', 'be quiet', 'stop talking', 'go away', 'leave me alone'
  ];

  // Clearly irrelevant questions for 1947 murder investigation
  private static irrelevantTopics = [
    // Modern technology (explicit mentions)
    'facebook', 'twitter', 'instagram', 'youtube', 'google', 'netflix', 'streaming',
    'playstation', 'xbox', 'iphone', 'android', 'smartphone', 'tablet',
    // Modern concepts (explicit mentions)
    'covid', 'pandemic', 'vaccine', 'climate change', 'global warming',
    'renewable energy', 'solar panel', 'wind turbine',
    // Modern politics (explicit mentions)
    'trump', 'biden', 'obama', 'election', 'democrat', 'republican',
    // Modern lifestyle (explicit mentions)
    'starbucks', 'mcdonald\'s', 'burger king', 'kfc', 'pizza hut',
    // Personal inappropriate questions (explicit)
    'are you single', 'marry me', 'date me', 'kiss me', 'love me', 
    'be my girlfriend', 'be my boyfriend', 'your phone number',
    // Clearly off-topic questions
    'tell me a joke', 'sing me a song', 'dance for me', 'make me laugh',
    'what\'s your favorite color', 'what\'s your favorite food'
  ];

  // 1947 appropriate investigation topics
  private static relevantTopics = [
    'victoria', 'blackwood', 'murder', 'death', 'killed', 'killer',
    'investigation', 'detective', 'evidence', 'clue', 'suspect',
    'alibi', 'witness', 'testimony', 'timeline', 'when', 'where',
    'family', 'brother', 'sister', 'business', 'money', 'will',
    'doctor', 'medical', 'health', 'medicine', 'butler', 'staff',
    'mansion', 'study', 'room', 'location', 'last night', 'yesterday',
    'relationship', 'argument', 'fight', 'disagreement', 'secret',
    'truth', 'lie', 'honest', 'trust', 'betrayal', 'motive'
  ];

  /**
   * Detect if message contains abusive language
   */
  static detectAbuse(message: string): AbuseDetectionResult {
    const lowerMessage = message.toLowerCase();
    
    // Check for abusive words (with word boundary detection)
    const foundAbuse = this.abusiveWords.find(word => {
      const lowerWord = word.toLowerCase();
      // Create regex with word boundaries to avoid false positives
      const regex = new RegExp(`\\b${lowerWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(lowerMessage);
    });

    if (foundAbuse) {
      return {
        isAbusive: true,
        isIrrelevant: false,
        severity: this.getSeverity(foundAbuse),
        reason: `Inappropriate language detected: "${foundAbuse}"`,
        suggestedResponse: this.getAbuseResponse(foundAbuse)
      };
    }

    // Check for clearly irrelevant topics (only exact matches or very specific phrases)
    const foundIrrelevant = this.irrelevantTopics.find(topic => {
      const lowerTopic = topic.toLowerCase();
      // For short phrases, require exact match or word boundary
      if (lowerTopic.length < 10) {
        return lowerMessage.includes(lowerTopic) && 
               (lowerMessage === lowerTopic || 
                lowerMessage.startsWith(lowerTopic + ' ') ||
                lowerMessage.endsWith(' ' + lowerTopic) ||
                lowerMessage.includes(' ' + lowerTopic + ' '));
      }
      // For longer phrases, allow substring match
      return lowerMessage.includes(lowerTopic);
    });

    if (foundIrrelevant) {
      return {
        isAbusive: false,
        isIrrelevant: true,
        severity: 'medium',
        reason: `Irrelevant topic detected: "${foundIrrelevant}"`,
        suggestedResponse: this.getIrrelevantResponse(foundIrrelevant)
      };
    }

    // Check if message is clearly irrelevant (only for obvious off-topic messages)
    // Don't mark messages as irrelevant just because they don't contain investigation keywords
    // This allows for natural conversation flow

    return {
      isAbusive: false,
      isIrrelevant: false,
      severity: 'low',
      reason: 'Message is appropriate'
    };
  }

  /**
   * Get severity level of abuse
   */
  private static getSeverity(word: string): 'low' | 'medium' | 'high' {
    const highSeverity = ['bastard', 'bitch', 'whore', 'slut', 'kill you', 'hurt you'];
    const mediumSeverity = ['damn', 'hell', 'bloody', 'idiot', 'moron', 'stupid'];
    
    if (highSeverity.includes(word)) return 'high';
    if (mediumSeverity.includes(word)) return 'medium';
    return 'low';
  }

  /**
   * Get appropriate 1947 response for abuse
   */
  private static getAbuseResponse(word: string): string {
    const responses = {
      high: [
        "I must say, Detective Chen, such language is quite unacceptable. I shall not continue this conversation.",
        "Goodness gracious! I cannot believe you would speak to me in such a manner. This is quite shocking.",
        "I beg your pardon, but I will not tolerate such disrespectful language. This is quite improper.",
        "My word, Detective Chen, I find such conduct utterly reprehensible. I refuse to cooperate with this kind of behavior.",
        "I should say, Detective Chen, such language is completely inappropriate. I will not participate in this interrogation under these circumstances."
      ],
      medium: [
        "I should say, Detective Chen, such language is not appropriate for our investigation.",
        "My word, Detective Chen, I must ask you to maintain proper decorum during our conversation.",
        "I must say, such language is quite unbecoming of a professional investigation.",
        "I beg your pardon, Detective Chen, but I cannot cooperate with this kind of behavior.",
        "Quite so, Detective Chen, I find this manner of questioning quite inappropriate."
      ],
      low: [
        "I should say, Detective Chen, let us maintain proper decorum during our investigation.",
        "Quite so, Detective Chen, perhaps we could focus on more appropriate matters.",
        "My word, Detective Chen, I would prefer we conduct this conversation with more civility."
      ]
    };

    const severity = this.getSeverity(word);
    const responseList = responses[severity];
    return responseList[Math.floor(Math.random() * responseList.length)];
  }

  /**
   * Get appropriate 1947 response for irrelevant questions
   */
  private static getIrrelevantResponse(topic: string): string {
    const responses = [
      "I must say, Detective Chen, that question is not relevant to our investigation into Victoria's death.",
      "Quite so, Detective Chen, but I believe we should focus on the matter at hand - Victoria's murder.",
      "I should say, Detective Chen, perhaps we could discuss something more pertinent to our investigation.",
      "My word, Detective Chen, I'm not quite sure how that relates to our current situation.",
      "I beg your pardon, Detective Chen, but I believe we have more pressing matters to discuss.",
      "I should say, Detective Chen, I cannot cooperate with this line of questioning. It's not appropriate for our investigation.",
      "My word, Detective Chen, I find this manner of interrogation quite inappropriate. I will not participate in such conversations.",
      "I must say, Detective Chen, such questions are not suitable for our professional discussion about Victoria's case."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Check if message is too short or nonsensical
   */
  static isNonsensical(message: string): boolean {
    if (message.length < 3) return true;
    
    // Check for random characters or gibberish
    const gibberishPattern = /^[^a-zA-Z\s]{3,}$/;
    if (gibberishPattern.test(message)) return true;

    // Check for repeated characters
    const repeatedPattern = /(.)\1{4,}/;
    if (repeatedPattern.test(message)) return true;

    return false;
  }

  /**
   * Get 1947 appropriate offline message
   */
  static getOfflineMessage(characterName: string, reason: string): string {
    const messages = [
      `${characterName} appears to be quite offended and has stepped away from the conversation.`,
      `${characterName} seems to need a moment to compose themselves after that inappropriate remark.`,
      `${characterName} has excused themselves from the conversation due to improper conduct.`,
      `${characterName} looks quite shocked and has withdrawn from our discussion.`,
      `${characterName} appears to be gathering their thoughts after that remark.`,
      `${characterName} is not going to cooperate with this kind of behavior or conversation.`,
      `${characterName} refuses to continue this interrogation under such circumstances.`,
      `${characterName} finds this manner of questioning quite inappropriate and will not participate.`,
      `${characterName} has decided not to cooperate with this line of questioning.`,
      `${characterName} will not engage in this kind of inappropriate interrogation.`
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * Get 1947 appropriate return message
   */
  static getReturnMessage(characterName: string): string {
    const messages = [
      `${characterName} has returned, looking more composed and ready to continue our investigation.`,
      `${characterName} rejoins the conversation, appearing to have regained their composure.`,
      `${characterName} returns, looking ready to resume our professional discussion.`,
      `${characterName} is back and appears ready to continue with the investigation.`,
      `${characterName} rejoins us, looking more settled and ready to proceed.`
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }
}
