import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'false',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // For now, return a simple fallback response
    // In a real implementation, this would call Claude API directly
    const fallbackResponse: {
      isAbusive: boolean;
      isIrrelevant: boolean;
      severity: string;
      confidence: number;
      reason: string;
      detectedIntent: string;
      suggestedResponse?: string;
    } = {
      isAbusive: false,
      isIrrelevant: false,
      severity: 'low',
      confidence: 60,
      reason: 'Using fallback detection',
      detectedIntent: 'Fallback analysis'
    };

    // Enhanced fallback detection for obvious abuse
    const lowerMessage = message.toLowerCase().trim();
    
    // More comprehensive abuse detection with word boundary matching
    const obviousAbuse = [
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
    
    if (isObviousAbuse) {
      fallbackResponse.isAbusive = true;
      fallbackResponse.severity = 'medium';
      fallbackResponse.confidence = 80;
      fallbackResponse.reason = 'Obvious abusive language detected';
      fallbackResponse.detectedIntent = 'Direct insult to character';
      fallbackResponse.suggestedResponse = 'I must say, Detective Chen, such language is quite unacceptable.';
      
      // Add debug info
      console.log('Abuse detected:', {
        message: lowerMessage,
        detected: true,
        confidence: 80
      });
    } else {
      console.log('No abuse detected:', {
        message: lowerMessage,
        detected: false,
        confidence: 60
      });
    }

    return NextResponse.json({
      success: true,
      data: fallbackResponse
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'false',
      },
    });

  } catch (error) {
    console.error('Abuse detection API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Allow-Credentials': 'false',
        },
      }
    );
  }
}
