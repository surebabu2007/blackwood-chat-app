import { NextRequest, NextResponse } from 'next/server';
import { ClaudeAPI } from '@/lib/api';
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
        { status: 404 }
      );
    }

    // Generate response using the existing API
    const response = await ClaudeAPI.generateCharacterResponse(
      selectedCharacter,
      message,
      conversationHistory || [],
      {
        currentTopic: 'general',
        investigationProgress: 0,
        relationshipScore: 0,
        revealedInformation: []
      }
    );

    if (response.success && response.data?.choices?.[0]?.message?.content) {
      return NextResponse.json({
        success: true,
        response: response.data.choices[0].message.content
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Allow-Credentials': 'false',
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to generate response'
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Allow-Credentials': 'false',
        },
      });
    }
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
