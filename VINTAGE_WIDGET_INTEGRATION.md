# 🕵️ Vintage Detective Chat Widgets - Integration Guide

## Overview

This guide provides comprehensive instructions for integrating vintage detective-themed chat widgets into your web-based games and applications. The widgets feature a beautiful sepia-toned, aged paper aesthetic perfect for mystery and detective games.

## 🎨 Widget Types

### 1. Unified Detective Widget
A comprehensive hub that allows users to select and chat with multiple characters.

### 2. Individual Character Widgets
Dedicated widgets for specific characters with unique styling and behaviors.

### 3. Single Chat Widget
A simple, focused chat interface for direct character interaction.

## 🚀 Quick Integration

### Basic HTML Integration

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detective Game</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/framer-motion@10/dist/framer-motion.js"></script>
    <script src="https://your-domain.com/widget-bundle.js"></script>
    <link href="https://your-domain.com/widget-styles.css" rel="stylesheet">
</head>
<body>
    <div id="detective-widget-root"></div>
    
    <script>
        const { UnifiedDetectiveWidget } = DetectiveWidget;
        
        ReactDOM.render(
            React.createElement(UnifiedDetectiveWidget, {
                position: 'bottom-right',
                theme: 'sepia',
                enableVoice: true,
                enableFileUpload: false,
                showCharacterSelector: true
            }),
            document.getElementById('detective-widget-root')
        );
    </script>
</body>
</html>
```

### React Integration

```tsx
import React from 'react';
import { UnifiedDetectiveWidget } from './components/UnifiedDetectiveWidget';

function App() {
  return (
    <div className="App">
      {/* Your game content */}
      
      <UnifiedDetectiveWidget
        position="bottom-right"
        theme="sepia"
        enableVoice={true}
        enableFileUpload={false}
        showCharacterSelector={true}
        onCharacterSelect={(character) => {
          console.log('Character selected:', character.name);
        }}
        onMessageSent={(message, characterId) => {
          console.log('Message sent:', message, 'to', characterId);
        }}
        onMessageReceived={(message, characterId) => {
          console.log('Message received:', message, 'from', characterId);
        }}
      />
    </div>
  );
}

export default App;
```

## 🎯 ElevenLabs Integration

The widgets support integration with ElevenLabs API for voice capabilities:

```tsx
<UnifiedDetectiveWidget
  apiKey="your-elevenlabs-api-key"
  agentId="your-agent-id"
  enableVoice={true}
  // ... other props
/>
```

### ElevenLabs Configuration

1. **Get API Key**: Sign up at [ElevenLabs](https://elevenlabs.io) and get your API key
2. **Create Agent**: Create a conversational AI agent in the ElevenLabs dashboard
3. **Configure Widget**: Use the agent ID in your widget configuration

### Widget Configuration Options

```typescript
interface WidgetConfig {
  apiKey?: string;              // ElevenLabs API key
  agentId?: string;             // ElevenLabs agent ID
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'sepia' | 'aged' | 'classic';
  enableVoice?: boolean;        // Enable voice input/output
  enableFileUpload?: boolean;   // Enable file uploads
  showCharacterSelector?: boolean;
  defaultCharacter?: string;    // Default character ID
  onCharacterSelect?: (character: Character) => void;
  onMessageSent?: (message: string, characterId: string) => void;
  onMessageReceived?: (message: string, characterId: string) => void;
}
```

## 🎨 Themes

### Sepia Theme
Classic detective aesthetic with warm amber tones and aged paper effects.

### Aged Theme
Vintage newspaper look with yellowed paper and brown accents.

### Classic Theme
Clean, professional detective style with gray tones.

## 📱 Responsive Design

The widgets are fully responsive and adapt to different screen sizes:

- **Desktop**: Full-featured interface with all controls
- **Tablet**: Optimized layout with touch-friendly controls
- **Mobile**: Compact interface with essential features

## 🎮 Game Integration Patterns

### 1. Location-Based Chat
```typescript
// Trigger chat when player enters specific rooms
const roomConfig = {
  'mansion_entrance': ['thompson-butler'],
  'study': ['james-blackwood', 'marcus-reynolds'],
  'library': ['elena-rodriguez'],
  'art_studio': ['lily-chen']
};

const triggerRoomChat = (roomId: string) => {
  const availableCharacters = roomConfig[roomId];
  if (availableCharacters) {
    // Show character selector with room-specific characters
  }
};
```

### 2. Story-Triggered Chat
```typescript
// Chat appears during cutscenes or story moments
const triggerStoryChat = (storyEvent: string, characterId: string) => {
  const character = characters.find(c => c.id === characterId);
  if (character) {
    // Show individual character widget
    setActiveWidget(<IndividualCharacterWidget character={character} />);
  }
};
```

### 3. Investigation Mode
```typescript
// Full investigation panel with all characters
const InvestigationMode = () => {
  return (
    <UnifiedDetectiveWidget
      showCharacterSelector={true}
      enableVoice={true}
      position="bottom-right"
      theme="sepia"
    />
  );
};
```

## 🔧 Customization

### Custom Styling

```css
/* Override vintage theme colors */
:root {
  --vintage-gold: #your-gold-color;
  --vintage-brown: #your-brown-color;
  --vintage-cream: #your-cream-color;
}

/* Custom character styling */
.character-james {
  border-color: #your-james-color;
}

.character-marcus {
  border-color: #your-marcus-color;
}
```

### Custom Characters

```typescript
const customCharacter: Character = {
  id: 'custom-character',
  name: 'Detective Smith',
  role: 'Lead Investigator',
  description: 'Experienced detective with keen intuition',
  personality: ['observant', 'methodical', 'intuitive'],
  primaryEmotions: ['focused', 'determined', 'analytical'],
  responsePatterns: {
    initial: "I've been expecting you. What can you tell me about the case?",
    defensive: "I need more evidence before making conclusions.",
    // ... other patterns
  },
  color: 'custom',
  avatar: '/images/characters/detective-smith.png',
  // ... other properties
};
```

## 🚀 Deployment

### Build for Production

```bash
# Install dependencies
npm install

# Build for production
npm run build

# The widget files will be in the dist/ directory
# - widget-bundle.js (JavaScript bundle)
# - widget-styles.css (Styles)
# - widget-assets/ (Images and other assets)
```

### CDN Integration

```html
<!-- Use CDN for faster loading -->
<script src="https://cdn.your-domain.com/detective-widgets/latest/widget-bundle.js"></script>
<link href="https://cdn.your-domain.com/detective-widgets/latest/widget-styles.css" rel="stylesheet">
```

## 🔒 Security Considerations

### API Key Management
- Never expose API keys in client-side code
- Use environment variables or secure configuration
- Implement proper authentication for API calls

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://unpkg.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.elevenlabs.io;
">
```

## 🐛 Troubleshooting

### Common Issues

1. **Widget not appearing**
   - Check if React and ReactDOM are loaded
   - Verify the widget bundle is accessible
   - Check browser console for errors

2. **Voice not working**
   - Verify ElevenLabs API key and agent ID
   - Check microphone permissions
   - Ensure HTTPS is enabled (required for voice)

3. **Styling issues**
   - Verify CSS file is loaded
   - Check for CSS conflicts with your existing styles
   - Ensure proper CSS specificity

### Debug Mode

```typescript
<UnifiedDetectiveWidget
  debug={true}  // Enable debug logging
  // ... other props
/>
```

## 📊 Performance Optimization

### Lazy Loading
```typescript
import { lazy, Suspense } from 'react';

const UnifiedDetectiveWidget = lazy(() => import('./components/UnifiedDetectiveWidget'));

function App() {
  return (
    <Suspense fallback={<div>Loading detective widget...</div>}>
      <UnifiedDetectiveWidget />
    </Suspense>
  );
}
```

### Code Splitting
The widgets are designed to be code-split friendly and only load necessary components when needed.

## 📞 Support

For support and questions:
- Check the demo page: `/widget-demo`
- Review the source code in `/components/`
- Test different configurations using the demo interface

## 🎯 Best Practices

1. **Performance**: Use lazy loading for widgets
2. **UX**: Provide clear instructions for users
3. **Accessibility**: Ensure keyboard navigation works
4. **Mobile**: Test on various devices and screen sizes
5. **Security**: Never expose sensitive API keys
6. **Error Handling**: Implement proper error boundaries

## 🚀 Future Enhancements

- Voice synthesis for character responses
- Advanced animation effects
- Custom character creation tools
- Multi-language support
- Advanced investigation tracking
- Integration with popular game engines

---

*Happy investigating! 🕵️‍♂️*
