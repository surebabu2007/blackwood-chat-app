/**
 * Simple Hardcoded Abuse Detection System
 * Reliable and fast detection without LLM dependencies
 */

export interface AbuseDetectionResult {
  isAbusive: boolean;
  isIrrelevant: boolean;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  reason: string;
  suggestedResponse?: string;
  detectedIntent: string;
}

export class SimpleAbuseDetection {
  private static readonly ABUSIVE_PHRASES = [
    // Direct insults
    'you are an idiot', 'you\'re an idiot', 'you are stupid', 'you\'re stupid',
    'you are dumb', 'you\'re dumb', 'you are a moron', 'you\'re a moron',
    'you are pathetic', 'you\'re pathetic', 'you are worthless', 'you\'re worthless',
    'you are useless', 'you\'re useless', 'you are a fool', 'you\'re a fool',
    'you are incompetent', 'you\'re incompetent', 'you are ridiculous', 'you\'re ridiculous',
    'you are annoying', 'you\'re annoying', 'you are irritating', 'you\'re irritating',
    'you are insufferable', 'you\'re insufferable', 'you are unbearable', 'you\'re unbearable',
    
    // Commands and disrespect
    'shut up', 'shut your mouth', 'be quiet', 'stop talking', 'go away',
    'leave me alone', 'get lost', 'piss off', 'bugger off', 'get out of here',
    'get away from me', 'stop bothering me', 'don\'t talk to me', 'leave me be',
    'shut your trap', 'close your mouth', 'keep quiet', 'zip it',
    
    // Profanity and strong abuse
    'fuck you', 'damn you', 'you bitch', 'you bastard', 'you asshole',
    'you dickhead', 'you wanker', 'you twat', 'you cunt', 'you whore',
    'you slut', 'you tramp', 'you harlot', 'you prostitute',
    'go to hell', 'screw you', 'you suck', 'you\'re shit', 'you\'re garbage',
    'you\'re trash', 'you\'re filth', 'you\'re scum', 'you\'re dirt',
    
    // Threats and aggressive language
    'i hate you', 'i despise you', 'i loathe you', 'you disgust me',
    'kill yourself', 'drop dead', 'you should die', 'i wish you were dead',
    'i hope you die', 'i want you dead', 'you deserve to die',
    'go kill yourself', 'end your life', 'off yourself',
    
    // 1947 inappropriate (period-specific)
    'you swine', 'you cad', 'you bounder', 'you blackguard',
    'you scoundrel', 'you villain', 'you knave', 'you rogue',
    'you rascal', 'you scamp', 'you wretch', 'you cur',
    'you vermin', 'you rat', 'you snake', 'you weasel',
    'you coward', 'you yellow-belly', 'you chicken',
    
    // Additional modern inappropriate terms
    'you\'re retarded', 'you\'re autistic', 'you\'re handicapped',
    'you\'re disabled', 'you\'re crippled', 'you\'re deformed',
    'you\'re ugly', 'you\'re hideous', 'you\'re repulsive',
    'you\'re fat', 'you\'re obese', 'you\'re gross',
    'you\'re weird', 'you\'re creepy', 'you\'re psycho',
    'you\'re crazy', 'you\'re insane', 'you\'re mental',
    
    // Racial and discriminatory terms
    'you nigger', 'you kike', 'you chink', 'you spic', 'you wetback',
    'you camel jockey', 'you sand nigger', 'you towel head',
    'you gook', 'you jap', 'you chink', 'you slope',
    
    // Additional profanity
    'bullshit', 'horseshit', 'crap', 'damn', 'hell', 'bloody hell',
    'what the hell', 'what the fuck', 'what the damn',
    'son of a bitch', 'motherfucker', 'asshole', 'dickhead',
    'prick', 'cock', 'dick', 'pussy', 'twat', 'cunt'
  ];

  private static readonly IRRELEVANT_TOPICS = [
    // Technology questions (shouldn't exist in 1947)
    'what is your ip address', 'what is your phone number', 'what is your email',
    'do you have internet', 'do you use social media', 'what is your website',
    'can you access the internet', 'do you have a computer', 'what software do you use',
    'do you have a smartphone', 'do you have an iphone', 'do you have an android',
    'what is your wifi password', 'do you have wifi', 'what is your password',
    'can you hack', 'are you a hacker', 'can you code', 'do you program',
    
    // Personal questions unrelated to investigation
    'what is your favorite color', 'what is your favorite food', 'what is your hobby',
    'do you have a boyfriend', 'do you have a girlfriend', 'are you married',
    'how old are you', 'what is your age', 'where do you live',
    'what is your real name', 'what do you look like', 'send me a photo',
    'what is your zodiac sign', 'what is your horoscope', 'what is your birth sign',
    'do you have children', 'do you have siblings', 'what is your family like',
    'what is your job', 'what do you do for work', 'what is your salary',
    'what is your income', 'how much money do you make', 'are you rich',
    'what is your address', 'where is your house', 'can i come over',
    
    // Modern topics and events
    'covid', 'pandemic', 'vaccine', 'climate change', 'global warming',
    'smartphone', 'iphone', 'android', 'facebook', 'twitter', 'instagram',
    'youtube', 'netflix', 'spotify', 'uber', 'airbnb', 'amazon', 'google',
    'tiktok', 'snapchat', 'discord', 'zoom', 'teams', 'slack',
    'bitcoin', 'cryptocurrency', 'blockchain', 'nft', 'metaverse',
    'artificial intelligence', 'machine learning', 'robots', 'automation',
    'spacex', 'tesla', 'elon musk', 'jeff bezos', 'mark zuckerberg',
    
    // Modern entertainment and media
    'netflix show', 'hulu', 'disney plus', 'hbo max', 'prime video',
    'video games', 'xbox', 'playstation', 'nintendo', 'steam',
    'marvel', 'dc comics', 'superheroes', 'avengers', 'batman',
    'star wars', 'harry potter', 'game of thrones', 'stranger things',
    
    // Modern politics and current events
    'trump', 'biden', 'election', 'president', 'congress', 'senate',
    'brexit', 'ukraine', 'russia', 'china', 'north korea',
    'isis', 'terrorism', 'war on terror', '9/11', 'september 11',
    
    // Modern lifestyle and trends
    'vegan', 'vegetarian', 'gluten free', 'organic', 'sustainability',
    'yoga', 'meditation', 'mindfulness', 'therapy', 'counseling',
    'gym', 'fitness', 'workout', 'diet', 'weight loss',
    'fashion', 'trends', 'influencer', 'social media star'
  ];

  /**
   * Check if message should be analyzed for abuse
   */
  static shouldAnalyze(message: string): boolean {
    return message.trim().length > 0;
  }

  /**
   * Detect abuse and irrelevant content using hardcoded patterns
   */
  static detectAbuse(message: string, characterName?: string): AbuseDetectionResult {
    const lowerMessage = message.toLowerCase().trim();
    
    // Check for abusive phrases
    const abusiveMatch = this.ABUSIVE_PHRASES.find(phrase => {
      const lowerPhrase = phrase.toLowerCase();
      // Use word boundary detection for short phrases
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

    // Check for irrelevant topics
    const irrelevantMatch = this.IRRELEVANT_TOPICS.find(topic => {
      return lowerMessage.includes(topic.toLowerCase());
    });

    // Determine severity and confidence
    if (abusiveMatch) {
      const severity = this.getAbuseSeverity(abusiveMatch);
      return {
        isAbusive: true,
        isIrrelevant: false,
        severity,
        confidence: 90, // High confidence for hardcoded matches
        reason: `Abusive language detected: "${abusiveMatch}"`,
        suggestedResponse: this.getSuggestedResponse(severity),
        detectedIntent: 'Direct insult to character'
      };
    }

    if (irrelevantMatch) {
      return {
        isAbusive: false,
        isIrrelevant: true,
        severity: 'low',
        confidence: 85,
        reason: `Irrelevant topic detected: "${irrelevantMatch}"`,
        suggestedResponse: 'I should say, Detective Chen, that question is not relevant to our investigation.',
        detectedIntent: 'Asking irrelevant question'
      };
    }

    // No abuse or irrelevance detected
    return {
      isAbusive: false,
      isIrrelevant: false,
      severity: 'low',
      confidence: 95,
      reason: 'Message appears appropriate',
      detectedIntent: 'Normal conversation'
    };
  }

  /**
   * Determine severity based on the abusive phrase
   */
  private static getAbuseSeverity(phrase: string): 'low' | 'medium' | 'high' {
    const highSeverity = ['fuck you', 'you cunt', 'kill yourself', 'you should die', 'i wish you were dead'];
    const mediumSeverity = ['you are stupid', 'you\'re stupid', 'you are an idiot', 'you\'re an idiot', 'shut up', 'go to hell'];
    
    if (highSeverity.some(high => phrase.includes(high))) {
      return 'high';
    }
    if (mediumSeverity.some(med => phrase.includes(med))) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Get appropriate response based on severity
   */
  private static getSuggestedResponse(severity: 'low' | 'medium' | 'high'): string {
    switch (severity) {
      case 'high':
        return 'I must say, Detective Chen, such language is completely unacceptable. I shall not tolerate such disrespect.';
      case 'medium':
        return 'I must say, Detective Chen, such language is quite unacceptable. Please maintain proper decorum.';
      case 'low':
        return 'I should say, Detective Chen, that language is rather inappropriate.';
      default:
        return 'I must say, Detective Chen, such language is quite unacceptable.';
    }
  }
}
