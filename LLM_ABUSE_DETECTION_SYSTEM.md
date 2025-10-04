# LLM-Based Abuse Detection System

## 🎯 **Overview**

The LLM-Based Abuse Detection System is a sophisticated, context-aware solution that uses AI to intelligently detect inappropriate behavior in the 1947 Blackwood Manor murder mystery investigation. Unlike traditional keyword-based systems, this approach understands context, intent, and nuance to provide accurate abuse detection.

## ✨ **Key Features**

### 🧠 **Intelligent Context Understanding**
- **Intent Analysis**: Understands whether language is self-deprecating vs. directed abuse
- **Context Awareness**: Considers the 1947 setting and investigation context
- **Nuance Detection**: Distinguishes between expressions of frustration and direct insults
- **Confidence Scoring**: Uses confidence levels to prevent false positives

### 🎭 **1947 Authenticity**
- **Period-Appropriate Responses**: Generates authentic 1947 character reactions
- **Social Context**: Understands 1947 social norms and etiquette
- **Character-Specific**: Tailors responses to each character's personality
- **Historical Accuracy**: Maintains the murder mystery investigation setting

### 🔧 **Technical Excellence**
- **Fallback System**: Graceful degradation if LLM detection fails
- **Performance Optimized**: Only analyzes messages 3+ characters
- **High Confidence Threshold**: Requires 70%+ confidence to trigger offline
- **Error Handling**: Robust error handling with fallback detection

## 🚀 **How It Works**

### 1. **Message Analysis Process**
```typescript
// User sends message
const message = "My stupid question is...";

// System analyzes with LLM
const result = await LLMAbuseDetectionSystem.detectAbuse(message, characterName);

// Only acts on high confidence (70%+)
if (result.confidence >= 70 && (result.isAbusive || result.isIrrelevant)) {
  // Put character offline with appropriate response
}
```

### 2. **LLM Analysis Prompt**
The system uses a carefully crafted prompt that instructs the AI to:
- Analyze context and intent, not just individual words
- Consider 1947 social norms and investigation setting
- Distinguish between self-deprecating and directed abuse
- Provide confidence scores and detailed reasoning
- Generate period-appropriate character responses

### 3. **Confidence-Based Decisions**
- **70%+ Confidence**: Triggers offline status
- **Below 70%**: Allows message through (prevents false positives)
- **Fallback**: Uses basic detection if LLM fails

## 📋 **Detection Examples**

### ✅ **Won't Trigger Offline (Smart Detection)**

| Message | Analysis | Reason |
|---------|----------|---------|
| "My stupid question is..." | ✅ OK | Self-deprecating, not abusive |
| "I feel stupid asking this" | ✅ OK | Self-doubt, not directed at character |
| "Damn, this is confusing" | ✅ OK | Expression of frustration about situation |
| "Hell, I don't know what to think" | ✅ OK | Expression of confusion, not directed abuse |
| "This is a bloody mess" | ✅ OK | Comment about situation, not character |

### ❌ **Will Trigger Offline (Appropriate Detection)**

| Message | Analysis | Reason |
|---------|----------|---------|
| "You're stupid" | ❌ ABUSIVE | Direct insult to character |
| "You're an idiot" | ❌ ABUSIVE | Direct insult to character |
| "Damn you!" | ❌ ABUSIVE | Direct attack on character |
| "Shut up!" | ❌ ABUSIVE | Disrespectful command |
| "You're a bloody fool" | ❌ ABUSIVE | Direct insult with profanity |

### 🔍 **Investigation vs. Irrelevant**

| Message | Analysis | Reason |
|---------|----------|---------|
| "Where were you when Victoria was killed?" | ✅ RELEVANT | Investigation question |
| "What's your favorite color?" | ❌ IRRELEVANT | Personal question unrelated to investigation |
| "Tell me about Facebook" | ❌ IRRELEVANT | Modern technology unrelated to 1947 investigation |

## 🎭 **1947 Character Responses**

### **Thompson (Butler) - High Formality**
- **Low Severity**: "I should say, Detective Chen, let us maintain proper decorum."
- **Medium Severity**: "My word, Detective Chen, I must ask you to maintain proper decorum."
- **High Severity**: "Goodness gracious! I cannot believe you would speak to me in such a manner."

### **James Blackwood - Upper Class**
- **Low Severity**: "Quite so, Detective Chen, perhaps we could focus on appropriate matters."
- **Medium Severity**: "I must say, such language is quite unbecoming of a professional investigation."
- **High Severity**: "I beg your pardon, but I will not tolerate such disrespectful language."

### **Elena Rodriguez - Professional**
- **Low Severity**: "I should say, Detective Chen, let us maintain professional standards."
- **Medium Severity**: "I must say, Detective Chen, such language is not appropriate for our investigation."
- **High Severity**: "I must say, Detective Chen, such language is quite unacceptable. I shall not continue this conversation."

## 🔧 **Technical Implementation**

### **Core Files**
- `lib/llmAbuseDetection.ts` - Main LLM-based detection system
- `lib/api.ts` - Enhanced with abuse detection API method
- `hooks/useChat.ts` - Integrated LLM detection in chat flow

### **Key Classes**

#### LLMAbuseDetectionSystem
```typescript
class LLMAbuseDetectionSystem {
  static async detectAbuse(message: string, characterName: string): Promise<LLMAbuseDetectionResult>
  static shouldAnalyze(message: string): boolean
  static get1947Response(severity: string, characterName: string): string
  static getIrrelevantResponse(characterName: string): string
}
```

#### LLMAbuseDetectionResult
```typescript
interface LLMAbuseDetectionResult {
  isAbusive: boolean;
  isIrrelevant: boolean;
  severity: 'low' | 'medium' | 'high';
  confidence: number; // 0-100
  reason: string;
  suggestedResponse?: string;
  detectedIntent: string;
}
```

## 🎯 **Benefits Over Hardcoded Systems**

### **Intelligence & Accuracy**
- **Context Understanding**: Knows "My stupid question" ≠ "You're stupid"
- **Intent Recognition**: Understands self-deprecating vs. directed abuse
- **Cultural Awareness**: Respects 1947 social norms and language
- **Reduced False Positives**: High confidence threshold prevents over-detection

### **Flexibility & Adaptability**
- **Language Evolution**: Adapts to new forms of inappropriate content
- **Cultural Sensitivity**: Understands period-appropriate expressions
- **Character Consistency**: Maintains authentic 1947 character responses
- **Investigation Focus**: Distinguishes relevant vs. irrelevant questions

### **User Experience**
- **Natural Conversation**: Allows normal conversation flow
- **Authentic Responses**: Characters react naturally to inappropriate behavior
- **Educational Value**: Teaches 1947 social norms through character reactions
- **Immersive Experience**: Maintains authentic 1947 atmosphere

## 🧪 **Testing & Validation**

### **Test Scenarios**
1. **Self-Deprecating Language**: "My stupid question", "I feel stupid"
2. **Expressions of Frustration**: "Damn, this is confusing", "Hell, I don't know"
3. **Direct Abuse**: "You're stupid", "You're an idiot", "Shut up!"
4. **Investigation Questions**: "Where were you?", "What happened?"
5. **Irrelevant Questions**: "What's your favorite color?", "Tell me about Facebook"

### **Expected Results**
- **Self-deprecating**: ✅ Allow through (not abusive)
- **Frustration expressions**: ✅ Allow through (not directed)
- **Direct abuse**: ❌ Trigger offline with 1947 response
- **Investigation questions**: ✅ Allow through (relevant)
- **Irrelevant questions**: ❌ Trigger offline with redirection

## 🔮 **Future Enhancements**

### **Potential Improvements**
- **Learning System**: AI learns from user patterns and adjusts sensitivity
- **Character-Specific Thresholds**: Different characters have different tolerance levels
- **Context Memory**: Remembers conversation context for better analysis
- **Multi-Language Support**: Detect inappropriate content in multiple languages
- **Emotion Analysis**: Understand emotional context of messages

### **Configuration Options**
- **Confidence Threshold**: Adjustable minimum confidence for triggering
- **Severity Levels**: Customizable severity classifications
- **Response Styles**: Character-specific response customization
- **Detection Sensitivity**: Fine-tune detection aggressiveness

## 📝 **Usage Examples**

### **Normal Conversation Flow**
```
User: "Hello"
System: ✅ OK - Normal greeting

User: "My stupid question is, where were you?"
System: ✅ OK - Self-deprecating but relevant investigation question

User: "I feel stupid asking this, but did you see anything?"
System: ✅ OK - Self-doubt but appropriate investigation question
```

### **Appropriate Offline Triggers**
```
User: "You're stupid"
System: ❌ OFFLINE - Direct insult, 1947 appropriate response

User: "What's your favorite color?"
System: ❌ OFFLINE - Irrelevant personal question

User: "Tell me about Facebook"
System: ❌ OFFLINE - Modern technology irrelevant to 1947 investigation
```

## 🎉 **Conclusion**

The LLM-Based Abuse Detection System represents a significant advancement in intelligent content moderation for interactive fiction. By understanding context, intent, and cultural nuance, it provides accurate detection while maintaining natural conversation flow and authentic 1947 character interactions.

This system ensures that players can have natural conversations while characters respond authentically to truly inappropriate behavior, creating a more immersive and educational experience in the Blackwood Manor murder mystery investigation.

---

**Ready for testing!** The system is now active and will provide intelligent, context-aware abuse detection for all character interactions. 🕵️‍♀️✨
