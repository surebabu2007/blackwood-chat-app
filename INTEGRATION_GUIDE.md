# 🎮 Game Integration Guide

## Overview
This chatbot system is designed for seamless integration into your murder mystery game. It provides individual character interactions that can be triggered from specific game locations or scenarios.

## 🚀 Quick Integration

### 1. **Standalone Character Chat**
```typescript
// Import the chat system
import { useChat } from '@/hooks/useChat';
import { CharacterSelector } from '@/components/CharacterSelector';
import { ChatContainer } from '@/components/ChatContainer';
import { ChatInput } from '@/components/ChatInput';

// Use in your game component
const GameScene = () => {
  const { currentCharacter, messages, sendMessage, selectCharacter } = useChat();
  
  return (
    <div className="chat-overlay">
      <CharacterSelector 
        characters={availableCharacters}
        onCharacterSelect={selectCharacter}
      />
      <ChatContainer messages={messages} />
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
};
```

### 2. **Individual Character Interaction**
```typescript
// For specific character encounters
const CharacterEncounter = ({ characterId }: { characterId: string }) => {
  const { selectCharacter, sendMessage, messages } = useChat();
  
  useEffect(() => {
    // Auto-select character when encounter starts
    const character = characters.find(c => c.id === characterId);
    if (character) selectCharacter(character);
  }, [characterId]);
  
  return (
    <div className="character-chat">
      <ChatContainer messages={messages} />
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
};
```

## 🎯 Integration Patterns

### **Pattern 1: Location-Based Chat**
- Trigger chat when player enters specific rooms
- Each room has specific characters available
- Context-aware conversations based on location

### **Pattern 2: Story-Triggered Chat**
- Chat appears during cutscenes or story moments
- Pre-selected character based on story context
- Conversation affects story progression

### **Pattern 3: Investigation Mode**
- Full investigation panel with all characters
- Evidence collection and case tracking
- Progress-based character availability

## 🔧 Configuration Options

### **Environment Variables**
```bash
# Copy env.example to .env.local
cp env.example .env.local

# Configure your API settings
NEXT_PUBLIC_API_BASE_URL=your_api_endpoint
NEXT_PUBLIC_API_TOKEN=your_token
NEXT_PUBLIC_DETECTIVE_NAME=Detective Sarah Chen
```

### **Character Customization**
```typescript
// Modify character data in lib/characters.ts
export const characters: Character[] = [
  {
    id: 'custom-character',
    name: 'Custom Character',
    role: 'Custom Role',
    // ... other properties
  }
];
```

## 🎨 Styling Integration

### **CSS Custom Properties**
```css
:root {
  --chat-bg: #0d1117;
  --chat-text: #ffffff;
  --chat-accent: #3b82f6;
  --character-james: #eab308;
  --character-elena: #ef4444;
  /* ... other character colors */
}
```

### **Theme Integration**
- Dark theme optimized for mystery atmosphere
- Character-specific color schemes
- Responsive design for all screen sizes
- Custom animations and transitions

## 🔌 API Integration

### **Custom API Endpoint**
```typescript
// Modify lib/api.ts for your API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const BEARER_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;
```

### **Response Format**
The system expects API responses in this format:
```typescript
{
  success: boolean;
  data: {
    data: {
      output: {
        message: {
          content: [{ text: string }]
        }
      }
    }
  }
}
```

## 📱 Mobile Integration

### **Responsive Design**
- Mobile-first approach
- Touch-friendly interactions
- Optimized for game overlays
- Gesture support

### **Mobile-Specific Features**
- Swipe gestures for character selection
- Touch-optimized input
- Mobile keyboard handling
- Viewport management

## 🎮 Game State Integration

### **State Management**
```typescript
// Access game state
const { gameState, investigationState } = useChatStore();

// Update game progress
updateGameState({
  investigationProgress: 50,
  evidenceCollected: ['clue1', 'clue2']
});
```

### **Character Memory**
- Persistent conversation history
- Character relationship tracking
- Emotional state management
- Trust level progression

## 🔒 Security Considerations

### **API Security**
- Bearer token authentication
- Request timeout handling
- Error message sanitization
- Input validation

### **Data Privacy**
- Local storage for conversations
- No sensitive data in URLs
- Secure API communication
- User data protection

## 🚀 Performance Optimization

### **Code Splitting**
- Lazy loading of components
- Dynamic imports for heavy features
- Optimized bundle size
- Fast initial load

### **Caching Strategy**
- Conversation history caching
- Character data persistence
- API response caching
- Image optimization

## 🐛 Debugging & Testing

### **Development Tools**
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### **Debug Features**
- Console logging for API calls
- Error boundary components
- Development-only debug panels
- Performance monitoring

## 📊 Analytics Integration

### **Event Tracking**
```typescript
// Track character interactions
const trackCharacterInteraction = (characterId: string, action: string) => {
  // Your analytics implementation
  analytics.track('character_interaction', {
    character: characterId,
    action: action,
    timestamp: Date.now()
  });
};
```

## 🎯 Best Practices

### **1. Character Selection**
- Always validate character availability
- Provide clear visual feedback
- Handle edge cases gracefully

### **2. Message Handling**
- Validate input length and content
- Provide loading states
- Handle API errors gracefully

### **3. State Management**
- Use consistent naming conventions
- Implement proper error boundaries
- Handle state persistence correctly

### **4. Performance**
- Optimize re-renders
- Use proper memoization
- Implement lazy loading

## 🔄 Migration Guide

### **From Basic Chat to Full Integration**
1. Start with individual character components
2. Add state management layer
3. Implement API integration
4. Add advanced features gradually
5. Test thoroughly at each step

## 📞 Support

For integration support or custom modifications:
- Check the documentation
- Review the example implementations
- Test with the provided sample data
- Customize according to your game's needs

---

**Ready to integrate?** Start with the basic character chat pattern and expand from there! 🎮✨
