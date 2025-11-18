# Troubleshooting Vercel Deployment

## Quick Checklist

- [ ] API key added in Vercel Environment Variables
- [ ] Environment variable set for **Production** environment
- [ ] Project **redeployed** after adding environment variable
- [ ] API key starts with `AIza...`
- [ ] No typos in variable name: `AI_SERVICE_API_KEY` or `GOOGLE_API_KEY`

## Test Your Deployment

### 1. Check Configuration
Visit: `https://your-app.vercel.app/api/config`

**Expected Response (if working):**
```json
{
  "status": "configured",
  "message": "API key is configured",
  "configuration": {
    "hasApiKey": true,
    "apiKeySource": "AI_SERVICE_API_KEY",
    ...
  }
}
```

**If API key is missing:**
```json
{
  "status": "missing",
  "message": "API key is MISSING - Set AI_SERVICE_API_KEY or GOOGLE_API_KEY in Vercel environment variables",
  "instructions": [...]
}
```

### 2. Test Health Endpoint
Visit: `https://your-app.vercel.app/api/health`

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Blackwood Manor Detective Chat is running",
  "timestamp": "...",
  "version": "1.0.0"
}
```

### 3. Test Chat API
Use curl or Postman:
```bash
curl -X POST https://your-app.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "characterId": "thompson-butler",
    "message": "Hello"
  }'
```

## Common Issues

### Issue: "API key not configured"
**Solution:**
1. Check Vercel → Settings → Environment Variables
2. Make sure variable name is exactly: `AI_SERVICE_API_KEY` or `GOOGLE_API_KEY`
3. Make sure it's enabled for **Production**
4. **Redeploy** after adding/updating

### Issue: API returns 404
**Solution:**
- Check that API routes exist in `/app/api/chat/route.ts`
- Verify Next.js build completed successfully
- Check Vercel build logs for errors

### Issue: API returns 500 error
**Solution:**
- Check Vercel function logs
- Verify API key is valid (starts with `AIza...`)
- Check Google API quota/limits

### Issue: Environment variable not detected
**Solution:**
- **MUST redeploy** after adding environment variables
- Old deployments don't have new environment variables
- Go to Deployments → Redeploy

## Verify Environment Variable in Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Check:
   - Variable name: `AI_SERVICE_API_KEY`
   - Value: Should start with `AIza...`
   - Environments: ✅ Production (and Preview if needed)
5. If missing or wrong → Edit → Save → **Redeploy**

## Still Not Working?

1. Check Vercel build logs for errors
2. Check Vercel function logs (Runtime tab)
3. Test `/api/config` endpoint to see what's detected
4. Verify API key is valid by testing it directly with Google API

