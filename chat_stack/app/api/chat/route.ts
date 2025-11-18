import { NextRequest, NextResponse } from 'next/server';
import { GoogleAI } from '@/lib/api';
import { characters } from '@/lib/characters';
import { Message } from '@/lib/types';

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
    const {
      character,
      characterId,
      message,
      conversationHistory = [],
      context
    } = await request.json();

    const resolvedCharacterId = characterId || character;

    // Validate character id early
    if (!resolvedCharacterId) {
      return NextResponse.json(
        { success: false, error: 'Character id is required' },
        { status: 400 }
      );
    }

    // Validate message
    const normalizedMessage = typeof message === 'string' ? message.trim() : '';
    if (!normalizedMessage) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    if (normalizedMessage.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Message exceeds 500 characters' },
        { status: 400 }
      );
    }

    // Sanitize conversation history to prevent malformed payloads
    const sanitizedHistory: Message[] = Array.isArray(conversationHistory)
      ? conversationHistory
          .filter((entry: any) => typeof entry?.content === 'string')
          .slice(-10)
          .map((entry: any, index: number) => ({
            id: typeof entry?.id === 'string' ? entry.id : `history-${resolvedCharacterId}-${index}-${Date.now()}`,
            characterId: typeof entry?.characterId === 'string' ? entry.characterId : resolvedCharacterId,
            content: String(entry.content).slice(0, 500),
            timestamp: entry?.timestamp ? new Date(entry.timestamp) : new Date(),
            type: entry?.type === 'user' ? 'user'
              : entry?.type === 'system' ? 'system'
              : 'character',
          }))
      : [];

    const safeContext = context && typeof context === 'object' && !Array.isArray(context)
      ? { ...context }
      : null;

    // Find the character
    const selectedCharacter = characters.find(c => c.id === resolvedCharacterId);
    if (!selectedCharacter) {
      return NextResponse.json(
        { success: false, error: 'Character not found' },
        { status: 404 }
      );
    }

    // Generate response using the existing API
    const response = await GoogleAI.generateCharacterResponse(
      selectedCharacter,
      normalizedMessage,
      sanitizedHistory,
      safeContext || {
        currentTopic: 'general',
        investigationProgress: 0,
        relationshipScore: 0,
        revealedInformation: []
      }
    );

    if (response.success) {
      const normalizedResponse = GoogleAI.extractResponseText(response).trim();

      // Ensure we have a valid response text
      if (normalizedResponse && normalizedResponse.length > 0 && normalizedResponse !== "I'm not sure how to respond to that.") {
        return NextResponse.json({
          success: true,
          response: normalizedResponse,
          raw: response.data
        }, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
            'Access-Control-Allow-Credentials': 'false',
          },
        });
      } else {
        console.error('Chat API: Extracted response is empty or invalid', {
          normalizedResponse,
          hasData: !!response.data,
          responseKeys: response.data ? Object.keys(response.data) : []
        });
      }
    }

    // If we get here, the response failed or was invalid
    console.error('Chat API: Response generation failed', {
      success: response.success,
      error: response.error,
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : []
    });

    return NextResponse.json({
      success: false,
      error: response.error || 'Failed to generate response. Please check your API key configuration.'
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'false',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
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
