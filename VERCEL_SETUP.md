# Vercel Deployment Setup Guide

## Required Environment Variables

You **MUST** set these environment variables in your Vercel project settings for the API to work:

### 1. Google API Key (REQUIRED)
```
AI_SERVICE_API_KEY=your_google_api_key_here
```
OR
```
GOOGLE_API_KEY=your_google_api_key_here
```

**Note:** The app will use `AI_SERVICE_API_KEY` if both are set.

### 2. Optional Configuration
```
AI_SERVICE_API_BASE_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
AI_SERVICE_MODEL=gemini-2.0-flash
```

### 3. Public Configuration (Optional)
```
NEXT_PUBLIC_API_BASE_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
NEXT_PUBLIC_GAME_TITLE=Blackwood Manor Investigation
NEXT_PUBLIC_DETECTIVE_NAME=Detective Sarah Chen
```

## How to Set Environment Variables in Vercel

1. **Go to your Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project: `blackwood-chat-app`

2. **Navigate to Settings**
   - Click on your project
   - Go to **Settings** tab
   - Click on **Environment Variables** in the left sidebar

3. **Add Environment Variables**
   - Click **Add New**
   - Enter the variable name (e.g., `AI_SERVICE_API_KEY`)
   - Enter the variable value (your Google API key)
   - Select environments: **Production**, **Preview**, and **Development** (or at least Production)
   - Click **Save**

4. **Redeploy**
   - After adding environment variables, you need to redeploy
   - Go to **Deployments** tab
   - Click the **⋯** (three dots) on the latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger a new deployment

## Verify API is Working

After deployment, test these endpoints:

1. **Health Check:**
   ```
   https://your-app.vercel.app/api/health
   ```
   Should return: `{"status":"ok","message":"Blackwood Manor Detective Chat is running",...}`

2. **Chat API:**
   ```
   POST https://your-app.vercel.app/api/chat
   ```
   Should accept POST requests with character and message data.

## Troubleshooting

### API Returns "API key not configured"
- **Solution:** Make sure `AI_SERVICE_API_KEY` or `GOOGLE_API_KEY` is set in Vercel environment variables
- **Check:** Go to Vercel → Settings → Environment Variables
- **Important:** After adding variables, you MUST redeploy

### API Returns 404
- **Solution:** Check that your API routes are in the correct location:
  - `/app/api/chat/route.ts` ✅
  - `/app/api/health/route.ts` ✅
  - `/app/api/chat-fallback/route.ts` ✅

### Build Succeeds but API Doesn't Work
- **Solution:** Environment variables might not be set for the correct environment
- **Check:** Make sure variables are set for **Production** environment
- **Action:** Redeploy after setting variables

### CORS Errors
- **Solution:** CORS headers are already configured in `next.config.js`
- **Check:** Verify headers are being sent in API responses

## Quick Setup Checklist

- [ ] Google API key obtained from https://makersuite.google.com/app/apikey
- [ ] `AI_SERVICE_API_KEY` set in Vercel environment variables
- [ ] Environment variables set for **Production** environment
- [ ] Project redeployed after setting variables
- [ ] Health endpoint tested: `/api/health`
- [ ] Chat endpoint tested: `/api/chat`

## Your Google API Key

If you need to find or create a new Google API key:
1. Visit: https://makersuite.google.com/app/apikey
2. Create a new API key or copy existing one
3. Add it to Vercel as `AI_SERVICE_API_KEY`

**Security Note:** Never commit your API key to Git. Always use environment variables.

