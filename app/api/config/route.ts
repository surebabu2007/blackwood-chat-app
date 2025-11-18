import { NextResponse } from 'next/server';

/**
 * Diagnostic endpoint to check API configuration
 * This helps diagnose missing environment variables in Vercel
 * 
 * WARNING: This endpoint should be removed or protected in production
 * as it exposes configuration status
 */
export async function GET() {
  const hasApiKey = Boolean(
    process.env.AI_SERVICE_API_KEY || 
    process.env.GOOGLE_API_KEY
  );
  
  const apiKeySource = process.env.AI_SERVICE_API_KEY 
    ? 'AI_SERVICE_API_KEY' 
    : process.env.GOOGLE_API_KEY 
    ? 'GOOGLE_API_KEY' 
    : 'NONE';
  
  const apiKeyPrefix = (process.env.AI_SERVICE_API_KEY || process.env.GOOGLE_API_KEY || '').substring(0, 8);
  const apiKeyLength = (process.env.AI_SERVICE_API_KEY || process.env.GOOGLE_API_KEY || '').length;
  
  return NextResponse.json({
    status: hasApiKey ? 'configured' : 'missing',
    message: hasApiKey 
      ? 'API key is configured' 
      : 'API key is MISSING - Set AI_SERVICE_API_KEY or GOOGLE_API_KEY in Vercel environment variables',
    configuration: {
      hasApiKey,
      apiKeySource,
      apiKeyPrefix: hasApiKey ? `${apiKeyPrefix}...` : 'N/A',
      apiKeyLength: hasApiKey ? apiKeyLength : 0,
      apiBaseUrl: process.env.AI_SERVICE_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'default',
      model: process.env.AI_SERVICE_MODEL || 'gemini-2.0-flash',
      nodeEnv: process.env.NODE_ENV || 'not set'
    },
    instructions: hasApiKey 
      ? 'API is configured correctly' 
      : [
          '1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables',
          '2. Add AI_SERVICE_API_KEY with your Google API key value',
          '3. Make sure to select "Production" environment',
          '4. Redeploy your project',
          '5. Get your API key from: https://makersuite.google.com/app/apikey'
        ],
    timestamp: new Date().toISOString()
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

