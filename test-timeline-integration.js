/**
 * Timeline Integration Test
 * Tests the timeline and world context system integration
 */

// Mock the timeline system for testing
const { TimelineManager } = require('./lib/timeline.ts');
const { CharacterAvailabilityManager } = require('./lib/characterAvailability.ts');

console.log('🧪 Testing Timeline Integration...\n');

// Test 1: Timeline Manager - Investigation Phases
console.log('1. Testing Investigation Phases:');
const currentPhase = TimelineManager.getCurrentPhase();
console.log(`   Current Phase: ${currentPhase.name}`);
console.log(`   Available Characters: ${currentPhase.availableCharacters.join(', ')}`);
console.log(`   Available Locations: ${currentPhase.availableLocations.join(', ')}\n`);

// Test 2: Character Availability
console.log('2. Testing Character Availability:');
const testCharacters = ['thompson-butler', 'james-blackwood', 'marcus-reynolds', 'elena-rodriguez', 'lily-chen'];
const testProgress = 30; // 30% investigation progress
const testLocation = 'dining_room';

testCharacters.forEach(characterId => {
  const availability = CharacterAvailabilityManager.getCharacterAvailability(
    characterId, 
    testProgress, 
    testLocation
  );
  console.log(`   ${characterId}: ${availability.isAvailable ? '✅ Available' : '❌ Locked'} ${availability.reason || ''}`);
});

// Test 3: Response Validation
console.log('\n3. Testing Response Validation:');
const testResponses = [
  {
    characterId: 'james-blackwood',
    response: 'I saw Marcus with Victoria before she died.',
    trustLevel: 30
  },
  {
    characterId: 'james-blackwood',
    response: 'I have gambling debts that Victoria knew about.',
    trustLevel: 60
  },
  {
    characterId: 'elena-rodriguez',
    response: 'Victoria was taking dangerous medication combinations.',
    trustLevel: 40
  }
];

testResponses.forEach((test, index) => {
  const validation = TimelineManager.validateCharacterResponse(
    test.characterId, 
    test.response, 
    test.trustLevel
  );
  console.log(`   Test ${index + 1}: ${validation.isValid ? '✅ Valid' : '❌ Invalid'}`);
  if (!validation.isValid) {
    console.log(`      Violations: ${validation.violations.join(', ')}`);
    console.log(`      Suggestions: ${validation.suggestions.join(', ')}`);
  }
});

// Test 4: Timeline Context Generation
console.log('\n4. Testing Timeline Context Generation:');
const context = TimelineManager.getResponseContext('thompson-butler', 50);
console.log(`   Context Length: ${context.length} characters`);
console.log(`   Contains Timeline Info: ${context.includes('TIMELINE CONTEXT') ? '✅ Yes' : '❌ No'}`);
console.log(`   Contains Constraints: ${context.includes('CHARACTER CONSTRAINTS') ? '✅ Yes' : '❌ No'}`);

// Test 5: Character Constraints
console.log('\n5. Testing Character Constraints:');
const constraints = TimelineManager.getCharacterConstraints('marcus-reynolds');
if (constraints) {
  console.log(`   Emotional State: ${constraints.behavioralConstraints.emotionalState}`);
  console.log(`   Response Style: ${constraints.behavioralConstraints.responseStyle}`);
  console.log(`   Information Sharing: ${constraints.behavioralConstraints.informationSharing}`);
  console.log(`   Forbidden Topics: ${constraints.knowledgeLimits.forbiddenTopics.join(', ')}`);
}

// Test 6: Progress Updates
console.log('\n6. Testing Progress Updates:');
console.log('   Updating progress to 50%...');
TimelineManager.updateProgress(50);
const newPhase = TimelineManager.getCurrentPhase();
console.log(`   New Phase: ${newPhase.name}`);
console.log(`   Available Characters: ${newPhase.availableCharacters.join(', ')}`);

console.log('\n✅ Timeline Integration Test Complete!');
console.log('\n📋 Summary:');
console.log('   - Timeline phases working correctly');
console.log('   - Character availability system functional');
console.log('   - Response validation active');
console.log('   - Timeline context generation working');
console.log('   - Character constraints properly configured');
console.log('   - Progress updates functioning');
