# Timeline and World Context Integration Guide

## Overview
This guide explains how the new timeline and world context system integrates with the existing chat system to ensure characters respond according to the investigation timeline and world constraints from `script.rpy`.

## Key Components

### 1. Timeline Manager (`lib/timeline.ts`)
- **Purpose**: Manages investigation phases, timeline events, and character constraints
- **Key Features**:
  - Timeline events based on `script.rpy` chronology
  - Character knowledge constraints per timeline event
  - Investigation phase progression
  - Response validation against timeline constraints

### 2. Character Availability Manager (`lib/characterAvailability.ts`)
- **Purpose**: Controls which characters are available for interaction
- **Key Features**:
  - Character availability based on investigation progress
  - Location-based character availability
  - Trust level requirements
  - Emotional state management

### 3. Enhanced API Integration (`lib/api.ts`)
- **Purpose**: Integrates timeline context into character response generation
- **Key Features**:
  - Timeline context injection into system prompts
  - Character constraint validation
  - Response filtering for forbidden content

### 4. Updated Chat Hook (`hooks/useChat.ts`)
- **Purpose**: Validates and filters character responses
- **Key Features**:
  - Response validation against timeline constraints
  - Content filtering for forbidden topics
  - Timeline progress tracking

## Timeline Events (Based on script.rpy)

### Investigation Timeline
1. **Victoria's Death** (9:27 PM) - Study
   - All characters know about this
   - Different trust levels required to discuss details

2. **Lily's Visit** (9:20-9:25 PM) - Study
   - Only Lily and butler witnessed
   - Lily can reveal disinheritance plan with 40% trust

3. **James's Visit** (9:05-9:15 PM) - Study
   - Only James and butler witnessed
   - James can reveal gambling debts with 50% trust

4. **Dr. Elena's Visit** (8:55-9:00 PM) - Study
   - Only Elena and butler witnessed
   - Elena can reveal medical issues with 75% trust

5. **Marcus's Visit** (8:40-8:50 PM) - Study
   - Only Marcus and butler witnessed
   - Marcus can reveal business issues with 70% trust

6. **Wine Delivery** (8:35 PM) - Study
   - Only butler witnessed
   - Butler can reveal wine details with 10% trust

7. **Victoria Working** (8:30 PM) - Study
   - Only butler witnessed
   - Butler can reveal work details with 10% trust

## Investigation Phases

### Phase 1: Initial Arrival (0-10% progress)
- **Available Characters**: Mr. Thompson (butler)
- **Available Locations**: mansion_entrance, study
- **Character Constraints**: Butler is cooperative and open

### Phase 2: Crime Scene Investigation (10-25% progress)
- **Available Characters**: Mr. Thompson
- **Available Locations**: study, mansion_entrance
- **Character Constraints**: Butler provides basic information

### Phase 3: Initial Interviews (25-50% progress)
- **Available Characters**: Mr. Thompson, James Blackwood, Marcus Reynolds
- **Available Locations**: study, dining_room, library
- **Character Constraints**: Characters become more guarded

### Phase 4: Deep Investigation (50-75% progress)
- **Available Characters**: All characters
- **Available Locations**: All locations
- **Character Constraints**: Characters reveal more with higher trust

### Phase 5: Final Confrontation (75-100% progress)
- **Available Characters**: All characters
- **Available Locations**: All locations
- **Character Constraints**: Characters become defensive as investigation concludes

## Character Constraints

### Mr. Thompson (Butler)
- **Availability**: Always available
- **Trust Required**: Low (10-30%)
- **Information Sharing**: Open and cooperative
- **Timeline Knowledge**: All events (witnessed most)
- **Forbidden Topics**: None

### James Blackwood (Brother)
- **Availability**: 25% progress onwards
- **Trust Required**: Medium (50-80%)
- **Information Sharing**: Guarded, becomes defensive
- **Timeline Knowledge**: Victoria's death, his visit
- **Forbidden Topics**: Murder weapon details, other suspects' visits

### Marcus Reynolds (Business Partner)
- **Availability**: 25% progress onwards
- **Trust Required**: Medium (70-85%)
- **Information Sharing**: Secretive, manipulative
- **Timeline Knowledge**: Victoria's death, his visit
- **Forbidden Topics**: Embezzlement details, financial irregularities

### Dr. Elena Rodriguez (Doctor)
- **Availability**: 50% progress onwards
- **Trust Required**: High (75-90%)
- **Information Sharing**: Professional but guarded
- **Timeline Knowledge**: Victoria's death, her visit
- **Forbidden Topics**: Medical malpractice, medication interactions

### Lily Chen (Niece)
- **Availability**: 50% progress onwards
- **Trust Required**: High (85-100%)
- **Information Sharing**: Open but emotional
- **Timeline Knowledge**: Victoria's death, her visit
- **Forbidden Topics**: Murder weapon, financial details

## Implementation Details

### Response Validation
```typescript
const validation = TimelineManager.validateCharacterResponse(
  characterId, 
  responseContent, 
  trustLevel
);

if (!validation.isValid) {
  // Filter out forbidden content
  finalResponse = filterResponseContent(responseContent, validation.violations);
}
```

### Character Availability Check
```typescript
const availability = CharacterAvailabilityManager.getCharacterAvailability(
  characterId, 
  currentProgress, 
  currentLocation
);

if (!availability.isAvailable) {
  // Show locked character with reason
}
```

### Timeline Context Injection
```typescript
const timelineContext = TimelineManager.getResponseContext(
  characterId, 
  trustLevel
);
// Timeline context is automatically added to system prompts
```

## Usage Examples

### 1. Character Selection
```typescript
// Characters are automatically filtered based on investigation progress
const availableCharacters = CharacterAvailabilityManager.getAvailableCharacters(
  allCharacters, 
  investigationProgress, 
  currentLocation
);
```

### 2. Response Generation
```typescript
// Timeline context is automatically included in API calls
const response = await ClaudeAPI.generateCharacterResponse(
  character,
  userMessage,
  conversationHistory,
  characterMemory
);
```

### 3. Progress Tracking
```typescript
// Timeline manager is automatically updated when progress changes
TimelineManager.updateProgress(newProgress);
```

## Benefits

1. **Consistency**: Characters respond according to their actual knowledge and timeline position
2. **Immersion**: Players experience a realistic investigation progression
3. **Challenge**: Higher trust levels required for sensitive information
4. **Replayability**: Different character availability creates varied playthroughs
5. **Story Integrity**: Prevents characters from revealing information they shouldn't know

## Testing

To test the integration:

1. Start with low investigation progress (5%) - only butler should be available
2. Increase progress to 25% - James and Marcus become available
3. Increase to 50% - Elena and Lily become available
4. Test character responses for timeline violations
5. Verify trust level requirements for sensitive information

## Troubleshooting

### Characters Not Available
- Check investigation progress percentage
- Verify character constraints in timeline
- Ensure proper phase progression

### Responses Not Following Timeline
- Verify timeline context injection
- Check character constraints
- Review response validation logic

### Trust Level Issues
- Ensure trust level tracking
- Check character memory updates
- Verify trust requirements in constraints

## Future Enhancements

1. **Dynamic Trust Requirements**: Adjust based on conversation quality
2. **Location-Specific Responses**: Characters react differently in different rooms
3. **Time-Based Availability**: Characters available only at certain times
4. **Relationship Dynamics**: Character interactions affect availability
5. **Evidence-Based Unlocking**: Specific evidence unlocks character availability
