import { NextRequest, NextResponse } from 'next/server';
import { characters } from '@/lib/characters';

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
    const { character, message, conversationHistory } = await request.json();

    // Find the character
    const selectedCharacter = characters.find(c => c.id === character);
    if (!selectedCharacter) {
      return NextResponse.json(
        { success: false, error: 'Character not found' },
        { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
            'Access-Control-Allow-Credentials': 'false',
          },
        }
      );
    }

    // Generate fallback responses based on character personality
    const fallbackResponses = {
      'james-blackwood': [
        "I... I don't know what you're talking about. Victoria and I had our differences, but I would never hurt her.",
        "The family business has been struggling, but that doesn't make me a killer.",
        "I was in my study all night. You can ask the staff if you don't believe me.",
        "Victoria always had secrets. Maybe you should look into her business dealings instead."
      ],
      'marcus-reynolds': [
        "I have nothing to hide. Victoria and I had a professional relationship, nothing more.",
        "The company's financial troubles are well-documented. I had no reason to harm Victoria.",
        "I was working late in the office. The security cameras will confirm that.",
        "Victoria was a shrewd businesswoman. Her enemies were in the corporate world, not here."
      ],
      'elena-rodriguez': [
        "As Victoria's doctor, I can only say that she was in good health until... until this happened.",
        "Medical confidentiality prevents me from discussing Victoria's condition in detail.",
        "I was at the hospital all night. You can verify that with the staff.",
        "Victoria trusted me with her health. I would never betray that trust."
      ],
      'lily-chen': [
        "Aunt Victoria was always kind to me. I can't imagine who would want to hurt her.",
        "I was working on my art in the studio. Art helps me process difficult emotions.",
        "Victoria understood my struggles. She was one of the few people who did.",
        "The family dynamics were complicated, but I never wished harm on anyone."
      ],
      'thompson-butler': [
        "I've served the Blackwood family for decades. I would never harm Miss Victoria.",
        "I was in the kitchen preparing for the next day. The staff can confirm this.",
        "Miss Victoria was like family to me. This whole situation is devastating.",
        "I know the house better than anyone. If there were any irregularities, I would have noticed."
      ]
    };

    // Get character responses
    const responses = fallbackResponses[character as keyof typeof fallbackResponses] || [
      "I'm not sure what you're asking about.",
      "That's an interesting question.",
      "I don't have much to say about that.",
      "You'll have to ask someone else about that."
    ];

    // Select response based on message content or random
    let selectedResponse;
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('alibi') || messageLower.includes('where were you')) {
      selectedResponse = responses.find(r => r.includes('night') || r.includes('evening')) || responses[0];
    } else if (messageLower.includes('motive') || messageLower.includes('why')) {
      selectedResponse = responses.find(r => r.includes('reason') || r.includes('never')) || responses[1];
    } else if (messageLower.includes('relationship') || messageLower.includes('victoria')) {
      selectedResponse = responses.find(r => r.includes('Victoria')) || responses[2];
    } else {
      // Random response
      selectedResponse = responses[Math.floor(Math.random() * responses.length)];
    }

    return NextResponse.json({
      success: true,
      response: selectedResponse
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'false',
      },
    });

  } catch (error) {
    console.error('Fallback Chat API error:', error);
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
