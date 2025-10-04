/**
 * Character Availability System
 * Manages which characters are available for interaction based on timeline and investigation progress
 */

import { Character } from './types';
import { TimelineManager } from './timeline';

export interface CharacterAvailability {
  characterId: string;
  isAvailable: boolean;
  reason?: string;
  requiredProgress?: number;
  availableLocations?: string[];
  trustRequirement?: number;
}

export class CharacterAvailabilityManager {
  /**
   * Get available characters based on current investigation progress and location
   * All characters are now available from the start for natural 1947 interactions
   */
  static getAvailableCharacters(
    allCharacters: Character[], 
    currentProgress: number, 
    currentLocation: string
  ): Character[] {
    // All characters are available from the start for natural 1947 interactions
    // Their responses are controlled by timeline constraints and 1947 context
    return allCharacters;
  }

  /**
   * Get character availability details
   * All characters are available from the start for natural 1947 interactions
   */
  static getCharacterAvailability(
    characterId: string, 
    currentProgress: number, 
    currentLocation: string
  ): CharacterAvailability {
    const constraints = TimelineManager.getCharacterConstraints(characterId);
    const currentPhase = TimelineManager.getCurrentPhase();
    
    if (!constraints) {
      return {
        characterId,
        isAvailable: false,
        reason: 'Character not found in timeline'
      };
    }

    // All characters are available from the start for natural 1947 interactions
    // Their responses are controlled by timeline constraints and 1947 context
    return {
      characterId,
      isAvailable: true,
      availableLocations: currentPhase.availableLocations,
      reason: 'Available for 1947 investigation'
    };
  }

  /**
   * Check if character can be interviewed at current location
   */
  static canInterviewAtLocation(characterId: string, location: string): boolean {
    const constraints = TimelineManager.getCharacterConstraints(characterId);
    const currentPhase = TimelineManager.getCurrentPhase();
    
    if (!constraints) return false;
    
    // Check if location is available in current phase
    return currentPhase.availableLocations.includes(location);
  }

  /**
   * Get characters available for specific location
   */
  static getCharactersForLocation(
    allCharacters: Character[], 
    location: string, 
    currentProgress: number
  ): Character[] {
    return allCharacters.filter(character => {
      const availability = this.getCharacterAvailability(character.id, currentProgress, location);
      return availability.isAvailable && this.canInterviewAtLocation(character.id, location);
    });
  }

  /**
   * Get next available characters based on investigation progress
   */
  static getNextAvailableCharacters(
    allCharacters: Character[], 
    currentProgress: number
  ): { character: Character; requiredProgress: number }[] {
    const nextCharacters: { character: Character; requiredProgress: number }[] = [];
    
    allCharacters.forEach(character => {
      const availability = this.getCharacterAvailability(character.id, currentProgress, '');
      
      if (!availability.isAvailable && availability.requiredProgress) {
        nextCharacters.push({
          character,
          requiredProgress: availability.requiredProgress
        });
      }
    });
    
    return nextCharacters.sort((a, b) => a.requiredProgress - b.requiredProgress);
  }

  /**
   * Check if character should reveal specific information
   */
  static shouldRevealInformation(
    characterId: string, 
    information: string, 
    trustLevel: number, 
    currentProgress: number
  ): boolean {
    const constraints = TimelineManager.getCharacterConstraints(characterId);
    if (!constraints) return false;

    // Check if information is forbidden
    if (constraints.knowledgeLimits.forbiddenTopics.includes(information)) {
      return false;
    }

    // Check trust requirements
    if (trustLevel < constraints.knowledgeLimits.maxTrustLevel) {
      return false;
    }

    // Check if character can reveal this information
    return TimelineManager.canCharacterReveal(characterId, information, trustLevel);
  }

  /**
   * Get character's current emotional state based on investigation progress
   */
  static getCharacterEmotionalState(
    characterId: string, 
    currentProgress: number, 
    trustLevel: number
  ): string {
    const constraints = TimelineManager.getCharacterConstraints(characterId);
    if (!constraints) return 'neutral';

    let emotionalState = constraints.behavioralConstraints.emotionalState;

    // Adjust emotional state based on investigation progress
    if (currentProgress > 75) {
      // Late investigation - characters may be more defensive
      if (emotionalState === 'neutral') {
        emotionalState = 'defensive';
      }
    } else if (currentProgress < 25) {
      // Early investigation - characters may be more open
      if (emotionalState === 'defensive' && trustLevel > 30) {
        emotionalState = 'neutral';
      }
    }

    // Adjust based on trust level
    if (trustLevel < 20) {
      emotionalState = 'defensive';
    } else if (trustLevel > 70) {
      if (emotionalState === 'defensive') {
        emotionalState = 'neutral';
      }
    }

    return emotionalState;
  }

  /**
   * Get character's information sharing behavior
   */
  static getInformationSharingBehavior(
    characterId: string, 
    currentProgress: number, 
    trustLevel: number
  ): string {
    const constraints = TimelineManager.getCharacterConstraints(characterId);
    if (!constraints) return 'guarded';

    let behavior = constraints.behavioralConstraints.informationSharing;

    // Adjust behavior based on trust level
    if (trustLevel > 80) {
      behavior = 'open';
    } else if (trustLevel < 30) {
      behavior = 'secretive';
    }

    // Adjust based on investigation progress
    if (currentProgress > 80) {
      // Late investigation - characters may become more secretive
      if (behavior === 'open') {
        behavior = 'guarded';
      }
    }

    return behavior;
  }
}
