# Character Offline System

## Overview

The Character Offline System is a sophisticated feature that makes character interactions more natural and realistic by temporarily putting characters offline when users ask inappropriate questions or use abusive language. This system enhances immersion by mimicking how real people would react to inappropriate behavior in 1947.

## 🎯 Key Features

### 1. **Abuse Detection**
- Detects inappropriate language and profanity
- Identifies irrelevant questions not related to the investigation
- Uses 1947-appropriate sensitivity levels
- Categorizes severity levels (low, medium, high)

### 2. **Automatic Offline Status**
- Characters go offline for 40-60 seconds based on severity
- Visual indicators show offline status in real-time
- Characters become unresponsive during offline period
- Automatic return to online status after cooldown

### 3. **1947 Authentic Responses**
- Period-appropriate language and expressions
- Formal, respectful responses even when offended
- Character-specific reactions based on their personality
- Natural offline and return messages

### 4. **Visual Feedback**
- Red offline indicators on character cards
- Countdown timer showing time until return
- Disabled chat input when character is offline
- Tooltips explaining offline reasons

## 🚀 How It Works

### Detection Process

```typescript
// 1. User sends message
const message = "You're an idiot!";

// 2. System detects abuse
const detection = AbuseDetectionSystem.detectAbuse(message);
// Result: { isAbusive: true, severity: 'medium', reason: 'Inappropriate language detected' }

// 3. Character goes offline
CharacterStatusManager.setCharacterOffline(
  characterId,
  detection.reason,
  detection.suggestedResponse,
  45 // seconds
);

// 4. Visual feedback updates
// - Character card shows red offline indicator
// - Chat input becomes disabled
// - Countdown timer appears
```

### Offline Duration by Severity

| Severity | Duration | Example Triggers |
|----------|----------|------------------|
| **Low** | 40 seconds | Mild inappropriate language |
| **Medium** | 45 seconds | Moderate abuse or irrelevant questions |
| **High** | 60 seconds | Severe profanity or threats |

## 📋 Detected Content Types

### Abusive Language (1947 Appropriate)
- **Mild**: "damn", "hell", "bloody", "confound"
- **Moderate**: "idiot", "moron", "stupid", "shut up"
- **Severe**: "bastard", "bitch", threats, personal attacks

### Irrelevant Questions
- **Modern Technology**: computers, internet, social media, phones
- **Modern Concepts**: COVID, climate change, modern politics
- **Personal Questions**: age, appearance, relationship status
- **Off-topic**: weather, jokes, entertainment, general chat

### Appropriate Investigation Topics
- Victoria's murder and investigation details
- Character relationships and alibis
- Timeline and location questions
- Evidence and clues discussion
- Family and business matters

## 🎨 Visual Indicators

### Character Cards
```typescript
// Online Status
<div className="w-3 h-3 bg-green-500 rounded-full">
  <Wifi className="w-3 h-3 text-green-400" />
  <span>Online</span>
</div>

// Offline Status
<div className="w-3 h-3 bg-red-500 rounded-full">
  <WifiOff className="w-3 h-3 text-red-400" />
  <span>Offline (45s)</span>
</div>
```

### Chat Input
- **Online**: Normal amber styling, enabled
- **Offline**: Red border, disabled, offline indicator
- **Countdown**: Shows remaining time until character returns

## 💬 Character Responses

### Offline Messages (Examples)
- "I must say, Detective Chen, such language is quite unacceptable. I shall not continue this conversation."
- "Goodness gracious! I cannot believe you would speak to me in such a manner. This is quite shocking."
- "I should say, Detective Chen, that question is not relevant to our investigation into Victoria's death."

### Return Messages (Examples)
- "Thompson has returned, looking more composed and ready to continue our investigation."
- "James Blackwood rejoins the conversation, appearing to have regained their composure."
- "Elena Rodriguez is back and appears ready to continue with the investigation."

## 🔧 Technical Implementation

### Core Files
- `lib/abuseDetection.ts` - Abuse and relevance detection logic
- `lib/characterStatus.ts` - Offline status management
- `components/CharacterCard.tsx` - Visual offline indicators
- `components/ChatInput.tsx` - Offline input handling
- `hooks/useChat.ts` - Integration with chat system

### Key Classes

#### AbuseDetectionSystem
```typescript
class AbuseDetectionSystem {
  static detectAbuse(message: string): AbuseDetectionResult
  static isNonsensical(message: string): boolean
  static getOfflineMessage(characterName: string, reason: string): string
  static getReturnMessage(characterName: string): string
}
```

#### CharacterStatusManager
```typescript
class CharacterStatusManager {
  static isCharacterOnline(characterId: string): boolean
  static setCharacterOffline(characterId: string, reason: string, message: string, duration: number): void
  static getTimeUntilOnline(characterId: string): number
  static getOfflineReason(characterId: string): string
}
```

## 🎭 1947 Authenticity

### Language Guidelines
- **Formal Address**: "Detective Chen", "Madam", "Sir"
- **Period Expressions**: "I should say", "quite so", "indeed", "I beg your pardon"
- **1947 Slang**: "swell", "keen", "gee whiz", "goodness gracious"
- **Social Context**: Respect for authority, formal etiquette, class awareness

### Character Reactions
- **Thompson (Butler)**: Highly formal, shocked by any impropriety
- **James Blackwood**: Upper-class indignation, proper decorum
- **Elena Rodriguez**: Professional but firm boundaries
- **Marcus Reynolds**: Direct but respectful responses
- **Lily Chen**: Gentle but clear about appropriate behavior

## 🧪 Testing

### Test Scenarios
1. **Abusive Language**: Test various levels of inappropriate language
2. **Irrelevant Questions**: Ask about modern topics, personal matters
3. **Appropriate Questions**: Investigation-related queries
4. **Offline Recovery**: Verify characters return after cooldown
5. **Visual Feedback**: Check all UI indicators work correctly

### Test Command
```bash
node test-offline-system.js
```

## 🎯 Benefits

### For Players
- **Immersive Experience**: Characters react realistically to inappropriate behavior
- **Educational**: Learn about 1947 social norms and etiquette
- **Guidance**: Clear feedback on appropriate vs inappropriate questions
- **Realism**: Characters have boundaries and consequences

### For Investigation
- **Focus**: Encourages players to ask relevant questions
- **Authenticity**: Maintains 1947 setting and character consistency
- **Engagement**: Adds dynamic element to character interactions
- **Roleplay**: Enhances detective role-playing experience

## 🔮 Future Enhancements

### Potential Features
- **Trust System**: Characters remember past inappropriate behavior
- **Escalation**: Longer offline periods for repeated offenses
- **Character-Specific**: Different tolerance levels per character
- **Learning**: AI adapts to player's communication style
- **Statistics**: Track player behavior patterns

### Configuration Options
- Adjustable offline durations
- Customizable abuse detection sensitivity
- Character-specific response styles
- Optional system activation/deactivation

## 📝 Usage Examples

### Appropriate Questions ✅
- "Where were you when Victoria was killed?"
- "What was your relationship with Victoria?"
- "Did you see anything suspicious last night?"
- "Can you tell me about the business arrangements?"

### Inappropriate Questions ❌
- "What's your favorite movie?" (Irrelevant)
- "You're an idiot!" (Abusive)
- "How old are you?" (Personal)
- "Tell me about computers" (Modern technology)

### Result
- **Appropriate**: Character responds normally, stays online
- **Inappropriate**: Character goes offline for 40-60 seconds with period-appropriate response

---

This system creates a more immersive and educational experience while maintaining the authentic 1947 setting of the Blackwood Manor murder mystery investigation.
