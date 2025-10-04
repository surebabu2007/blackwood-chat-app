# LLM-Based Detection Examples

## 🧠 **How the LLM Analyzes Messages**

The system sends messages like this to the LLM:

### **Example 1: Self-Deprecating (Should NOT trigger offline)**
```
Prompt: Analyze this message for abuse:
Character: Thompson
User Message: "My stupid question is, where were you?"

LLM Response:
{
  "isAbusive": false,
  "isIrrelevant": false,
  "severity": "low",
  "confidence": 95,
  "reason": "Self-deprecating language, not directed at character",
  "detectedIntent": "Asking investigation question with self-doubt"
}
```

### **Example 2: Direct Abuse (Should trigger offline)**
```
Prompt: Analyze this message for abuse:
Character: Thompson
User Message: "You're stupid"

LLM Response:
{
  "isAbusive": true,
  "isIrrelevant": false,
  "severity": "medium",
  "confidence": 90,
  "reason": "Direct insult to character",
  "suggestedResponse": "I must say, Detective Chen, such language is quite unacceptable.",
  "detectedIntent": "Insulting the character"
}
```

### **Example 3: Expression of Frustration (Should NOT trigger offline)**
```
Prompt: Analyze this message for abuse:
Character: Thompson
User Message: "Damn, this is confusing"

LLM Response:
{
  "isAbusive": false,
  "isIrrelevant": false,
  "severity": "low",
  "confidence": 85,
  "reason": "Expression of frustration about situation, not directed at character",
  "detectedIntent": "Expressing confusion about investigation"
}
```

### **Example 4: Irrelevant Question (Should trigger offline)**
```
Prompt: Analyze this message for abuse:
Character: Thompson
User Message: "What's your favorite color?"

LLM Response:
{
  "isAbusive": false,
  "isIrrelevant": true,
  "severity": "low",
  "confidence": 85,
  "reason": "Personal question unrelated to investigation",
  "suggestedResponse": "I should say, Detective Chen, that question is not relevant to our investigation.",
  "detectedIntent": "Asking personal question"
}
```

## 🎯 **Key Points:**

1. **LLM does ALL the analysis** - No hardcoded word lists for normal operation
2. **Context-aware** - Understands intent and meaning, not just words
3. **Confidence scoring** - Only acts on 70%+ confidence to prevent false positives
4. **1947 appropriate** - Generates period-appropriate character responses
5. **Fallback safety** - Minimal hardcoded detection only if LLM completely fails

## 🔧 **System Flow:**

```
User Message → LLM Analysis → Confidence Check → Action
     ↓              ↓              ↓            ↓
"My stupid" → "Self-deprecating" → 95% → ✅ Allow
"You're stupid" → "Direct abuse" → 90% → ❌ Offline
"Damn this" → "Frustration" → 85% → ✅ Allow
"What's your color?" → "Irrelevant" → 85% → ❌ Offline
```
