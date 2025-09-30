# Manual AWS Deployment Guide

## Option 1: AWS Console Deployment (Easiest)

1. **Go to AWS S3 Console**: https://s3.console.aws.amazon.com/
2. **Create Bucket**:
   - Name: `blackwood-manor-chat-[your-name]`
   - Region: `us-west-2`
   - Uncheck "Block all public access"
3. **Upload Files**:
   - Upload entire `out` folder contents to bucket root
4. **Enable Static Website Hosting**:
   - Properties → Static website hosting → Enable
   - Index document: `index.html`
   - Error document: `404.html`
5. **Set Bucket Policy**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
       }
     ]
   }
   ```

## Option 2: AWS Amplify (Recommended)

1. **Go to AWS Amplify Console**: https://console.aws.amazon.com/amplify/
2. **Deploy without Git**:
   - Choose "Deploy without Git provider"
   - Upload the `out` folder as ZIP
   - App name: `blackwood-manor-chat`
3. **Configure Build Settings**:
   - Use the provided `amplify.yml` file
4. **Deploy**: Click Deploy

## Widget Integration

Once deployed, your widget will be available at:
- S3: `http://your-bucket-name.s3-website-us-west-2.amazonaws.com/widget-demo`
- Amplify: `https://your-app-id.amplifyapp.com/widget-demo`

## Embed in Your Game

```html
<iframe 
  src="https://your-deployed-url/widget-demo" 
  width="400" 
  height="600"
  style="border:none; border-radius:12px; box-shadow:0 8px 32px rgba(0,0,0,0.3);">
</iframe>
```

## API Integration

```javascript
// Widget API for your game
window.addEventListener('message', (event) => {
  if (event.data.type === 'BLACKWOOD_EVENT') {
    console.log('Widget event:', event.data);
    // Handle widget events in your game
  }
});

// Send commands to widget
document.querySelector('iframe').contentWindow.postMessage({
  type: 'SELECT_CHARACTER',
  characterId: 'james'
}, '*');
```