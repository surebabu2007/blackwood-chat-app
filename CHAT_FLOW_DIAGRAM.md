# 🔄 Chat System Flow Diagram

## Complete LLM Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                USER INTERACTION                                │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            INPUT VALIDATION LAYER                              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │ Length Check    │    │ Content Check   │    │ Security Validation         │ │
│  │ (≤500 chars)    │    │ (non-empty)     │    │ (XSS prevention)           │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            MESSAGE CREATION                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │ const userMessage: Message = {                                             │ │
│  │   id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,     │ │
│  │   characterId: currentCharacter.id,                                        │ │
│  │   content: content.trim(),                                                 │ │
│  │   timestamp: new Date(),                                                   │ │
│  │   type: 'user'                                                             │ │
│  │ };                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            STATE UPDATE                                        │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │ Add to Store    │    │ Set Typing      │    │ Update UI State             │ │
│  │ addMessage()    │    │ setTyping(true) │    │ isLoading = true            │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            CONTEXT BUILDING                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │ 1. Load Character Memory                                                   │ │
│  │ 2. Retrieve Conversation History (last 10 messages)                       │ │
│  │ 3. Get Investigation State                                                 │ │
│  │ 4. Build System Prompt with:                                              │ │
│  │    - Character personality & backstory                                    │ │
│  │    - Current emotional state & trust level                               │ │
│  │    - Detective context (Sarah Chen)                                      │ │
│  │    - Victim information (Victoria Blackwood)                             │ │
│  │    - Investigation progress & evidence                                    │ │
│  │    - Character relationships & secrets                                    │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            API REQUEST CONSTRUCTION                            │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │ const request: GenerativeAPIRequest = {                                    │ │
│  │   model: 'gemini-1.5-flash-latest',                                        │ │
│  │   systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] },  │ │
│  │   contents: [                                                              │ │
│  │     ...conversationHistory.slice(-10).map(msg => ({                       │ │
│  │       role: msg.type === 'user' ? 'user' : 'model',                       │ │
│  │       parts: [{ text: msg.content }]                                      │ │
│  │     })),                                                                   │ │
│  │     {                                                                      │ │
│  │       role: 'user',                                                        │ │
│  │       parts: [{ text: userMessage }]                                      │ │
│  │     }                                                                      │ │
│  │   ]                                                                        │ │
│  │ };                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            API COMMUNICATION                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │ 1. Add 30-second timeout                                                  │ │
│  │ 2. Send POST request to Google Generative Language API                    │ │
│  │ 3. Handle response with error checking                                    │ │
│  │ 4. Extract content from nested response structure                         │ │
│  │                                                                            │ │
│  │ Response Structure:                                                        │ │
│  │ {                                                                          │ │
│  │   success: boolean,                                                        │ │
│  │   data: {                                                                  │ │
│  │     data: {                                                                │ │
│  │       output: {                                                            │ │
│  │         message: {                                                         │ │
│  │           content: [{ text: string }]                                     │ │
│  │         }                                                                  │ │
│  │       }                                                                    │ │
│  │     }                                                                      │ │
│  │   }                                                                        │ │
│  │ }                                                                          │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            RESPONSE PROCESSING                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │ Extract Content │    │ Analyze Emotion │    │ Create Character Message    │ │
│  │ from API        │    │ determineTone() │    │ with emotional context      │ │
│  │ response        │    │                 │    │                             │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            CHARACTER MESSAGE CREATION                          │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │ const characterMessage: Message = {                                        │ │
│  │   id: `character-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,│ │
│  │   characterId: currentCharacter.id,                                        │ │
│  │   content: responseContent.trim(),                                         │ │
│  │   timestamp: new Date(),                                                   │ │
│  │   type: 'character',                                                       │ │
│  │   emotionalTone: determineEmotionalTone(responseContent, character)        │ │
│  │ };                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            STATE UPDATES                                       │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │ Add Message     │    │ Update Memory   │    │ Update Investigation        │ │
│  │ addMessage()    │    │ updateCharacter │    │ checkForEvidence()          │ │
│  │                 │    │ Memory()        │    │ updateInvestigationProgress()│ │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            UI UPDATE                                           │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │ Set Typing      │    │ Update Messages │    │ Scroll to Bottom            │ │
│  │ setTyping(false)│    │ Display in UI   │    │ Auto-scroll behavior        │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            ERROR HANDLING                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │ If API fails:                                                              │ │
│  │ 1. Show user-friendly error message                                       │ │
│  │ 2. Add error message to conversation                                      │ │
│  │ 3. Allow retry                                                            │ │
│  │ 4. Log error for debugging                                                │ │
│  │                                                                            │ │
│  │ Error Types:                                                               │ │
│  │ - Network timeout (30s)                                                   │ │
│  │ - API authentication failure                                              │ │
│  │ - Invalid response format                                                 │ │
│  │ - Input validation errors                                                 │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘

```

## Memory Management Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            CHARACTER MEMORY SYSTEM                             │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            MEMORY COMPONENTS                                   │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │ Conversation    │    │ Trust Level     │    │ Emotional State             │ │
│  │ History         │    │ Tracking        │    │ Management                  │ │
│  │ (per character) │    │ (0-100 scale)   │    │ (neutral, defensive, etc.)  │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────────┘ │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │ Revealed        │    │ Investigation   │    │ Relationship                │ │
│  │ Secrets         │    │ Progress        │    │ Scores                      │ │
│  │ (what they told)│    │ (case progress) │    │ (with other characters)     │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            MEMORY PERSISTENCE                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │ 1. Local Storage (Zustand persist)                                        │ │
│  │ 2. Automatic rehydration on page load                                     │ │
│  │ 3. Date object conversion (string ↔ Date)                                 │ │
│  │ 4. Separate memory per character                                          │ │
│  │                                                                            │ │
│  │ Memory Structure:                                                          │ │
│  │ conversations: {                                                           │ │
│  │   'james-blackwood': {                                                    │ │
│  │     messages: [...],                                                      │ │
│  │     context: { trustLevel, emotionalState, ... }                          │ │
│  │   },                                                                       │ │
│  │   'elena-rodriguez': { ... }                                              │ │
│  │ }                                                                          │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘

```

## Error Recovery Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            ERROR DETECTION                                     │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            ERROR CLASSIFICATION                                │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │ Network Errors  │    │ API Errors      │    │ Input Errors                │ │
│  │ - Timeout       │    │ - Auth failure  │    │ - Length violation          │ │
│  │ - Connection    │    │ - Invalid resp  │    │ - Empty content             │ │
│  │ - DNS failure   │    │ - Rate limiting │    │ - XSS attempt               │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────────┘ │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │ State Errors    │    │ UI Errors       │    │ System Errors               │ │
│  │ - Corrupted     │    │ - Component     │    │ - Memory issues             │ │
│  │   state         │    │   crash         │    │ - Performance               │ │
│  │ - Missing data  │    │ - Render error  │    │ - Resource limits           │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            ERROR RECOVERY                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │ 1. Log Error (with context)                                               │ │
│  │ 2. Show User-Friendly Message                                             │ │
│  │ 3. Attempt Recovery (retry, fallback)                                     │ │
│  │ 4. Update UI State (loading, error states)                               │ │
│  │ 5. Allow User Action (retry, continue)                                    │ │
│  │                                                                            │ │
│  │ Recovery Strategies:                                                       │ │
│  │ - API timeout → Retry with exponential backoff                           │ │
│  │ - Network error → Show offline message, retry when online                │ │
│  │ - Input error → Show validation message, allow correction                │ │
│  │ - State error → Reset to safe state, reload data                         │ │
│  │ - UI error → Error boundary catches, shows fallback UI                   │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘

```

## Performance Optimization Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            PERFORMANCE LAYERS                                 │
└─────────────────────┬───────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            OPTIMIZATION STRATEGIES                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │ Message ID      │    │ Conversation    │    │ State Updates               │ │
│  │ Collision       │    │ History         │    │ Batching                    │ │
│  │ Prevention      │    │ Limiting        │    │                             │ │
│  │ (timestamp +    │    │ (last 10 msgs)  │    │ (atomic updates)            │ │
│  │  random)        │    │                 │    │                             │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────────┘ │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │ Component       │    │ API Request     │    │ Memory Management           │ │
│  │ Memoization     │    │ Caching         │    │ (efficient cleanup)         │ │
│  │ (useCallback,   │    │ (response       │    │                             │ │
│  │  useMemo)       │    │  caching)       │    │                             │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘

```

This comprehensive flow diagram shows the complete technical implementation of the chat system, from user input to LLM response processing, including error handling, memory management, and performance optimizations.
